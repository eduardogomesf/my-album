import { type Album, type File } from '@/domain/entity'

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

export type GetFilesByIdsRepositoryResponse = Array<File & { album: Album } >

export interface GetFilesByIdsRepository {
  getByIds: (filesIds: string[], userId: string) => Promise<GetFilesByIdsRepositoryResponse>
}

export interface CountFilesByAlbumIdRepository {
  countWithFilters: (
    albumId: string
  ) => Promise<number>
}

export interface DeleteFileRepository {
  deleteFile: (file: File) => Promise<boolean>
}

export interface GetFileByIdAndAlbumIdRepository {
  getFileByIdAndAlbumId: (
    fileId: string,
    albumId: string,
    userId: string
  ) => Promise<File | null>
}
