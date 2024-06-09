import { api } from "../lib/axios";

interface CurrentUsage {
  available: number
  currentUsage: number
  maxStorage: number
  canAddMore: boolean
}

export async function getCurrentUsage(): Promise<CurrentUsage> {
  const response = await api.get('/storage')
  return response?.data
}