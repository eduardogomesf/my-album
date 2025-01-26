import { api } from '../lib/axios'

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

export async function getUserProfile(): Promise<UserProfile> {
  const response = await api.get('/user-management/api/v1/users/profile')
  return response.data
}
