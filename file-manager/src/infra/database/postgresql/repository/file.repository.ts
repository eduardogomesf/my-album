import { type SaveFileRepository } from '@/application/protocol/files'
import { type File } from '@/domain/entity'
import { Logger } from '@/shared'
import { prisma } from '../client'

export const logger = new Logger('PrismaFileRepository')

export class PrismaFileRepository implements SaveFileRepository {
  async save (file: File): Promise<void> {
    try {
      await prisma.file.create({
        data: {
          id: file.id,
          name: file.name,
          directoryPath: file.directoryPath,
          size: file.size,
          type: file.type,
          encoding: file.encoding,
          extension: file.extension,
          url: file.url as string,
          userId: file.userId
        }
      })
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }
}
