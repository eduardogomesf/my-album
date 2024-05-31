import { api } from "../lib/axios"

interface SignUpDTO {
  firstName: string
  lastName: string
  cellphone: string
  email: string
  password: string
}

export const signUp = async (payload: SignUpDTO) => {
  await api.post('/users', payload)
}