import { type UseCases } from '@/presentation/interface/injections'
import { generateFileRepository, generateUserRepository } from '../factory/repository'
import { generateAddNewFileUseCase, generateAddNewUserUseCase } from '../factory/use-case'
import { generateSaveFileStorageService } from '../factory/object-storage'

export const getApplicationUseCases = async (): Promise<UseCases> => {
  const userRepository = generateUserRepository()
  const addNewUserUseCase = generateAddNewUserUseCase(userRepository, userRepository)

  const fileRepository = generateFileRepository()
  const saveFileStorage = generateSaveFileStorageService()

  const addNewFileUseCase = generateAddNewFileUseCase(fileRepository, saveFileStorage, fileRepository)

  return {
    addNewUserUseCase,
    addNewFileUseCase
  }
}
