import { PrismaUserRepository } from '@/infra/database/postgresql'

export const generateUserRepository = () => {
  return new PrismaUserRepository()
}
