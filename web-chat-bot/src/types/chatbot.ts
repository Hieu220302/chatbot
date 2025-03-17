export interface ChatbotResponse {
  question: string
  answer: string
  suggested_questions: string[]
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  message?: string
  user?: string
  error?: string
}
