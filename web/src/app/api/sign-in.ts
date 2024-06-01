import { api } from '../lib/axios'

interface SignInDTO {
  email: string
  password: string
}

export const signIn = async (data: SignInDTO) => {
  const response = await api.post('/login', data)
  return response.data
}
