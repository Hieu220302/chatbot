// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'

// Import font Be Vietnam Pro các trọng số dùng
import '@fontsource/be-vietnam-pro/400.css'
import '@fontsource/be-vietnam-pro/500.css'
import '@fontsource/be-vietnam-pro/700.css'

// Tạo theme dùng Be Vietnam Pro và dark mode
const theme = createTheme({
  palette: {
    mode: 'dark', // Giao diện tối
  },
  typography: {
    fontFamily: '"Be Vietnam Pro", "Roboto", "Arial", sans-serif',
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
