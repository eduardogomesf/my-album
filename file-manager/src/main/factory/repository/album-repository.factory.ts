import { PrismaAlbumRepository } from '@/infra/database/postgresql'

export const generateAlbumRepository = () => {
  return new PrismaAlbumRepository()
}
