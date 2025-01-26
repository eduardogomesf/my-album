import { MoveFilesToOtherAlbumUseCase } from '@/application/use-case'
import {
  type GetAlbumByIdRepository,
  type MoveFilesToAlbumByFilesIdsRepository,
  type GetFilesByIdsRepository,
} from '@/application/protocol'

export const generateMoveFilesToOtherAlbumUseCase = (
  getAlbumByIdRepository: GetAlbumByIdRepository,
  moveFilesToAlbumByFilesIdsRepository: MoveFilesToAlbumByFilesIdsRepository,
  getFilesByIdsRepository: GetFilesByIdsRepository,
) => {
  return new MoveFilesToOtherAlbumUseCase(
    getAlbumByIdRepository,
    moveFilesToAlbumByFilesIdsRepository,
    getFilesByIdsRepository,
  )
}
