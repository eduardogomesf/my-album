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
  type: string
  extension: string
  albumId: string
  url: string
  createdAt: string
}

export interface GetFilesByAlbumIdUseCaseResponse {
  files: GetFilesByAlbumIdFile[]
  total: number
  limit: number
  page: number
  totalPages: number
  album: {
    id: string
    name: string
  }
}
