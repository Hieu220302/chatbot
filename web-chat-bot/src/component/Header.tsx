import React, { useRef, useState } from 'react'
import Typography from '@mui/material/Typography'
import { Box, Button, Popper, Paper, Fade } from '@mui/material'
import LoginForm from './LoginForm'
import { login } from '../api/login/login' // đường dẫn tùy bạn cấu trúc
import { toast } from 'react-toastify'

const Header: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const anchorRef = useRef(null)

  const handleLogin = async () => {
    const result = await login({ email, password })
    if (result.error) {
      toast.error('Đăng nhập thất bại')
    } else {
      toast.success('Đăng nhập thành công')
      if (result.user) {
        localStorage.setItem('user', result.user)
      }
    }

    setOpen(false)
  }

  const handleMouseLeave = () => {
    setTimeout(() => {
      setOpen(false)
    }, 200)
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

      {/* Bọc nút và popup để xử lý hover */}
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

        {/* Popper hiện ngay dưới nút */}
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
    </Box>
  )
}

export default Header
