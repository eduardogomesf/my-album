import { type File } from '@/domain/entity'

interface FileWithUrl {
  id: string
  name: string
  size: number
  encoding: string
  type: string
  extension: string
  url: string
}

export interface GetFilesUrlsService {
  getFilesUrls: (files: File[]) => Promise<FileWithUrl[]>
}
