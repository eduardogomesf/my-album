import { type Album } from '@/domain/entity'

export interface SaveAlbumRepository {
  save: (album: Album) => Promise<void>
}
