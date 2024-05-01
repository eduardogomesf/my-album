import { type File } from '@/domain/entity'

export interface GetFileUrlService {
  getFileUrl: (file: File, userId: string) => Promise<string>
}

export interface SaveFileStorageServiceDTO {
  fileId: string
  content: Buffer
  name: string
  encoding: string
  type: string
  userId: string
}

export interface SaveFileStorageService {
  save: (params: SaveFileStorageServiceDTO) => Promise<null>
}
