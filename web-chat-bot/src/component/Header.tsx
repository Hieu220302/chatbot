import React, { useRef, useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import { Box, Button, Popper, Paper, Fade } from '@mui/material'
import LoginForm from './LoginForm'
import { login } from '../api/login/login'
import { toast } from 'react-toastify'

interface HeaderProps {
  onSelectView: (view: 'chat' | 'admin') => void
  view: 'chat' | 'admin'
}

interface User {
  id: string
  name: string
  [key: string]: any
}

const Header: React.FC<HeaderProps> = ({ onSelectView, view }) => {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const anchorRef = useRef(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch (err) {
      console.error('Lỗi khi đọc user từ localStorage:', err)
    }
  }, [])

  const handleLogin = async () => {
    const result = await login({ email, password })
    if (result.error) {
      toast.error('Đăng nhập thất bại')
    } else {
      toast.success('Đăng nhập thành công')
      if (result.user && typeof result.user === 'object') {
        localStorage.setItem('user', JSON.stringify(result.user))
        setUser(result.user)
      }
    }
    setOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    onSelectView('chat') // quay về chatbot khi logout
    toast.info('Đã đăng xuất')
  }

  const handleManage = () => {
    onSelectView('admin')
    setOpen(false)
  }

  const handleMouseLeave = () => {
    setTimeout(() => {
      setOpen(false)
    }, 200)
  }

  const handleChatBot = () => {
    onSelectView('chat')
    setOpen(false)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: 'black',
        color: 'white',
        padding: '10px 20px',
        alignItems: 'center',
      }}
    >
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Chat Bot
      </Typography>

      {user ? (
        <Box
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={handleMouseLeave}
          sx={{ position: 'relative' }}
        >
          <Button
            ref={anchorRef}
            color="inherit"
            variant="outlined"
            sx={{
              borderRadius: '20px',
              borderColor: 'white',
              color: 'white',
              textTransform: 'none',
              px: 3,
              py: 1,
              backgroundColor: 'black',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'gray',
                borderColor: 'white',
              },
            }}
          >
            {user.name}
          </Button>

          <Popper
            open={open}
            anchorEl={anchorRef.current}
            placement="bottom-start"
            transition
            style={{ zIndex: 1600 }}
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={200}>
                <Paper
                  elevation={4}
                  sx={{ mt: 1, minWidth: 150 }}
                  onMouseEnter={() => setOpen(true)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Box sx={{ py: 1 }}>
                    {view !== 'admin' ? (
                      <Box
                        onClick={handleManage}
                        sx={{
                          px: 2,
                          py: 1,
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: '#f5f5f5',
                          },
                        }}
                      >
                        Quản lý
                      </Box>
                    ) : (
                      <Box
                        onClick={handleChatBot}
                        sx={{
                          px: 2,
                          py: 1,
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: '#f5f5f5',
                          },
                        }}
                      >
                        Chat Bot
                      </Box>
                    )}
                    <Box
                      onClick={handleLogout}
                      sx={{
                        px: 2,
                        py: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                        },
                      }}
                    >
                      Đăng xuất
                    </Box>
                  </Box>
                </Paper>
              </Fade>
            )}
          </Popper>
        </Box>
      ) : (
        <Box
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={handleMouseLeave}
          sx={{ position: 'relative' }}
        >
          <Button
            ref={anchorRef}
            color="inherit"
            variant="outlined"
            sx={{
              borderRadius: '20px',
              borderColor: 'white',
              color: 'white',
              textTransform: 'none',
              px: 3,
              py: 1,
              backgroundColor: 'black',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'gray',
                borderColor: 'white',
              },
            }}
          >
            Đăng nhập
          </Button>

          <Popper
            open={open}
            anchorEl={anchorRef.current}
            placement="bottom-start"
            transition
            style={{ zIndex: 1600 }}
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={200}>
                <Paper
                  elevation={4}
                  sx={{ p: 2, width: 300 }}
                  onMouseEnter={() => setOpen(true)}
                  onMouseLeave={handleMouseLeave}
                >
                  <LoginForm
                    email={email}
                    password={password}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    handleLogin={handleLogin}
                  />
                </Paper>
              </Fade>
            )}
          </Popper>
        </Box>
      )}
    </Box>
  )
}

export default Header
