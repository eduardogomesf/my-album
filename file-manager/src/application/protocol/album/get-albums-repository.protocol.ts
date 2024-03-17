import { type Album } from '@/domain/entity'

export interface GetAlbumsRepository {
  getAll: (userId: string) => Promise<Album[]>
}
