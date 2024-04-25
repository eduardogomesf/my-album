import { UserLoginUseCase } from '@/application/use-case'
import {
  type SaveRefreshTokenRepository,
  type FindUserByEmailRepository,
  type PasswordValidator,
  type TokenGenerator
} from '@/application/protocol'

export const generateUserLoginUseCase = (
  findUserByEmailRepository: FindUserByEmailRepository,
  passwordValidator: PasswordValidator,
  tokenGenerator: TokenGenerator,
  refreshTokenGenerator: TokenGenerator,
  saveRefreshTokenRepository: SaveRefreshTokenRepository
) => {
  return new UserLoginUseCase(
    findUserByEmailRepository,
    passwordValidator,
    tokenGenerator,
    refreshTokenGenerator,
    saveRefreshTokenRepository
  )
}
