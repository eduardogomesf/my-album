import { type GetCurrentStorageUsageRepository, type SaveFileStorageService, type SaveFileRepository } from '@/application/protocol/files'
import { AddNewFileUseCase } from '@/application/use-case'

export const generateAddNewFileUseCase = (
  getCurrentStorageUsageRepository: GetCurrentStorageUsageRepository,
  saveFileStorageService: SaveFileStorageService,
  saveFileRepository: SaveFileRepository
) => {
  return new AddNewFileUseCase(getCurrentStorageUsageRepository, saveFileStorageService, saveFileRepository)
}
