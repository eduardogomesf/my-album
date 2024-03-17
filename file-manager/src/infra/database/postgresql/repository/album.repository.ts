import { Album } from '@/domain/entity'
import { Logger } from '@/shared'
import { prisma } from '../client'
import {
  type GetAlbumByNameRepository,
  type GetAlbumByIdRepository,
  type SaveAlbumRepository,
  type GetAlbumsRepository
} from '@/application/protocol'

const logger = new Logger('PrismaAlbumRepository')

export class PrismaAlbumRepository implements GetAlbumByIdRepository, GetAlbumByNameRepository, SaveAlbumRepository, GetAlbumsRepository {
  async getById(id: string): Promise<Album | null> {
    try {
      const rawAlbum = await prisma.album.findUnique({
        where: {
          id
        }
      })
      return rawAlbum ? new Album(rawAlbum) : null
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
      return rawAlbum ? new Album(rawAlbum) : null
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
          isMain: album.isMain ?? false,
          isDeleted: album.isDeleted ?? false

        }
      })
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }

  async getAll (userId: string): Promise<Album[]> {
    try {
      const albums = await prisma.album.findMany({
        where: {
          userId,
          isDeleted: false
        }
      })
      return albums.map(album => new Album(album))
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }
}
