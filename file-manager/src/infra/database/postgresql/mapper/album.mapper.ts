import { type Album as AlbumPrisma } from '@prisma/client'
import { Album } from '@/domain/entity'
import { type AlbumStatus } from '@/domain/enum'

export class AlbumMapper {
  static toDomain(raw: AlbumPrisma | null): Album | null {
    if (!raw) {
      return null
    }

    return new Album({
      id: raw.id,
      name: raw.name,
      userId: raw.userId,
      status: raw.status as AlbumStatus,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    })
  }
}
