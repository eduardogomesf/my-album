import {
  type AddNewAlbumUseCase,
  type AddNewUserUseCase,
  type GetFilesByAlbumIdUseCase,
  type GetAlbumsUseCase,
  type MoveFilesToOtherAlbumUseCase,
  type DeleteFilesUseCase,
  type DeleteAlbumUseCase,
  type RestoreAlbumUseCase,
  type GetAvailableStorageUseCase,
  type PreUploadAnalysisUseCase,
  type PostUploadUseCase,
  type DownloadFilesUseCase
} from '@/application/use-case'
import { type Consumer } from 'kafkajs'

export interface UseCases {
  addNewUserUseCase: AddNewUserUseCase
  addNewAlbumUseCase: AddNewAlbumUseCase
  getAlbumsUseCase: GetAlbumsUseCase
  getFilesByAlbumIdUseCase: GetFilesByAlbumIdUseCase
  moveFilesToOtherAlbumUseCase: MoveFilesToOtherAlbumUseCase
  deleteFileUseCase: DeleteFilesUseCase
  deleteAlbumUseCase: DeleteAlbumUseCase
  restoreAlbumUseCase: RestoreAlbumUseCase
  getAvailableStorageUseCase: GetAvailableStorageUseCase
  preUploadAnalysisUseCase: PreUploadAnalysisUseCase
  postUploadUseCase: PostUploadUseCase
  downloadFilesUseCase: DownloadFilesUseCase
}

export interface Injections extends UseCases {
  addNewUseKafkaConsumer: Consumer
}
