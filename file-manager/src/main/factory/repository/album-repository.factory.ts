import { PrismaAlbumRepository } from '@/infra/database/postgresql'
import { MessageSender } from '@/application/protocol'

export const generateAlbumRepository = (
  deleteFilesFromStorageSender: MessageSender
) => {
  return new PrismaAlbumRepository(deleteFilesFromStorageSender)
}
