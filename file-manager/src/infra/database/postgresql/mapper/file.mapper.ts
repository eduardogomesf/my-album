import { type File as PrismaFile } from '@prisma/client'
import { File } from '@/domain/entity'
import { type FileStatus } from '@/domain/enum'

export class FileMapper {
  static toEntity(file: PrismaFile) {
    return new File({
      id: file.id,
      name: file.name,
      size: Number(file.size),
      encoding: file.encoding,
      type: file.type,
      extension: file.extension,
      albumId: file.albumId,
      status: file.status as FileStatus,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt
    })
  }
}