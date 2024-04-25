import { MongoRefreshTokenRepository } from '@/infra/database/mongodb'

export function generateMongoRefreshTokenRepository() {
  return new MongoRefreshTokenRepository()
}
