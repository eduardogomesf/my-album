import { DomainError, File } from '@/domain/entity'
import { type UseCaseResponse } from '../interface'
import {
  type SaveFileStorageService,
  type GetCurrentStorageUsageRepository,
  type SaveFileRepository
} from '../protocol/files'

export interface AddNewFileParams {
  name: string
  directoryPath: string
  size: number
  encoding: string
  type: string
  extension: string
  userId: string
  content: Buffer
}

export class AddNewFileUseCase {
  constructor(
    private readonly getCurrentStorageUsageRepository: GetCurrentStorageUsageRepository,
    private readonly saveFileStorageService: SaveFileStorageService,
    private readonly saveFileRepository: SaveFileRepository
  ) {}

  async add(params: AddNewFileParams): Promise<UseCaseResponse> {
    try {
      const { name, directoryPath, size, extension, userId, encoding, type, content } = params

      const file = new File({
        name,
        directoryPath,
        size,
        encoding,
        type,
        extension,
        userId
      })

      const isValidExtension = this.validateExtension(extension)

      if (!isValidExtension) {
        return {
          ok: false,
          message: 'Invalid extension'
        }
      }

      const isValidSize = this.validateSize(size)

      if (!isValidSize) {
        return {
          ok: false,
          message: 'The file is too large. Max 10MB'
        }
      }

      const canAddMoreFilesValidation = await this.canAddMoreFiles(userId, size)

      if (!canAddMoreFilesValidation.canAdd) {
        return {
          ok: false,
          message: `You don't have enough space. Free space: ${canAddMoreFilesValidation.freeSpace} bytes`
        }
      }

      const { url } = await this.saveFileStorageService.save({
        name,
        directoryPath,
        content,
        encoding,
        type,
        userId
      })

      file.url = url

      await this.saveFileRepository.save(file)

      return {
        ok: true,
        data: file
      }
    } catch (error) {
      if (error instanceof DomainError) {
        return {
          ok: false,
          message: error.message
        }
      }

      throw error
    }
  }

  private async canAddMoreFiles(userId: string, size: number): Promise<{ freeSpace: number, canAdd: boolean }> {
    const { usage } = await this.getCurrentStorageUsageRepository.getUsage(userId)

    const maxStorageSize = 1024 * 1024 * 50 // 50MB

    const freeSpace = maxStorageSize - usage

    return {
      freeSpace,
      canAdd: freeSpace >= size
    }
  }

  private validateExtension(extension: string): boolean {
    const allowedExtensions = [
      'jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt',
      'pptx', 'txt', 'zip', 'rar', 'tar'
    ]

    return allowedExtensions.includes(extension)
  }

  private validateSize(size: number): boolean {
    const allowedSize = 1024 * 1024 * 10 // 10MB

    return size <= allowedSize
  }
}
