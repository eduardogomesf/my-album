import { type GetCurrentStorageUsageRepository, type GetCurrentStorageUsageRepositoryResponse, type SaveFileRepository } from '@/application/protocol/files'
import { type File } from '@/domain/entity'
import { Logger } from '@/shared'
import { prisma } from '../client'

export const logger = new Logger('PrismaFileRepository')

export class PrismaFileRepository implements SaveFileRepository, GetCurrentStorageUsageRepository {
  async save (file: File): Promise<void> {
    try {
      await prisma.file.create({
        data: {
          id: file.id,
          name: file.name,
          directoryPath: file.directoryPath,
          size: file.size,
          type: file.type,
          encoding: file.encoding,
          extension: file.extension,
          url: file.url as string,
          userId: file.userId
        }
      })
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }

  async getUsage (userId: string): Promise<GetCurrentStorageUsageRepositoryResponse> {
    try {
      const result = await prisma.file.groupBy({
        by: 'userId',
        where: {
          userId
        },
        _sum: {
          size: true
        }
      })
      return {
        usage: Number(result[0]._sum.size)
      }
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }
}
