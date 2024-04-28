import { type AlbumStatus as AlbumStatusPrisma } from '@prisma/client'
import { type Album } from '@/domain/entity'
import { Logger } from '@/shared'
import { prisma } from '../client'
import {
  type GetAlbumByNameRepository,
  type GetAlbumByIdRepository,
  type SaveAlbumRepository,
  type GetAlbumsByStatusRepository
} from '@/application/protocol'
import { type AlbumStatus } from '@/domain/enum'
import { AlbumMapper } from '../mapper'

const logger = new Logger('PrismaAlbumRepository')

export class PrismaAlbumRepository implements GetAlbumByIdRepository, GetAlbumByNameRepository, SaveAlbumRepository, GetAlbumsByStatusRepository {
  async getById(id: string, userId: string): Promise<Album | null> {
    try {
      const rawAlbum = await prisma.album.findUnique({
        where: {
          id,
          userId
        }
      })
      return AlbumMapper.toDomain(rawAlbum)
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }

  async getByName(name: string): Promise<Album | null> {
    try {
      const rawAlbum = await prisma.album.findUnique({
        where: {
          name
        }
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
          userId: album.userId
        }
      })
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }

  async getManyByStatus(userId: string, status: AlbumStatus): Promise<Album[]> {
    try {
      const albums = await prisma.album.findMany({
        where: {
          userId,
          status: status as AlbumStatusPrisma
        },
        orderBy: {
          updatedAt: 'desc'
        }
      })

      return albums.map(album => AlbumMapper.toDomain(album)) as Album[]
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }
}
