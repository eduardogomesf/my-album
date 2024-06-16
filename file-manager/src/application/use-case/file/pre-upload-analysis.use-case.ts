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
  type FileAfterAnalysis
} from '../../interface/use-case'
import {
  type GetCurrentStorageUsageRepository,
  type GetAlbumByIdRepository,
  type GenerateUploadUrlService,
  type SaveFileRepository
} from '../../protocol'
import {
  megaBytesToBytes,
  getFileExtension,
  isValidFileExtension,
  hasValidFileSize,
  getFileTypeFromMimeType
} from '../../helper'
import { File } from '@/domain/entity'

export class PreUploadAnalysisUseCase implements UseCase {
  constructor(
    private readonly getAlbumByIdRepository: GetAlbumByIdRepository,
    private readonly getCurrentStorageUsageRepository: GetCurrentStorageUsageRepository,
    private readonly generateUploadUrlService: GenerateUploadUrlService,
    private readonly saveFileRepository: SaveFileRepository
  ) {}

  async execute (params: PreUploadAnalysisUseCaseParams): Promise<UseCaseResponse<PreUploadAnalysisUseCaseResponse>> {
    if (params.files.length === 0) {
      return {
        ok: false,
        message: ERROR_MESSAGES.FILE.MANY_NOT_FOUND
      }
    }

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

    const { hasFreeSpace, freeSpace } = await this.canAddMoreFiles(params.userId)

    if (!hasFreeSpace) {
      return {
        ok: false,
        message: ERROR_MESSAGES.FILE.NO_FREE_SPACE
      }
    }

    const orderedFiles = this.orderBySize(params.files)

    const filesAfterAnalysis = await this.analyzeFiles(orderedFiles, freeSpace, params.userId, params.albumId)

    return {
      ok: true,
      data: filesAfterAnalysis
    }
  }

  private async analyzeFiles(files: FileMetadata[], freeSpace: number, userId: string, albumId: string): Promise<PreUploadAnalysisUseCaseResponse> {
    const filesAfterAnalysis: FileAfterAnalysis[] = []

    let expectedUsage = 0

    for await (const file of files) {
      const extension = getFileExtension(file.originalName)

      const validExtension = isValidFileExtension(extension)

      if (!validExtension) {
        filesAfterAnalysis.push({
          id: file.id,
          reason: ERROR_MESSAGES.FILE.INVALID_EXTENSION,
          allowed: false
        })
        continue
      }

      const hasValidSize = hasValidFileSize(file.size)

      if (!hasValidSize) {
        filesAfterAnalysis.push({
          id: file.id,
          reason: ERROR_MESSAGES.FILE.TOO_LARGE,
          allowed: false
        })
        continue
      }

      if (expectedUsage + file.size > freeSpace) {
        filesAfterAnalysis.push({
          id: file.id,
          reason: ERROR_MESSAGES.FILE.NO_FREE_SPACE,
          allowed: false
        })
        continue
      }

      expectedUsage += file.size

      const newFile = new File({
        albumId,
        type: getFileTypeFromMimeType(file.mimetype),
        mimeType: file.mimetype,
        name: file.originalName,
        extension,
        size: file.size,
        uploaded: false
      })

      const uploadUrlDetails = await this.generateUploadUrlService.generateUploadUrl({
        id: newFile.id,
        originalName: newFile.name,
        size: newFile.size,
        mimetype: newFile.mimeType,
        userId
      })

      await this.saveFileRepository.save(newFile)

      filesAfterAnalysis.push({
        id: file.id,
        uploadUrl: uploadUrlDetails.url,
        fileId: newFile.id,
        fields: uploadUrlDetails.fields,
        allowed: true
      })
    }

    return filesAfterAnalysis
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
