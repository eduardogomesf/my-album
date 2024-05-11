import {
  type AddNewAlbumUseCase,
  type AddNewFileUseCase,
  type AddNewUserUseCase,
  type GetFilesByAlbumIdUseCase,
  type GetActiveAlbumsUseCase,
  type GetDeletedAlbumsUseCase,
  type MoveFilesToOtherAlbumUseCase,
  type DeleteFileUseCase,
  type DeleteAlbumUseCase,
  type RestoreAlbumUseCase
} from '@/application/use-case'
import { type Consumer } from 'kafkajs'

export interface UseCases {
  addNewUserUseCase: AddNewUserUseCase
  addNewFileUseCase: AddNewFileUseCase
  addNewAlbumUseCase: AddNewAlbumUseCase
  getActiveAlbumsUseCase: GetActiveAlbumsUseCase
  getFilesByAlbumIdUseCase: GetFilesByAlbumIdUseCase
  getDeletedAlbumsUseCase: GetDeletedAlbumsUseCase
  moveFilesToOtherAlbumUseCase: MoveFilesToOtherAlbumUseCase
  deleteFileUseCase: DeleteFileUseCase
  deleteAlbumUseCase: DeleteAlbumUseCase
  restoreAlbumUseCase: RestoreAlbumUseCase
}

export interface Injections extends UseCases {
  addNewUseKafkaConsumer: Consumer
}
