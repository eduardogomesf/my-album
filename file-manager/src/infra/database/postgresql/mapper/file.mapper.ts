import { type File as PrismaFile } from '@prisma/client'
import { File } from '@/domain/entity'

export class FileMapper {
  static toEntity(file: PrismaFile) {
    return new File({
      id: file.id,
      name: file.name,
      size: Number(file.size),
      type: file.type,
      extension: file.extension,
      mimeType: file.mimeType,
      albumId: file.albumId,
      uploaded: file.uploaded,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt
    })
  }
}
