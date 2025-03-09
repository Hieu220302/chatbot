// src/App.tsx
import React from 'react'
import ChatBot from './component/ChatBot'

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <ChatBot />
    </div>
  )
}

export default App
