import { type File } from '@/domain/entity'

export interface GetCurrentStorageUsageRepository {
  getUsage: (userId: string) => Promise<{
    usage: number
  }>
}

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

export interface SaveFileRepository {
  save: (file: File) => Promise<void>
}

export interface MoveFilesRepositoryParams {
  targetAlbumId: string
  filesIds: string[]
  userId: string
}

export interface MoveFilesToAlbumByFilesIdsRepository {
  moveFiles: (payload: MoveFilesRepositoryParams) => Promise<void>
}
