import { DeleteFilesUseCase } from '@/application/use-case'
import {
  type GetFilesByIdsAndAlbumIdRepository,
  type DeleteFilesRepository,
  type MessageSender,
} from '@/application/protocol'

export const generateDeleteFileUseCase = (
  getFilesByIdsAndAlbumIdRepository: GetFilesByIdsAndAlbumIdRepository,
  deleteFilesRepository: DeleteFilesRepository,
  deleteFilesFromStorageSender: MessageSender,
) => {
  return new DeleteFilesUseCase(
    getFilesByIdsAndAlbumIdRepository,
    deleteFilesRepository,
    deleteFilesFromStorageSender,
  )
}
