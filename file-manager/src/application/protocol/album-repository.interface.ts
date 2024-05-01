import { type Album } from '@/domain/entity'
import { type AlbumStatus } from '@/domain/enum'

export interface GetAlbumByIdRepository {
  getById: (id: string, userId: string) => Promise<Album | null>
}

export interface GetAlbumByNameRepository {
  getByName: (name: string, userId: string) => Promise<Album | null>
}

export interface GetAlbumsByStatusRepository {
  getManyByStatus: (userId: string, status: AlbumStatus) => Promise<Album[]>
}

export interface SaveAlbumRepository {
  save: (album: Album) => Promise<void>
}
