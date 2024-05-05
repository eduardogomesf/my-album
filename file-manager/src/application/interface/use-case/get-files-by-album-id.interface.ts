export interface GetFilesByAlbumIdFilters {
  limit?: number
  page?: number

}

export interface GetFilesByAlbumIdUseCaseParams {
  albumId: string
  userId: string
  filters: GetFilesByAlbumIdFilters
}

export interface GetFilesByAlbumIdFile {
  id: string
  name: string
  size: number
  encoding: string
  type: string
  extension: string
  albumId: string
  url: string
  updatedAt: string
}

export interface GetFilesByAlbumIdUseCaseResponse {
  files: GetFilesByAlbumIdFile[]
  total: number
  limit: number
  page: number
  totalPages: number
}
