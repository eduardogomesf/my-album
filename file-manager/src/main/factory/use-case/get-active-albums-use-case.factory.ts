import { type GetAlbumsByStatusRepository } from '@/application/protocol'
import { GetActiveAlbumsUseCase } from '@/application/use-case'

export const generateGetActiveAlbumsUseCase = (
  getAlbumsByStatusRepository: GetAlbumsByStatusRepository
) => {
  return new GetActiveAlbumsUseCase(getAlbumsByStatusRepository)
}
