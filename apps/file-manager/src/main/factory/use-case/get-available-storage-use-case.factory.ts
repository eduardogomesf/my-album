import { GetAvailableStorageUseCase } from '@/application/use-case'
import { type GetCurrentStorageUsageRepository } from '@/application/protocol'

export const generateGetAvailableStorageUseCase = (
  getCurrentStorageUsageRepository: GetCurrentStorageUsageRepository,
) => {
  return new GetAvailableStorageUseCase(getCurrentStorageUsageRepository)
}
