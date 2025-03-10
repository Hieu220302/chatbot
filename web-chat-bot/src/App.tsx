import React from 'react'
import Header from './component/Header'
import ChatBot from './component/ChatBot'
import { Box } from '@mui/material'
import Footer from './component/Footer'

const App: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'gray',
      }}
    >
      <Header />
      <ChatBot />
      <Footer />
    </Box>
  )
}

export default App
