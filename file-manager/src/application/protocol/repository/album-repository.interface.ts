import { type Album } from '@/domain/entity'
import { type AlbumStatus } from '@/domain/enum'

export interface GetAlbumByIdRepository {
  getById: (id: string, userId: string) => Promise<Album | null>
}

export interface GetAlbumByNameRepository {
  getByName: (name: string, userId: string) => Promise<Album | null>
}

export interface GetAlbumsByStatusRepositoryResponse {
  id: string
  name: string
  updatedAt: Date
  numberOfPhotos: number
  numberOfVideos: number
}

export interface GetAlbumsByStatusRepository {
  getManyByStatus: (userId: string, status: AlbumStatus) => Promise<GetAlbumsByStatusRepositoryResponse[]>
}

export interface SaveAlbumRepository {
  save: (album: Album) => Promise<void>
}

export interface UpdateAlbumRepository {
  update: (album: Album) => Promise<void>
}

export interface DeleteAlbumRepository {
  delete: (id: string, userId: string) => Promise<void>
}
