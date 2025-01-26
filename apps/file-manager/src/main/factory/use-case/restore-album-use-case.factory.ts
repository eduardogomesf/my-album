import {
  type GetAlbumByIdRepository,
  type UpdateAlbumRepository,
} from '@/application/protocol'
import { RestoreAlbumUseCase } from '@/application/use-case'

export const generateRestoreAlbumUseCase = (
  getAlbumByIdRepository: GetAlbumByIdRepository,
  updateAlbumRepository: UpdateAlbumRepository,
) => {
  return new RestoreAlbumUseCase(getAlbumByIdRepository, updateAlbumRepository)
}
