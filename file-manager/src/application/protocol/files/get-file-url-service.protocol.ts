import { type File } from '@/domain/entity'

export interface GetFileUrlService {
  getFileUrl: (file: File, userId: string) => Promise<string>
}
