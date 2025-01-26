import { RefreshTokenUseCase } from '@/application/use-case'
import {
  type UserExistsRepository,
  type TokenGenerator,
  type GetRefreshTokenByTokenAndUserIdRepository,
  type DeleteRefreshTokenByIdRepository,
  type TokenValidator,
  type SaveRefreshTokenRepository,
} from '@/application/protocol'

export const generateRefreshTokenUseCase = (
  userExistsRepository: UserExistsRepository,
  accessTokenGenerator: TokenGenerator,
  refreshTokenGenerator: TokenGenerator,
  getRefreshTokenByTokenAndUserIdRepository: GetRefreshTokenByTokenAndUserIdRepository,
  deleteRefreshTokenByIdRepository: DeleteRefreshTokenByIdRepository,
  refreshTokenValidator: TokenValidator,
  saveRefreshToken: SaveRefreshTokenRepository,
): RefreshTokenUseCase => {
  return new RefreshTokenUseCase(
    userExistsRepository,
    accessTokenGenerator,
    refreshTokenGenerator,
    getRefreshTokenByTokenAndUserIdRepository,
    deleteRefreshTokenByIdRepository,
    refreshTokenValidator,
    saveRefreshToken,
  )
}
