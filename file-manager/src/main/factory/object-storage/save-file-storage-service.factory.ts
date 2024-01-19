import { S3FileStorage } from '@/infra/object-storage'

export const generateSaveFileStorageService = () => {
  return new S3FileStorage()
}
