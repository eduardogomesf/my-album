import {
  type AddNewAlbumUseCase,
  type AddNewFileUseCase,
  type AddNewUserUseCase,
  type GetFilesByAlbumIdUseCase,
  type GetActiveAlbumsUseCase
} from '@/application/use-case'
import { type Consumer } from 'kafkajs'

export interface UseCases {
  addNewUserUseCase: AddNewUserUseCase
  addNewFileUseCase: AddNewFileUseCase
  addNewAlbumUseCase: AddNewAlbumUseCase
  getAlbumsUseCase: GetActiveAlbumsUseCase
  getFilesByAlbumIdUseCase: GetFilesByAlbumIdUseCase
}

export interface Injections extends UseCases {
  addNewUseKafkaConsumer: Consumer
}
