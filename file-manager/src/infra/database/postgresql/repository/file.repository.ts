import { OutboxType, Prisma } from '@prisma/client'
import { v4 as uuid } from 'uuid'
import {
  type GetFilesByAlbumIdRepository,
  type GetCurrentStorageUsageRepository,
  type SaveFileRepository,
  type GetFilesFilters,
  type MoveFilesToAlbumByFilesIdsRepository,
  type MoveFilesRepositoryParams,
  type GetFilesByIdsRepository,
  type GetFilesByIdsRepositoryResponse,
  type CountFilesByAlbumIdRepository,
  type GetFilesByIdsAndAlbumIdRepository,
  type DeleteFilesRepository
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
  MoveFilesToAlbumByFilesIdsRepository, GetFilesByIdsRepository, CountFilesByAlbumIdRepository,
  GetFilesByIdsAndAlbumIdRepository, DeleteFilesRepository {
  async getManyWithFilters(albumId: string, filters: GetFilesFilters): Promise<File[]> {
    const { limit, offset } = PrismaQueryHelper.getPagination(filters.page, filters.limit)

    try {
      const files = await prisma.file.findMany({
        where: {
          albumId,
          uploaded: true
        },
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'desc'
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
          uploaded: file.uploaded,
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
      const usageRaw = await prisma.$queryRaw<Array<{ usage: number }>>`
        SELECT SUM(size) as usage FROM "files" f WHERE "album_id" IN (SELECT id FROM "albums" WHERE "user_id" = ${userId}) and f.uploaded = true
      `

      const usage = usageRaw[0]?.usage ? Number(usageRaw[0]?.usage) : 0

      return {
        usage
      }
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }

  async moveFiles(payload: MoveFilesRepositoryParams): Promise<void> {
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

  async getByIds(filesIds: string[]): Promise<GetFilesByIdsRepositoryResponse> {
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
          albumId,
          uploaded: true
        }
      })
      return numberOfFiles
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }

  async getFilesByIdsAndAlbumId(
    filesIds: string[],
    albumId: string,
    userId: string
  ): Promise<File[]> {
    try {
      const fieldsInParams = Prisma.join(filesIds)

      const rawFiles = await prisma.$queryRaw<any[]>`
        SELECT f.* FROM files f JOIN albums a ON f.album_id = a.id WHERE f.id IN (${fieldsInParams}) and a.user_id = ${userId} and a.id = ${albumId}
      `

      if (!rawFiles?.length) {
        return []
      }

      const files = rawFiles.map((rawFile) => {
        return FileMapper.toEntity({
          ...rawFile,
          userId: rawFile.user_id,
          albumId: rawFile.album_id,
          createdAt: rawFile.created_at,
          updatedAt: rawFile.updated_at
        })
      })

      return files
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }

  async deleteFiles(files: File[]): Promise<boolean> {
    try {
      const filesIds = files.map(file => file.id)

      await prisma.$transaction([
        prisma.file.deleteMany({
          where: {
            id: {
              in: filesIds
            }
          }
        }),
        prisma.outbox.createMany({
          data: files.map(file => ({
            id: uuid(),
            type: OutboxType.FILE_DELETED,
            payload: JSON.stringify(file),
            aggregateId: file.id
          }))
        })
      ])
      return true
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }
}
