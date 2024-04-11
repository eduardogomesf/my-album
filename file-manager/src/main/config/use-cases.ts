import { type UseCases } from '@/presentation/interface/injections'
import { generateAlbumRepository, generateFileRepository, generateUserRepository } from '../factory/repository'
import { generateAddNewAlbumUseCase, generateAddNewFileUseCase, generateAddNewUserUseCase, generateGetAlbumsUseCase, generateGetFilesByAlbumIdUseCase } from '../factory/use-case'
import { generateSaveFileStorageService } from '../factory/object-storage'

export const getApplicationUseCases = async (): Promise<UseCases> => {
  // repositories
  const userRepository = generateUserRepository()
  const fileRepository = generateFileRepository()
  const albumRepository = generateAlbumRepository()

  // services
  const saveFileStorage = generateSaveFileStorageService()

  // use-cases
  const addNewUserUseCase = generateAddNewUserUseCase(userRepository, userRepository)
  const addNewFileUseCase = generateAddNewFileUseCase(
    fileRepository,
    saveFileStorage,
    fileRepository,
    albumRepository
  )
  const addNewAlbumUseCase = generateAddNewAlbumUseCase(userRepository, albumRepository, albumRepository)
  const getAlbumsUseCase = generateGetAlbumsUseCase(albumRepository)
  const getFilesByAlbumIdUseCase = generateGetFilesByAlbumIdUseCase(fileRepository, albumRepository, saveFileStorage)

  return {
    addNewUserUseCase,
    addNewFileUseCase,
    addNewAlbumUseCase,
    getAlbumsUseCase,
    getFilesByAlbumIdUseCase
  }
}
