export type DeleteFileFromStorageUseCaseParams = {
  id: string
  filesIds: string[]
  userId: string
  date: Date
  retryCount?: number
  lastAttempt?: string
}