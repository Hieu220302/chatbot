import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  Avatar,
  Divider,
} from '@mui/material'
import { sendQuestionToChatbot } from '../api/chatBot/postQuestion'
import { ChatbotResponse } from '../types/chatbot'
import PersonIcon from '@mui/icons-material/Person'
import SmartToyIcon from '@mui/icons-material/SmartToy'

const ChatBot: React.FC = () => {
  const [input, setInput] = useState('')
  const [chatHistory, setChatHistory] = useState<ChatbotResponse[]>([])
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  const handleSend = async () => {
    if (!input.trim()) return

    setLoading(true)
    const response = await sendQuestionToChatbot(input)
    setChatHistory((prev) => [...prev, response])
    setInput('')
    setLoading(false)
  }

  const handleSuggestClick = (question: string) => {
    setInput(question)
  }

  useEffect(() => {
    chatEndRef.current?.scrollTo({
      top: chatEndRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [chatHistory, loading])

  return (
    <Container
      sx={{
        height: '900px',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#121212',
        color: '#f5f5f5',
        padding: '20px',
        borderRadius: '10px',
        overflow: 'hidden',
      }}
    >
      {/* Chat Display Area */}
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          p: 2,
          overflowY: 'auto',
          borderRadius: 3,
          bgcolor: '#1e1e1e',
        }}
        ref={chatEndRef}
      >
        <Stack spacing={3}>
          {chatHistory.map((chat, idx) => (
            <Box key={idx}>
              {/* User message */}
              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                alignItems="flex-start"
              >
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: '#1976d2',
                    color: 'white',
                    maxWidth: '75%',
                  }}
                >
                  <Typography>{chat.question}</Typography>
                </Paper>
                <Avatar sx={{ bgcolor: '#1976d2' }}>
                  <PersonIcon />
                </Avatar>
              </Stack>

              {/* Bot response */}
              <Stack direction="row" spacing={2} mt={2} alignItems="flex-start">
                <Avatar sx={{ bgcolor: '#555' }}>
                  <SmartToyIcon />
                </Avatar>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: '#2c2c2c',
                    color: '#f1f1f1',
                    maxWidth: '75%',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  <Typography variant="body1">{chat.answer}</Typography>
                </Paper>
              </Stack>

              {/* Suggestions */}
              {chat.suggested_questions.length > 0 && (
                <Box ml={7} mt={1}>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    gutterBottom
                    sx={{ color: '#aaa' }}
                  >
                    Gợi ý:
                  </Typography>
                  <Stack spacing={1}>
                    {chat.suggested_questions.map((suggest, i) => (
                      <Button
                        key={i}
                        variant="text"
                        size="small"
                        onClick={() => handleSuggestClick(suggest)}
                        sx={{
                          textAlign: 'left',
                          justifyContent: 'flex-start',
                          pl: 0,
                          color: '#90caf9',
                          width: 'fit-content',
                        }}
                      >
                        • {suggest}
                      </Button>
                    ))}
                  </Stack>
                </Box>
              )}

              <Divider sx={{ my: 3, borderColor: '#333' }} />
            </Box>
          ))}
          {loading && (
            <Stack direction="row" spacing={2} alignItems="center">
              <CircularProgress size={20} sx={{ color: '#90caf9' }} />
              <Typography variant="body2">Đang phản hồi...</Typography>
            </Stack>
          )}
        </Stack>
      </Paper>

      {/* Input Area */}
      <Box mt={2} display="flex" gap={2}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Nhập câu hỏi..."
          variant="outlined"
          size="small"
          InputProps={{
            sx: {
              bgcolor: '#1e1e1e',
              color: '#fff',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#444',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#666',
              },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={loading}
          sx={{ px: 4, bgcolor: '#1976d2' }}
        >
          {loading ? '...' : 'Gửi'}
        </Button>
      </Box>
    </Container>
  )
}

export default ChatBot
