import { type File } from '@/domain/entity'

export interface GetFilesByAlbumIdRepository {
  getManyById: (albumId: string, userId: string) => Promise<File[]>
}
