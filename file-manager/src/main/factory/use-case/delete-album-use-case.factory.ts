import { DeleteAlbumUseCase } from '@/application/use-case'
import {
  type UpdateAlbumRepository,
  type DeleteAlbumRepository,
  type GetAlbumByIdWithFilesCountRepository
} from '@/application/protocol'

export const generateDeleteAlbumUseCase = (
  getAlbumByIdWithFilesCountRepository: GetAlbumByIdWithFilesCountRepository,
  updateAlbumRepository: UpdateAlbumRepository,
  deleteAlbumRepository: DeleteAlbumRepository
) => {
  return new DeleteAlbumUseCase(
    getAlbumByIdWithFilesCountRepository,
    updateAlbumRepository,
    deleteAlbumRepository
  )
}
