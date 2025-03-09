import { ChatbotResponse } from '../../types/chatbot'
import { API_BASE_URL } from './constants'

export const sendQuestionToChatbot = async (
  question: string
): Promise<ChatbotResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data: ChatbotResponse = await response.json()
    return data
  } catch (error) {
    console.error('Lỗi khi gửi câu hỏi:', error)
    return {
      question,
      answer: 'Đã xảy ra lỗi khi gọi chatbot.',
      suggested_questions: [],
    }
  }
}
