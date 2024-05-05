import {
  type GetFilesByAlbumIdRepository,
  type GetCurrentStorageUsageRepository,
  type SaveFileRepository,
  type GetFilesFilters,
  type MoveFilesToAlbumByFilesIdsRepository,
  type MoveFilesRepositoryParams,
  type GetFilesByIdsRepository,
  type GetFilesByIdsRepositoryResponse,
  type CountFilesByAlbumIdRepository
} from '@/application/protocol'
import { type File } from '@/domain/entity'
import { Logger } from '@/shared'
import { prisma } from '../client'
import { PrismaQueryHelper } from '../helper'
import { FileMapper } from '../mapper/file.mapper'
import { AlbumMapper } from '../mapper'

const logger = new Logger('PrismaFileRepository')

export class PrismaFileRepository
implements
  SaveFileRepository, GetCurrentStorageUsageRepository, GetFilesByAlbumIdRepository,
  MoveFilesToAlbumByFilesIdsRepository, GetFilesByIdsRepository, CountFilesByAlbumIdRepository {
  async getManyWithFilters(albumId: string, filters: GetFilesFilters): Promise<File[]> {
    const { limit, offset } = PrismaQueryHelper.getPagination(filters.page, filters.limit)

    try {
      const files = await prisma.file.findMany({
        where: {
          albumId
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
          albumId: file.albumId
        }
      })
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }

  async getUsage(userId: string): Promise<{ usage: number }> {
    try {
      const usage = await prisma.$executeRaw`
        SELECT SUM(size) as usage FROM "files" WHERE "album_id" IN (SELECT id FROM "albums" WHERE "user_id" = ${userId})
      `
      return {
        usage: usage || 0
      }
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }

  async moveFiles (payload: MoveFilesRepositoryParams): Promise<void> {
    try {
      await prisma.file.updateMany({
        where: {
          id: {
            in: payload.filesIds
          }
        },
        data: {
          albumId: payload.targetAlbumId
        }
      })
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }

  async getByIds (filesIds: string[]): Promise<GetFilesByIdsRepositoryResponse> {
    try {
      const files = await prisma.file.findMany({
        where: {
          id: {
            in: filesIds
          }
        },
        include: {
          album: true
        }
      })
      return files.map((rawFile) => {
        const file = FileMapper.toEntity(rawFile)
        return {
          ...file,
          album: AlbumMapper.toDomain(rawFile.album)
        } as any
      })
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }

  async countWithFilters(albumId: string): Promise<number> {
    try {
      const numberOfFiles = await prisma.file.count({
        where: {
          albumId
        }
      })
      return numberOfFiles
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }
}
