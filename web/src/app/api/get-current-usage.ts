import { api } from '../lib/axios'

interface CurrentUsage {
  available: number
  currentUsage: number
  maxStorage: number
  canAddMore: boolean
}

export async function getCurrentUsage(): Promise<CurrentUsage> {
  const response = await api.get('/file-management/api/v1/storage')
  return response?.data
}
