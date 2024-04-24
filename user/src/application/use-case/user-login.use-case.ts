import { type UseCase, type UseCaseResponse } from '../interface'
import { type TokenGenerator, type FindUserByEmailRepository, type PasswordValidator } from '../protocol'

interface UserLoginUseCaseDTO {
  email: string
  password: string
}

export class UserLoginUseCase implements UseCase {
  constructor(
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly passwordValidator: PasswordValidator,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async execute(payload: UserLoginUseCaseDTO): Promise<UseCaseResponse> {
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

    const token = await this.tokenGenerator.generate({
      id: userByEmail.id
    })

    return {
      ok: true,
      data: {
        token
      }
    }
  }
}
