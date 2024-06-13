import { PreUploadAnalysisUseCase } from '@/application/use-case'
import {
  type GetAlbumByIdRepository,
  type GetCurrentStorageUsageRepository,
  type GenerateUploadUrlService
} from '@/application/protocol'

export const generatePreUploadAnalysisUseCase = (
  getAlbumByIdRepository: GetAlbumByIdRepository,
  getCurrentStorageUsageRepository: GetCurrentStorageUsageRepository,
  generateUploadUrlService: GenerateUploadUrlService
) => {
  return new PreUploadAnalysisUseCase(
    getAlbumByIdRepository,
    getCurrentStorageUsageRepository,
    generateUploadUrlService
  )
}
