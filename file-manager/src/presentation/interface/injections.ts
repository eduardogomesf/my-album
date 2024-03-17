import {
  type GetAlbumsUseCase,
  type AddNewAlbumUseCase,
  type AddNewFileUseCase,
  type AddNewUserUseCase,
  type GetFilesByAlbumIdUseCase
} from '@/application/use-case'
import { type Consumer } from 'kafkajs'

export interface UseCases {
  addNewUserUseCase: AddNewUserUseCase
  addNewFileUseCase: AddNewFileUseCase
  addNewAlbumUseCase: AddNewAlbumUseCase
  getAlbumsUseCase: GetAlbumsUseCase
  getFilesByAlbumIdUseCase: GetFilesByAlbumIdUseCase
}

export interface Injections extends UseCases {
  addNewUseKafkaConsumer: Consumer
}
