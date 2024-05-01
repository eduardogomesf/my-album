import { type GetCurrentStorageUsageRepository, type SaveFileStorageService, type SaveFileRepository, type GetAlbumByIdRepository } from '@/application/protocol'
import { AddNewFileUseCase } from '@/application/use-case'

export const generateAddNewFileUseCase = (
  getCurrentStorageUsageRepository: GetCurrentStorageUsageRepository,
  saveFileStorageService: SaveFileStorageService,
  saveFileRepository: SaveFileRepository,
  getAlbumByIdRepository: GetAlbumByIdRepository
) => {
  return new AddNewFileUseCase(getCurrentStorageUsageRepository, saveFileStorageService, saveFileRepository, getAlbumByIdRepository)
}
