import { type UseCases } from '@/presentation/interface/injections'
import {
  generateAlbumRepository,
  generateFileRepository,
  generateOutboxRepository,
  generateUserRepository
} from '../factory/repository'
import {
  generateAddNewAlbumUseCase,
  generatePreUploadAnalysisUseCase,
  generateAddNewUserUseCase,
  generateDeleteAlbumUseCase,
  generateDeleteFileUseCase,
  generateGetAlbumsUseCase,
  generateGetAvailableStorageUseCase,
  generateGetFilesByAlbumIdUseCase,
  generateMoveFilesToOtherAlbumUseCase,
  generateRestoreAlbumUseCase,
  generatePostUploadUseCase,
  generateDownloadFilesUseCase
} from '../factory/use-case'
import { generateFileStorageService } from '../factory/object-storage'
import { generateGetFileUrlDecorator } from '../factory/decorator/'
import { generateCache } from '../factory/cache'
import { ENVS } from '@/shared'

export const getApplicationUseCases = async (): Promise<UseCases> => {
  // repositories
  const userRepository = generateUserRepository()
  const fileRepository = generateFileRepository()
  const albumRepository = generateAlbumRepository()
  const outboxRepository = generateOutboxRepository()

  // services
  const fileStorageService = generateFileStorageService(
    outboxRepository,
    outboxRepository,
    outboxRepository
  )

  // decorators
  const cache = generateCache({
    clientName: ENVS.REDIS.CLIENT_NAME,
    host: ENVS.REDIS.HOST,
    username: ENVS.REDIS.USERNAME,
    password: ENVS.REDIS.PASSWORD,
    port: ENVS.REDIS.PORT
  })
  const getFileUrlDecorator = generateGetFileUrlDecorator(fileStorageService, cache)

  // use-cases
  const addNewUserUseCase = generateAddNewUserUseCase(userRepository, userRepository)
  const preUploadAnalysisUseCase = generatePreUploadAnalysisUseCase(
    albumRepository,
    fileRepository,
    fileStorageService,
    fileRepository
  )
  const addNewAlbumUseCase = generateAddNewAlbumUseCase(userRepository, albumRepository, albumRepository)
  const getAlbumsUseCase = generateGetAlbumsUseCase(albumRepository)
  const getFilesByAlbumIdUseCase = generateGetFilesByAlbumIdUseCase(fileRepository, albumRepository, getFileUrlDecorator, fileRepository)
  const moveFilesToOtherAlbumUseCase = generateMoveFilesToOtherAlbumUseCase(albumRepository, fileRepository, fileRepository)
  const deleteFileUseCase = generateDeleteFileUseCase(fileRepository, fileRepository, fileStorageService)
  const deleteAlbumUseCase = generateDeleteAlbumUseCase(albumRepository, albumRepository, albumRepository)
  const restoreAlbumUseCase = generateRestoreAlbumUseCase(albumRepository, albumRepository)
  const getAvailableStorageUseCase = generateGetAvailableStorageUseCase(fileRepository)
  const postUploadUseCase = generatePostUploadUseCase(fileRepository, fileRepository)
  const downloadFilesUseCase = generateDownloadFilesUseCase(albumRepository, fileRepository, fileStorageService)

  return {
    addNewUserUseCase,
    preUploadAnalysisUseCase,
    addNewAlbumUseCase,
    getAlbumsUseCase,
    getFilesByAlbumIdUseCase,
    moveFilesToOtherAlbumUseCase,
    deleteFileUseCase,
    deleteAlbumUseCase,
    restoreAlbumUseCase,
    getAvailableStorageUseCase,
    postUploadUseCase,
    downloadFilesUseCase
  }
}
