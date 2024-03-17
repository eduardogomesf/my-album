import { type AddNewAlbumUseCase, type AddNewFileUseCase, type AddNewUserUseCase } from '@/application/use-case'
import { type Consumer } from 'kafkajs'

export interface UseCases {
  addNewUserUseCase: AddNewUserUseCase
  addNewFileUseCase: AddNewFileUseCase
  addNewAlbumUseCase: AddNewAlbumUseCase
}

export interface Injections extends UseCases {
  addNewUseKafkaConsumer: Consumer
}
