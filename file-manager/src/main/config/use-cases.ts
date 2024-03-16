import { type UseCases } from '@/presentation/interface/injections'
import { generateAlbumRepository, generateFileRepository, generateUserRepository } from '../factory/repository'
import { generateAddNewFileUseCase, generateAddNewUserUseCase } from '../factory/use-case'
import { generateSaveFileStorageService } from '../factory/object-storage'

export const getApplicationUseCases = async (): Promise<UseCases> => {
  const userRepository = generateUserRepository()
  const addNewUserUseCase = generateAddNewUserUseCase(userRepository, userRepository)

  const fileRepository = generateFileRepository()
  const saveFileStorage = generateSaveFileStorageService()
  const albumRepository = generateAlbumRepository()

  const addNewFileUseCase = generateAddNewFileUseCase(
    fileRepository,
    saveFileStorage,
    fileRepository,
    albumRepository
  )

  return {
    addNewUserUseCase,
    addNewFileUseCase
  }
}
