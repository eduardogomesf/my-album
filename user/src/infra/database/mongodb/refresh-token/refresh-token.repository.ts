import {
  type SaveRefreshTokenRepository,
  type RefreshToken,
  type GetRefreshTokenByTokenAndUserIdRepository,
  type DeleteRefreshTokenByIdRepository,
} from '@/application/protocol'
import { Logger } from '@/shared'
import { RefreshTokenModel } from './refresh-token.entity'

const logger = new Logger('MongoUserRepository')

export class MongoRefreshTokenRepository
  implements
    SaveRefreshTokenRepository,
    GetRefreshTokenByTokenAndUserIdRepository,
    DeleteRefreshTokenByIdRepository
{
  async save(data: RefreshToken): Promise<void> {
    try {
      const payload = {
        _id: data.id,
        token: data.token,
        userId: data.userId,
      }

      await RefreshTokenModel.create(payload)
    } catch (error) {
      logger.error('Error saving refresh token')
      logger.error(error)
      throw error
    }
  }

  async getByTokenAndUserId(
    token: string,
    userId: string,
  ): Promise<RefreshToken | null> {
    try {
      const refreshToken = await RefreshTokenModel.findOne({
        token,
        userId,
      })

      if (!refreshToken) {
        return null
      }

      return {
        id: refreshToken?._id,
        token: refreshToken?.token,
        userId: refreshToken?.userId,
      }
    } catch (error) {
      logger.error('Error getting refresh token by token and user id')
      logger.error(error)
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await RefreshTokenModel.deleteOne({
        _id: id,
      })
    } catch (error) {
      logger.error('Error deleting refresh token by id')
      logger.error(error)
      throw error
    }
  }
}
