import { type GetCurrentStorageUsageRepository, type SaveFileStorageService, type SaveFileRepository } from '@/application/protocol/files'
import { AddNewFileUseCase } from '@/application/use-case'
import { type GetAlbumByIdRepository } from '@/application/protocol'

export const generateAddNewFileUseCase = (
  getCurrentStorageUsageRepository: GetCurrentStorageUsageRepository,
  saveFileStorageService: SaveFileStorageService,
  saveFileRepository: SaveFileRepository,
  getAlbumByIdRepository: GetAlbumByIdRepository
) => {
  return new AddNewFileUseCase(getCurrentStorageUsageRepository, saveFileStorageService, saveFileRepository, getAlbumByIdRepository)
}
