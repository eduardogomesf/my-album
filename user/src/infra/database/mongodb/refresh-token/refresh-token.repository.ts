import { type SaveRefreshTokenRepository, type RefreshToken } from '@/application/protocol'
import { Logger } from '@/shared'
import { RefreshTokenModel } from './refresh-token.entity'

const logger = new Logger('MongoUserRepository')

export class MongoRefreshTokenRepository implements SaveRefreshTokenRepository {
  async save(data: RefreshToken): Promise<void> {
    try {
      const payload = {
        _id: data.id,
        token: data.token,
        userId: data.userId
      }

      await RefreshTokenModel.create(payload)
    } catch (error) {
      logger.error('Error saving refresh token')
      logger.error(error)
      throw error
    }
  }
}
