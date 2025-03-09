import React, { useState } from 'react'
import { sendQuestionToChatbot } from '../api/chatBot/postQuestion'
import { ChatbotResponse } from '../types/chatbot'

const ChatBot: React.FC = () => {
  const [input, setInput] = useState('')
  const [chatHistory, setChatHistory] = useState<ChatbotResponse[]>([])
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    setLoading(true)
    const response = await sendQuestionToChatbot(input)
    console.log(response)

    setChatHistory((prev) => [...prev, response])
    setInput('')
    setLoading(false)
  }

  const handleSuggestClick = (question: string) => {
    setInput(question)
  }

  return (
    <div className="max-w-xl mx-auto mt-10 border rounded-2xl shadow-lg p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4">🤖 Chatbot</h2>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {chatHistory.map((chat, idx) => (
          <div key={idx} className="space-y-2">
            <div className="text-right">
              <div className="inline-block bg-blue-100 text-blue-900 px-4 py-2 rounded-xl">
                {chat.question}
              </div>
            </div>
            <div className="text-left">
              <div className="inline-block bg-gray-100 text-gray-900 px-4 py-2 rounded-xl">
                {chat.answer}
              </div>
              {chat.suggested_questions.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  Gợi ý:
                  <ul className="list-disc list-inside">
                    {chat.suggested_questions.map((suggest, i) => (
                      <li key={i}>
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => handleSuggestClick(suggest)}
                        >
                          {suggest}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Nhập câu hỏi..."
          className="flex-1 border border-gray-300 px-4 py-2 rounded-xl focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl disabled:opacity-50"
          disabled={loading}
        >
          {loading ? '...' : 'Gửi'}
        </button>
      </div>
    </div>
  )
}

export default ChatBot
