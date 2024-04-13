import { type File } from '@/domain/entity'

export interface GetFilesByIdsRepository {
  getByIds: (fileIds: string[], albumId: string) => Promise<File[]>
}
