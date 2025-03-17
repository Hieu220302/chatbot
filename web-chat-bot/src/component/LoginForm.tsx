import React, { useState } from 'react'
import { TextField, Button, Box } from '@mui/material'

interface LoginFormProps {
  email: string
  password: string
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  handleLogin: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  setEmail,
  setPassword,
  handleLogin,
}) => {
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const validate = () => {
    let valid = true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      setEmailError('Email không hợp lệ')
      valid = false
    } else {
      setEmailError('')
    }

    if (password.trim() === '') {
      setPasswordError('Vui lòng nhập mật khẩu')
      valid = false
    } else {
      setPasswordError('')
    }

    return valid
  }

  const handleSubmit = () => {
    if (validate()) {
      handleLogin()
    }
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!emailError}
        helperText={emailError}
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!passwordError}
        helperText={passwordError}
        fullWidth
      />
      <Button variant="contained" onClick={handleSubmit}>
        Đăng nhập
      </Button>
    </Box>
  )
}

export default LoginForm
