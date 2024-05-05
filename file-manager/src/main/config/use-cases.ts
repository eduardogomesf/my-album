import { type UseCases } from '@/presentation/interface/injections'
import {
  generateAlbumRepository,
  generateFileRepository,
  generateUserRepository
} from '../factory/repository'
import {
  generateAddNewAlbumUseCase,
  generateAddNewFileUseCase,
  generateAddNewUserUseCase,
  generateGetActiveAlbumsUseCase,
  generateGetDeletedAlbumsUseCase,
  generateGetFilesByAlbumIdUseCase,
  generateMoveFilesToOtherAlbumUseCase
} from '../factory/use-case'
import { generateSaveFileStorageService } from '../factory/object-storage'
import { generateGetFileUrlDecorator } from '../factory/decorator/'
import { generateCache } from '../factory/cache'
import { ENVS } from '@/shared'

export const getApplicationUseCases = async (): Promise<UseCases> => {
  // repositories
  const userRepository = generateUserRepository()
  const fileRepository = generateFileRepository()
  const albumRepository = generateAlbumRepository()

  // services
  const saveFileStorage = generateSaveFileStorageService()

  // decorators
  const cache = generateCache({
    clientName: ENVS.REDIS.CLIENT_NAME,
    host: ENVS.REDIS.HOST,
    username: ENVS.REDIS.USERNAME,
    password: ENVS.REDIS.PASSWORD,
    port: ENVS.REDIS.PORT
  })
  const getFileUrlDecorator = generateGetFileUrlDecorator(saveFileStorage, cache)

  // use-cases
  const addNewUserUseCase = generateAddNewUserUseCase(userRepository, userRepository)
  const addNewFileUseCase = generateAddNewFileUseCase(
    fileRepository,
    saveFileStorage,
    fileRepository,
    albumRepository
  )
  const addNewAlbumUseCase = generateAddNewAlbumUseCase(userRepository, albumRepository, albumRepository)
  const getActiveAlbumsUseCase = generateGetActiveAlbumsUseCase(albumRepository)
  const getFilesByAlbumIdUseCase = generateGetFilesByAlbumIdUseCase(fileRepository, albumRepository, getFileUrlDecorator, fileRepository)
  const getDeletedAlbumsUseCase = generateGetDeletedAlbumsUseCase(albumRepository)
  const moveFilesToOtherAlbumUseCase = generateMoveFilesToOtherAlbumUseCase(albumRepository, fileRepository, fileRepository)

  return {
    addNewUserUseCase,
    addNewFileUseCase,
    addNewAlbumUseCase,
    getActiveAlbumsUseCase,
    getFilesByAlbumIdUseCase,
    getDeletedAlbumsUseCase,
    moveFilesToOtherAlbumUseCase
  }
}
