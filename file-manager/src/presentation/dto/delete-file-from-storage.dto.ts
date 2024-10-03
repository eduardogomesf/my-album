export type DeleteFileFromStorageDTO = {
  id: string
  filesIds: string[]
  userId: string
  date: Date
  retryCount?: number
  lastAttempt?: string
}