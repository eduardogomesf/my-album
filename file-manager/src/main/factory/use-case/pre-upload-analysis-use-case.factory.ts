import { PreUploadAnalysisUseCase } from '@/application/use-case'
import {
  type GetAlbumByIdRepository,
  type GetCurrentStorageUsageRepository,
  type GenerateUploadUrlService,
  type SaveFileRepository,
} from '@/application/protocol'

export const generatePreUploadAnalysisUseCase = (
  getAlbumByIdRepository: GetAlbumByIdRepository,
  getCurrentStorageUsageRepository: GetCurrentStorageUsageRepository,
  generateUploadUrlService: GenerateUploadUrlService,
  saveFileRepository: SaveFileRepository,
) => {
  return new PreUploadAnalysisUseCase(
    getAlbumByIdRepository,
    getCurrentStorageUsageRepository,
    generateUploadUrlService,
    saveFileRepository,
  )
}
