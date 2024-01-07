import { MongoUserRepository } from '@/infra/database/mongodb/user/user.repository'

export function generateMongoUserRepository() {
  return new MongoUserRepository()
}
