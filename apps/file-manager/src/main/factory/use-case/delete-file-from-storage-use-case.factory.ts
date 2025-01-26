import { DeleteFilesFromStorageUseCase } from '@/application/use-case'
import {
  type DeleteFilesFromStorageService,
  type MessageSender,
} from '@/application/protocol'

export const generateDeleteFilesFromStorageUseCase = (
  deleteFilesFromStorageService: DeleteFilesFromStorageService,
  deleteFilesFromStorageSender: MessageSender,
) => {
  return new DeleteFilesFromStorageUseCase(
    deleteFilesFromStorageService,
    deleteFilesFromStorageSender,
  )
}
