import { ChatbotResponse, UnansweredQA } from '../../types/chatbot'
import { API_BASE_URL } from './constants'

// 💬 Gửi câu hỏi tới chatbot
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
    console.error('❌ Lỗi khi gửi câu hỏi:', error)
    return {
      question,
      answer: 'Đã xảy ra lỗi khi gọi chatbot.',
      suggested_questions: [],
    }
  }
}

// 📥 Lấy tất cả câu hỏi chưa trả lời (optionally filtered by status)
export const getUnansweredQuestions = async (
  status?: string
): Promise<UnansweredQA[]> => {
  try {
    const url = status
      ? `${API_BASE_URL}/unanswered?status=${status}`
      : `${API_BASE_URL}/unanswered`

    const res = await fetch(url)
    if (!res.ok) throw new Error('Lỗi khi lấy câu hỏi chưa trả lời')
    return await res.json()
  } catch (error) {
    console.error('❌ Lỗi khi fetch unanswered:', error)
    return []
  }
}

// 📥 Lấy câu hỏi theo status cụ thể
export const getUnansweredByStatus = async (
  status: string
): Promise<UnansweredQA[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/unanswered?status=${status}`)
    if (!res.ok) throw new Error('Lỗi khi lọc câu hỏi')
    return await res.json()
  } catch (error) {
    console.error('❌ Lỗi khi lọc theo status:', error)
    return []
  }
}

// 🔁 Cập nhật hàng loạt câu hỏi
export const updateUnansweredBatch = async (
  updates: UnansweredQA[]
): Promise<{ updated: number; added_to_training: number } | string> => {
  try {
    const res = await fetch(`${API_BASE_URL}/unanswered/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })

    const result = await res.json()

    if (res.ok) {
      return {
        updated: result.updated || 0,
        added_to_training: result.added_to_training || 0,
      }
    } else {
      return result.error || '❌ Cập nhật thất bại'
    }
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật hàng loạt:', error)
    return '❌ Cập nhật hàng loạt thất bại'
  }
}

// ✏️ Cập nhật 1 câu hỏi
export const updateSingleUnanswered = async (
  id: number,
  update: Partial<UnansweredQA>
): Promise<string> => {
  try {
    const res = await fetch(`${API_BASE_URL}/unanswered/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    })

    const result = await res.json()
    return result.message || 'Cập nhật thành công'
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật câu hỏi:', error)
    return 'Cập nhật thất bại'
  }
}

// 🗑️ Xóa hàng loạt câu hỏi chưa trả lời
export const deleteUnansweredBatch = async (ids: number[]): Promise<string> => {
  try {
    const res = await fetch(`${API_BASE_URL}/delete-unanswered`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    })

    const result = await res.json()

    // 👇 lấy cụ thể message
    return result.message || result.error || 'Xóa thành công'
  } catch (error) {
    console.error('❌ Lỗi khi xóa câu hỏi:', error)
    return 'Xóa thất bại'
  }
}
