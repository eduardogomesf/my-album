import { type Album } from '@/domain/entity'
import { type AlbumStatus } from '@/domain/enum'

export interface GetAlbumsByStatusRepository {
  getManyByStatus: (userId: string, status: AlbumStatus) => Promise<Album[]>
}
