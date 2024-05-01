import { type File } from '@/domain/entity'

export interface GetFilesFilters {
  page: number
  limit: number
}

export interface GetFilesByAlbumIdRepository {
  getManyWithFilters: (
    albumId: string,
    filters: GetFilesFilters
  ) => Promise<File[]>
}
