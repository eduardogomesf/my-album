import { Album } from '@/domain/entity'
import { Logger } from '@/shared'
import { prisma } from '../client'
import { type GetAlbumByIdRepository } from '@/application/protocol'

const logger = new Logger('PrismaAlbumRepository')

export class PrismaAlbumRepository implements GetAlbumByIdRepository {
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
}
