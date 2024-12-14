import { type UseCases } from '@/presentation/interface/injections'
import {
  generateAlbumRepository,
  generateFileRepository,
  generateOutboxRepository,
  generateUserRepository,
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
  generateDownloadFilesUseCase,
} from '../factory/use-case'
import { generateFileStorageService } from '../factory/object-storage'
import { generateGetFileUrlDecorator } from '../factory/decorator/'
import { generateCache } from '../factory/cache'
import { ENVS } from '@/shared'
import { generateDeleteFilesFromStorageUseCase } from '../factory/use-case/delete-file-from-storage-use-case.factory'
import { generateKafkaProducer } from '../factory/messaging'

export const getApplicationUseCases = async (): Promise<UseCases> => {
  // Message senders
  const deleteFilesFromStorageSender = await generateKafkaProducer(
    ENVS.KAFKA.TOPICS.FILE.DELETE_MANY,
  )

  // repositories
  const userRepository = generateUserRepository()
  const fileRepository = generateFileRepository()
  const albumRepository = generateAlbumRepository(deleteFilesFromStorageSender)
  const outboxRepository = generateOutboxRepository()

  // services
  const fileStorageService = generateFileStorageService(
    outboxRepository,
    outboxRepository,
    outboxRepository,
    outboxRepository,
    outboxRepository,
    outboxRepository,
  )

  // decorators
  const cache = generateCache({
    clientName: ENVS.REDIS.CLIENT_NAME,
    host: ENVS.REDIS.HOST,
    username: ENVS.REDIS.USERNAME,
    password: ENVS.REDIS.PASSWORD,
    port: ENVS.REDIS.PORT,
  })
  const getFileUrlDecorator = generateGetFileUrlDecorator(
    fileStorageService,
    cache,
  )

  // use-cases
  const addNewUserUseCase = generateAddNewUserUseCase(
    userRepository,
    userRepository,
  )
  const preUploadAnalysisUseCase = generatePreUploadAnalysisUseCase(
    albumRepository,
    fileRepository,
    fileStorageService,
    fileRepository,
  )
  const addNewAlbumUseCase = generateAddNewAlbumUseCase(
    userRepository,
    albumRepository,
    albumRepository,
  )
  const getAlbumsUseCase = generateGetAlbumsUseCase(
    albumRepository,
    fileRepository,
    fileStorageService,
  )
  const getFilesByAlbumIdUseCase = generateGetFilesByAlbumIdUseCase(
    fileRepository,
    albumRepository,
    getFileUrlDecorator,
    fileRepository,
  )
  const moveFilesToOtherAlbumUseCase = generateMoveFilesToOtherAlbumUseCase(
    albumRepository,
    fileRepository,
    fileRepository,
  )
  const deleteFileUseCase = generateDeleteFileUseCase(
    fileRepository,
    fileRepository,
    deleteFilesFromStorageSender,
  )
  const deleteAlbumUseCase = generateDeleteAlbumUseCase(
    albumRepository,
    albumRepository,
    albumRepository,
  )
  const restoreAlbumUseCase = generateRestoreAlbumUseCase(
    albumRepository,
    albumRepository,
  )
  const getAvailableStorageUseCase =
    generateGetAvailableStorageUseCase(fileRepository)
  const postUploadUseCase = generatePostUploadUseCase(
    fileRepository,
    fileRepository,
  )
  const downloadFilesUseCase = generateDownloadFilesUseCase(
    albumRepository,
    fileRepository,
    fileStorageService,
  )
  const deleteFilesFromStorageUseCase = generateDeleteFilesFromStorageUseCase(
    fileStorageService,
    deleteFilesFromStorageSender,
  )

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
    downloadFilesUseCase,
    deleteFilesFromStorageUseCase,
  }
}
