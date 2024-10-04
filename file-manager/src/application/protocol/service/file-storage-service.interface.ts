import { type File } from '@/domain/entity'

import { type FileMetadata } from '../../interface'
import { type Readable } from 'stream'

export interface GetFileUrlService {
  getFileUrl: (file: File, userId: string) => Promise<string>
}

export interface DeleteFileFromStorageService {
  delete: (file: File, userId: string) => Promise<boolean>
}

export interface DeleteFilesFromStorageService {
  deleteMany: (filesIds: string[], userId: string) => Promise<boolean>
}

export type GenerateUploadUrlServiceDTO = FileMetadata & { userId: string }

export interface GenerateUploadUrlServiceResponse {
  url: string
  fields: Record<string, string>
}

export interface GenerateUploadUrlService {
  generateUploadUrl: (params: GenerateUploadUrlServiceDTO) => Promise<GenerateUploadUrlServiceResponse>
}

export interface GetFileStreamFromStorageService {
  getFileStream: (file: File, userId: string) => Promise<Readable>
}
