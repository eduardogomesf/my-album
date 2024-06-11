import { DeleteFilesUseCase } from '@/application/use-case'
import {
  type GetFilesByIdsAndAlbumIdRepository,
  type DeleteFilesRepository,
  type DeleteFileFromStorageService
} from '@/application/protocol'

export const generateDeleteFileUseCase = (
  GetFilesByIdsAndAlbumIdRepository: GetFilesByIdsAndAlbumIdRepository,
  DeleteFilesRepository: DeleteFilesRepository,
  deleteFileFromStorageService: DeleteFileFromStorageService
) => {
  return new DeleteFilesUseCase(
    GetFilesByIdsAndAlbumIdRepository,
    DeleteFilesRepository,
    deleteFileFromStorageService
  )
}
