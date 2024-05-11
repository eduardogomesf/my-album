export interface GetAlbumsUseCaseParams {
  userId: string
  deletedAlbums?: boolean
}

export interface GetAlbumsUseCaseResponse {
  id: string
  name: string
  updatedAt: string
}
