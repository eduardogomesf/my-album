import { DeleteFileUseCase } from '@/application/use-case'
import {
  type GetFileByIdAndAlbumIdRepository,
  type DeleteFileRepository,
  type DeleteFileFromStorageService
} from '@/application/protocol'

export const generateDeleteFileUseCase = (
  getFileByIdAndAlbumIdRepository: GetFileByIdAndAlbumIdRepository,
  deleteFileRepository: DeleteFileRepository,
  deleteFileFromStorageService: DeleteFileFromStorageService
) => {
  return new DeleteFileUseCase(
    getFileByIdAndAlbumIdRepository,
    deleteFileRepository,
    deleteFileFromStorageService
  )
}
