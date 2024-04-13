import { type File } from '@/domain/entity'
import { type GetFilesFilters } from '../../use-case'

export interface GetFilesByAlbumIdRepository {
  getManyWithFilters: (
    albumId: string,
    filters: GetFilesFilters
  ) => Promise<File[]>
}
