import { AlbumStatus } from '@/domain/enum'
import { ENVS } from '@/shared'

import { ERROR_MESSAGES } from '../../constant'
import {
  type UseCase,
  type UseCaseResponse
} from '../../interface'
import {
  type PreUploadAnalysisUseCaseResponse,
  type PreUploadAnalysisUseCaseParams,
  type FileMetadata,
  type AllowedFile,
  type NotAllowedFile
} from '../../interface/use-case'
import {
  type GetCurrentStorageUsageRepository,
  type GetAlbumByIdRepository,
  type GenerateUploadUrlService
} from '../../protocol'
import { megaBytesToBytes, getFileExtension, isValidFileExtension, hasValidFileSize } from '../../helper'

export class PreUploadAnalysisUseCase implements UseCase {
  constructor(
    private readonly getAlbumByIdRepository: GetAlbumByIdRepository,
    private readonly getCurrentStorageUsageRepository: GetCurrentStorageUsageRepository,
    private readonly generateUploadUrlService: GenerateUploadUrlService
  ) {}

  async execute (params: PreUploadAnalysisUseCaseParams): Promise<UseCaseResponse<PreUploadAnalysisUseCaseResponse>> {
    const album = await this.getAlbumByIdRepository.getById(params.albumId, params.userId)

    if (!album) {
      return {
        ok: false,
        message: ERROR_MESSAGES.ALBUM.NOT_FOUND
      }
    }

    if (album.status === AlbumStatus.DELETED) {
      return {
        ok: false,
        message: ERROR_MESSAGES.ALBUM.DELETED_PLEASE_RESTORE
      }
    }

    if (params.files.length === 0) {
      return {
        ok: false,
        message: ERROR_MESSAGES.FILE.MANY_NOT_FOUND
      }
    }

    const { hasFreeSpace, freeSpace } = await this.canAddMoreFiles(params.userId)

    if (!hasFreeSpace) {
      return {
        ok: false,
        message: ERROR_MESSAGES.FILE.NO_FREE_SPACE
      }
    }

    const orderedFiles = this.orderBySize(params.files)

    const {
      allowed,
      notAllowedDueToAvailableStorage,
      notAllowedDueToExtension,
      notAllowedDueToSize
    } = await this.analyzeFiles(orderedFiles, freeSpace, params.userId)

    return {
      ok: true,
      data: {
        allowed,
        notAllowedDueToAvailableStorage,
        notAllowedDueToExtension,
        notAllowedDueToSize
      }
    }
  }

  private async analyzeFiles(files: FileMetadata[], freeSpace: number, userId: string): Promise<PreUploadAnalysisUseCaseResponse> {
    const allowed: AllowedFile[] = []
    const notAllowedDueToExtension: NotAllowedFile[] = []
    const notAllowedDueToSize: NotAllowedFile[] = []
    const notAllowedDueToAvailableStorage: NotAllowedFile[] = []

    let expectedUsage = 0

    for await (const file of files) {
      const extension = getFileExtension(file.originalName)

      const validExtension = isValidFileExtension(extension)

      if (!validExtension) {
        notAllowedDueToExtension.push({
          id: file.id,
          reason: ERROR_MESSAGES.FILE.INVALID_EXTENSION
        })
        continue
      }

      const hasValidSize = hasValidFileSize(file.size)

      if (!hasValidSize) {
        notAllowedDueToSize.push({
          id: file.id,
          reason: ERROR_MESSAGES.FILE.TOO_LARGE
        })
        continue
      }

      if (expectedUsage + file.size > freeSpace) {
        notAllowedDueToAvailableStorage.push({
          id: file.id,
          reason: ERROR_MESSAGES.FILE.NO_FREE_SPACE
        })
        continue
      }

      expectedUsage += file.size

      const url = await this.generateUploadUrlService.generateUploadUrl({
        id: file.id,
        originalName: file.originalName,
        size: file.size,
        mimetype: file.mimetype,
        encoding: file.encoding,
        userId
      })

      allowed.push({
        id: file.id,
        uploadUrl: url
      })
    }

    return {
      allowed,
      notAllowedDueToExtension,
      notAllowedDueToSize,
      notAllowedDueToAvailableStorage
    }
  }

  private orderBySize(files: FileMetadata[]): FileMetadata[] {
    return files.sort((a, b) => b.size - a.size)
  }

  private async canAddMoreFiles(userId: string): Promise<{ freeSpace: number, hasFreeSpace: boolean }> {
    const { usage } = await this.getCurrentStorageUsageRepository.getUsage(userId)

    const maxStorageSize = megaBytesToBytes(ENVS.FILE_CONFIGS.MAX_STORAGE_SIZE_IN_MB)

    const freeSpace = maxStorageSize - usage

    return {
      freeSpace,
      hasFreeSpace: freeSpace > 0
    }
  }
}
