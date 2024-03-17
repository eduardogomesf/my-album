import { type Album } from '@/domain/entity'

export interface GetAlbumByNameRepository {
  getByName: (name: string, userId: string) => Promise<Album | null>
}
