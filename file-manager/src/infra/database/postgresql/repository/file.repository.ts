import { type GetCurrentStorageUsageRepository, type GetCurrentStorageUsageRepositoryResponse, type SaveFileRepository } from '@/application/protocol/files'
import { type File } from '@/domain/entity'
import { Logger } from '@/shared'
import { prisma } from '../client'

const logger = new Logger('PrismaFileRepository')

export class PrismaFileRepository implements SaveFileRepository, GetCurrentStorageUsageRepository {
  async save (file: File): Promise<void> {
    try {
      await prisma.file.create({
        data: {
          id: file.id,
          name: file.name,
          size: file.size,
          type: file.type,
          encoding: file.encoding,
          extension: file.extension,
          url: file.url as string,
          albumId: file.albumId,
          isDeleted: file.isDeleted ?? false
        }
      })
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }

  async getUsage (userId: string): Promise<GetCurrentStorageUsageRepositoryResponse> {
    return {
      usage: 0
    }
  }
}
