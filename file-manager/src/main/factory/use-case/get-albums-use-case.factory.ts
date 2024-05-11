import { type GetAlbumsByStatusRepository } from '@/application/protocol'
import { GetAlbumsUseCase } from '@/application/use-case'

export const generateGetAlbumsUseCase = (
  getAlbumsByStatusRepository: GetAlbumsByStatusRepository
) => {
  return new GetAlbumsUseCase(getAlbumsByStatusRepository)
}
