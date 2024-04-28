import { type File } from '@/domain/entity'
import { type FileStatus } from '@/domain/enum'

export interface GetFilesFilters {
  page: number
  limit: number
  statuses?: FileStatus[]
}

export interface GetFilesByAlbumIdRepository {
  getManyWithFilters: (
    albumId: string,
    filters: GetFilesFilters
  ) => Promise<File[]>
}
