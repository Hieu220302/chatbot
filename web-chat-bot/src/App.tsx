import React, { useState } from 'react'
import Header from './component/Header'
import ChatBot from './component/ChatBot'
import AdminPanel from './component/AdminPanel'
import { Box } from '@mui/material'
import Footer from './component/Footer'
import { ToastContainer } from 'react-toastify'

const App: React.FC = () => {
  const [view, setView] = useState<'chat' | 'admin'>('chat')

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'gray',
        minHeight: '100vh',
      }}
    >
      <Header onSelectView={setView} view={view} />
      {view === 'chat' ? <ChatBot /> : <AdminPanel />}
      <Footer />
      <ToastContainer position="top-right" autoClose={500} />
    </Box>
  )
}

export default App
