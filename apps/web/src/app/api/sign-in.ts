import { api } from '../lib/axios'

interface SignInDTO {
  email: string
  password: string
}

export const signIn = async (data: SignInDTO) => {
  const response = await api.post('/user-management/api/v1/login', data, {
    withCredentials: true,
  })
  return response.data
}
