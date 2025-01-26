import { PrismaOutboxRepository } from '@/infra/database/postgresql/repository'

export const generateOutboxRepository = () => {
  return new PrismaOutboxRepository()
}
