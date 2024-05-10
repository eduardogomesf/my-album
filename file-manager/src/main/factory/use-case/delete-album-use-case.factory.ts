import { DeleteAlbumUseCase } from '@/application/use-case'
import {
  type GetAlbumByIdRepository,
  type UpdateAlbumRepository,
  type DeleteAlbumRepository
} from '@/application/protocol'

export const generateDeleteAlbumUseCase = (
  getAlbumByIdRepository: GetAlbumByIdRepository,
  updateAlbumRepository: UpdateAlbumRepository,
  deleteAlbumRepository: DeleteAlbumRepository
) => {
  return new DeleteAlbumUseCase(
    getAlbumByIdRepository,
    updateAlbumRepository,
    deleteAlbumRepository
  )
}
