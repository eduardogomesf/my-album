import { type File } from '@/domain/entity'

import { type FileMetadata } from '../../interface'

export interface GetFileUrlService {
  getFileUrl: (file: File, userId: string) => Promise<string>
}

export interface DeleteFileFromStorageService {
  delete: (file: File, userId: string) => Promise<boolean>
}

export type GenerateUploadUrlServiceDTO = FileMetadata & { userId: string }

export interface GenerateUploadUrlService {
  generateUploadUrl: (params: GenerateUploadUrlServiceDTO) => Promise<string>
}
