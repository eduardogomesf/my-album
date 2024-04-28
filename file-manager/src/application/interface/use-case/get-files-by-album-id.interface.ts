export interface GetFilesByAlbumIdFilters {
  limit?: number
  page?: number

}

export interface GetFilesByAlbumIdUseCaseParams {
  albumId: string
  userId: string
  filters: GetFilesByAlbumIdFilters
}

export interface GetFilesByAlbumIdUseCaseResponse {
  id: string
  name: string
  size: number
  encoding: string
  type: string
  extension: string
  albumId: string
  url: string
  isDeleted: boolean
  directDeleted?: boolean
  updatedAt: string
}
