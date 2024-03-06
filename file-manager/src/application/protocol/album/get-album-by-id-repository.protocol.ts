import { type Album } from '@/domain/entity'

export interface GetAlbumByIdRepository {
  getById: (id: string) => Promise<Album | null>
}
