export interface GetAvailableStorageParams {
  userId: string
}

export interface GetAvailableStorageResponse {
  available: number
  canAddMore: boolean
  currentUsage: number
  maxStorage: number
}
