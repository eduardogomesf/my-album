import { type Album } from '@/domain/entity'

export interface GetAlbumByIdRepository {
  getById: (id: string, userId: string) => Promise<Album | null>
}
