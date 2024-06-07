import { api } from '../lib/axios'

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

export async function getUserProfile(): Promise<UserProfile> {
  const response = await api.get('/users/profile')
  return response.data
}
