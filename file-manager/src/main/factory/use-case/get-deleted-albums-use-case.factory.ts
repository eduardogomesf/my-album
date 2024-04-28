import { type GetAlbumsByStatusRepository } from '@/application/protocol'
import { GetDeletedAlbumsUseCase } from '@/application/use-case'

export const generateGetDeletedAlbumsUseCase = (
  getAlbumsByStatusRepository: GetAlbumsByStatusRepository
) => {
  return new GetDeletedAlbumsUseCase(getAlbumsByStatusRepository)
}
