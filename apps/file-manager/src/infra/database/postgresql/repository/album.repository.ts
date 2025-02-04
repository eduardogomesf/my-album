import {
  OutboxType,
  type AlbumStatus as AlbumStatusPrisma,
} from '@prisma/client'
import { v4 as uuid } from 'uuid'

import { type Album } from '@/domain/entity'
import { Logger } from '@/shared'
import { prisma } from '../client'
import {
  type GetAlbumByNameRepository,
  type GetAlbumByIdRepository,
  type SaveAlbumRepository,
  type GetAlbumsByStatusRepository,
  type UpdateAlbumRepository,
  type DeleteAlbumRepository,
  type GetAlbumsByStatusRepositoryResponse,
  type GetAlbumByIdWithFilesCountRepository,
  type AlbumWithFileCount,
  type MessageSender,
} from '@/application/protocol'
import { type AlbumStatus } from '@/domain/enum'
import { AlbumMapper } from '../mapper'

const logger = new Logger('PrismaAlbumRepository')

export class PrismaAlbumRepository
  implements
    GetAlbumByIdRepository,
    GetAlbumByNameRepository,
    SaveAlbumRepository,
    GetAlbumsByStatusRepository,
    UpdateAlbumRepository,
    DeleteAlbumRepository,
    GetAlbumByIdWithFilesCountRepository
{
  constructor(private readonly deleteFilesFromStorageSender: MessageSender) {}

  async getById(id: string, userId: string): Promise<Album | null> {
    try {
      const rawAlbum = await prisma.album.findUnique({
        where: {
          id,
          userId,
        },
      })
      return AlbumMapper.toDomain(rawAlbum)
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }

  async getByName(name: string, userId: string): Promise<Album | null> {
    try {
      const rawAlbum = await prisma.album.findFirst({
        where: {
          name,
          userId,
        },
      })
      return AlbumMapper.toDomain(rawAlbum)
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }

  async save(album: Album): Promise<void> {
    try {
      await prisma.album.create({
        data: {
          id: album.id,
          name: album.name,
          userId: album.userId,
        },
      })
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }

  async getManyByStatus(
    userId: string,
    status: AlbumStatus,
  ): Promise<GetAlbumsByStatusRepositoryResponse[]> {
    try {
      const albumsWithCounts = await prisma.$queryRaw<any[]>`
        select
          a.id as "albumId",
          a.name,
          a.updated_at as "updatedAt",
          count(case when f."type" = 'image' then 1 end) as "numberOfPhotos",
          count(case when f."type" = 'video' then 1 end) as "numberOfVideos"
        from albums a
        left join files f on a.id = f.album_id and f.uploaded = true
        where a.status = ${status}::"AlbumStatus"
        AND a.user_id = ${userId}
        group by a.id, a.name, a.updated_at
        order by a.updated_at desc
      `

      return albumsWithCounts.map((album) => ({
        id: album.albumId,
        name: album.name,
        updatedAt: album.updatedAt,
        numberOfPhotos: Number(album.numberOfPhotos),
        numberOfVideos: Number(album.numberOfVideos),
      }))
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }

  async getByIdWithFilesCount(
    id: string,
    userId: string,
  ): Promise<AlbumWithFileCount> {
    try {
      const albumsWithCounts = await prisma.$queryRaw<any[]>`
        select
          a.id as "id",
          a.name,
          a.status,
          a.created_at as "createdAt",
          a.updated_at as "updatedAt",
          a.user_id as "userId",
          count(f.id) as "numberOfFiles"
        from albums a
        left join files f on a.id = f.album_id and f.uploaded = true
        where a.id = ${id}
        AND a.user_id = ${userId}
        group by a.id, a.name, a.status, a.created_at, a.updated_at, a.user_id
      `

      const rawResult = albumsWithCounts.length > 0 ? albumsWithCounts[0] : null

      if (rawResult) {
        rawResult.numberOfFiles = Number(rawResult.numberOfFiles)
      }

      return rawResult
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }

  async update(album: Album): Promise<void> {
    try {
      await prisma.album.update({
        where: {
          id: album.id,
        },
        data: {
          name: album.name,
          status: album.status as AlbumStatusPrisma,
        },
      })
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }

  async delete(albumId: string, userId: string): Promise<void> {
    try {
      const files = await prisma.file.findMany({
        where: {
          albumId,
        },
      })

      if (files.length <= 0) {
        await prisma.album.delete({
          where: {
            id: albumId,
            userId,
          },
        })
        return
      }

      const formattedFiles = files.map((file) => ({
        id: uuid(),
        type: OutboxType.FILE_DELETED,
        payload: JSON.stringify({ ...file, size: file.size.toString() }),
        aggregateId: file.id,
      }))

      await prisma.$transaction([
        prisma.album.delete({
          where: {
            id: albumId,
            userId,
          },
        }),
        prisma.outbox.createMany({
          data: formattedFiles,
        }),
      ])

      const filesIds = formattedFiles.map((file) => file.aggregateId)

      await this.deleteFilesFromStorageSender.send({
        id: uuid(),
        filesIds,
        userId,
        date: new Date(),
      })
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }
}
