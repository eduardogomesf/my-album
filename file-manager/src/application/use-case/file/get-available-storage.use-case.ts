import { ENVS } from '@/shared'
import { megaBytesToBytes } from '../../helper'
import {
  type UseCaseResponse,
  type UseCase,
  type GetAvailableStorageParams,
  type GetAvailableStorageResponse
} from '../../interface'
import { type GetCurrentStorageUsageRepository } from '../../protocol'

export class GetAvailableStorageUseCase implements UseCase {
  constructor(
    private readonly getCurrentStorageUsageRepository: GetCurrentStorageUsageRepository
  ) {}

  async execute(params: GetAvailableStorageParams): Promise<UseCaseResponse<GetAvailableStorageResponse>> {
    const { usage } = await this.getCurrentStorageUsageRepository.getUsage(params.userId)

    const maxStorage = megaBytesToBytes(ENVS.FILE_CONFIGS.MAX_STORAGE_SIZE_IN_MB)

    const available = maxStorage - usage
    const canAddMore = available > 0

    return {
      ok: true,
      data: {
        available,
        canAddMore,
        currentUsage: usage,
        maxStorage
      }
    }
  }
}
