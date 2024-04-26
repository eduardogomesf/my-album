import { type UseCase, type UseCaseResponse } from '../interface'
import { v4 as uuid } from 'uuid'
import {
  type TokenGenerator,
  type FindUserByEmailRepository,
  type PasswordValidator,
  type SaveRefreshTokenRepository
} from '../protocol'

interface UserLoginUseCaseDTO {
  email: string
  password: string
}

interface UserLoginUseCaseResponse {
  accessToken: string
  refreshToken: string
}

export class UserLoginUseCase implements UseCase {
  constructor(
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly passwordValidator: PasswordValidator,
    private readonly tokenGenerator: TokenGenerator,
    private readonly refreshTokenGenerator: TokenGenerator,
    private readonly saveRefreshToken: SaveRefreshTokenRepository
  ) {}

  async execute(payload: UserLoginUseCaseDTO): Promise<UseCaseResponse<UserLoginUseCaseResponse>> {
    const userByEmail = await this.findUserByEmailRepository.findByEmail(payload.email)

    const notValidCredentialsMessage = 'No user found with the given credentials'

    if (!userByEmail) {
      return {
        ok: false,
        message: notValidCredentialsMessage
      }
    }

    const isPasswordValid = await this.passwordValidator.validate(payload.password, userByEmail.password)

    if (!isPasswordValid) {
      return {
        ok: false,
        message: notValidCredentialsMessage
      }
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenGenerator.generate({
        id: userByEmail.id
      }),
      this.refreshTokenGenerator.generate({
        id: userByEmail.id
      })
    ])

    await this.saveRefreshToken.save({
      id: uuid(),
      token: refreshToken,
      userId: userByEmail.id
    })

    return {
      ok: true,
      data: {
        accessToken,
        refreshToken
      }
    }
  }
}
