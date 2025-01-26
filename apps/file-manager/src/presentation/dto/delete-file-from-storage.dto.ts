export interface DeleteFileFromStorageDTO {
  id: string
  filesIds: string[]
  userId: string
  date: Date
  retryCount?: number
  lastAttempt?: Date
}
