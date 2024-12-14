import { PrismaAlbumRepository } from '@/infra/database/postgresql'
import { type MessageSender } from '@/application/protocol'

export const generateAlbumRepository = (
  deleteFilesFromStorageSender: MessageSender,
) => {
  return new PrismaAlbumRepository(deleteFilesFromStorageSender)
}
