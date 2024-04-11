import { type GetFilesByAlbumIdRepository, type GetCurrentStorageUsageRepository, type GetCurrentStorageUsageRepositoryResponse, type SaveFileRepository } from '@/application/protocol/files'
import { File } from '@/domain/entity'
import { Logger } from '@/shared'
import { prisma } from '../client'

const logger = new Logger('PrismaFileRepository')

export class PrismaFileRepository implements SaveFileRepository, GetCurrentStorageUsageRepository, GetFilesByAlbumIdRepository {
  async getManyById(albumId: string): Promise<File[]> {
    try {
      const files = await prisma.file.findMany({
        where: {
          albumId,
          isDeleted: false
        }
      })
      return files
        ? files.map(file => new File({
          ...file,
          size: Number(file.size)
        }))
        : []
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }

  async save(file: File): Promise<void> {
    try {
      await prisma.file.create({
        data: {
          id: file.id,
          name: file.name,
          size: file.size,
          type: file.type,
          encoding: file.encoding,
          extension: file.extension,
          albumId: file.albumId,
          isDeleted: file.isDeleted ?? false
        }
      })
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }

  async getUsage(userId: string): Promise<GetCurrentStorageUsageRepositoryResponse> {
    return {
      usage: 0
    }
  }
}
