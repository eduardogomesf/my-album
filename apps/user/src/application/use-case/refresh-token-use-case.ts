import { v4 as uuid } from 'uuid'
import { ERROR_MESSAGES } from '../constant'
import { type UseCase, type UseCaseResponse } from '../interface'
import {
  type GetRefreshTokenByTokenAndUserIdRepository,
  type UserExistsRepository,
  type TokenGenerator,
  type DeleteRefreshTokenByIdRepository,
  type TokenValidator,
  type SaveRefreshTokenRepository,
} from '../protocol'

interface RefreshTokenUseCaseParams {
  refreshToken: string
  userId: string
}

interface RefreshTokenUseCaseResponse {
  accessToken: string
  refreshToken: string
  userId: string
}

export class RefreshTokenUseCase implements UseCase {
  constructor(
    private readonly userExistsRepository: UserExistsRepository,
    private readonly accessTokenGenerator: TokenGenerator,
    private readonly refreshTokenGenerator: TokenGenerator,
    private readonly getRefreshTokenByTokenAndUserIdRepository: GetRefreshTokenByTokenAndUserIdRepository,
    private readonly deleteRefreshTokenByIdRepository: DeleteRefreshTokenByIdRepository,
    private readonly refreshTokenValidator: TokenValidator,
    private readonly saveRefreshToken: SaveRefreshTokenRepository,
  ) {}

  async execute(
    params: RefreshTokenUseCaseParams,
  ): Promise<UseCaseResponse<RefreshTokenUseCaseResponse>> {
    const userExists = await this.userExistsRepository.exists(params.userId)

    if (!userExists) {
      return {
        ok: false,
        message: ERROR_MESSAGES.USER.NOT_FOUND,
      }
    }

    const refreshToken =
      await this.getRefreshTokenByTokenAndUserIdRepository.getByTokenAndUserId(
        params.refreshToken,
        params.userId,
      )

    if (!refreshToken) {
      return {
        ok: false,
        message: ERROR_MESSAGES.REFRESH_TOKEN.INVALID,
      }
    }

    const tokenValidation = await this.refreshTokenValidator.validate(
      refreshToken.token,
    )

    if (!tokenValidation.isValid) {
      await this.deleteRefreshTokenByIdRepository.delete(refreshToken.id)

      if (tokenValidation.invalidationReason === 'EXPIRED') {
        return {
          ok: false,
          message: ERROR_MESSAGES.REFRESH_TOKEN.EXPIRED,
        }
      }

      return {
        ok: false,
        message: ERROR_MESSAGES.REFRESH_TOKEN.INVALID,
      }
    }

    const [accessToken, newRefreshToken] = await Promise.all([
      this.accessTokenGenerator.generate({
        id: params.userId,
      }),
      this.refreshTokenGenerator.generate({
        id: params.userId,
      }),
    ])

    await this.deleteRefreshTokenByIdRepository.delete(refreshToken.id)

    await this.saveRefreshToken.save({
      id: uuid(),
      token: newRefreshToken,
      userId: params.userId,
    })

    return {
      ok: true,
      data: {
        accessToken,
        refreshToken: newRefreshToken,
        userId: params.userId,
      },
    }
  }
}
