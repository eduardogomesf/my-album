import {
  type GetFilesByAlbumIdRepository,
  type GetCurrentStorageUsageRepository,
  type GetCurrentStorageUsageRepositoryResponse,
  type SaveFileRepository,
  type GetFilesFilters
} from '@/application/protocol/files'
import { type File } from '@/domain/entity'
import { Logger } from '@/shared'
import { prisma } from '../client'
import { PrismaQueryHelper } from '../helper'
import { FileMapper } from '../mapper/file.mapper'

const logger = new Logger('PrismaFileRepository')

export class PrismaFileRepository implements SaveFileRepository, GetCurrentStorageUsageRepository, GetFilesByAlbumIdRepository {
  async getManyWithFilters(albumId: string, filters: GetFilesFilters): Promise<File[]> {
    const { limit, offset } = PrismaQueryHelper.getPagination(filters.page, filters.limit)

    try {
      const files = await prisma.file.findMany({
        where: {
          albumId,
          status: {
            in: filters.statuses
          }
        },
        skip: offset,
        take: limit,
        orderBy: {
          updatedAt: 'desc'
        }
      })
      return files.map(file => FileMapper.toEntity(file))
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
          status: file.status
        }
      })
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }

  async getUsage(userId: string): Promise<GetCurrentStorageUsageRepositoryResponse> {
    const usage = await prisma.$executeRaw`
      SELECT SUM(size) as usage FROM "files" WHERE "album_id" IN (SELECT id FROM "albums" WHERE "user_id" = ${userId})
    `

    return {
      usage: usage || 0
    }
  }
}
