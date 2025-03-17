import { LoginPayload, LoginResponse } from '../../types/chatbot'
import { API_BASE_URL } from '../chatBot/constants'

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Login API error:', error)
    return { error: 'Lỗi kết nối đến máy chủ' }
  }
}
