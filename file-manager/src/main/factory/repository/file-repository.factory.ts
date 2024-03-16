import { PrismaFileRepository } from '@/infra/database/postgresql'

export const generateFileRepository = () => {
  return new PrismaFileRepository()
}
