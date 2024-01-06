import { PrismaCustomerRepository } from '@/infra/database/postgresql'

export const generateCustomerRepository = () => {
  return new PrismaCustomerRepository()
}
