import { type UseCaseResponse } from '../interface'
import { type TokenGenerator, type FindCustomerByEmailRepository, type PasswordValidator } from '../protocol'

interface CustomerLoginUseCaseDTO {
  email: string
  password: string
}

export class CustomerLoginUseCase {
  constructor(
    private readonly findCustomerByEmailRepository: FindCustomerByEmailRepository,
    private readonly passwordValidator: PasswordValidator,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async login(payload: CustomerLoginUseCaseDTO): Promise<UseCaseResponse> {
    const customerByEmail = await this.findCustomerByEmailRepository.findByEmail(payload.email)

    const notValidCredentialsMessage = 'No customer found with the given credentials'

    if (!customerByEmail) {
      return {
        ok: false,
        message: notValidCredentialsMessage
      }
    }

    const isPasswordValid = await this.passwordValidator.validate(payload.password, customerByEmail.password)

    if (!isPasswordValid) {
      return {
        ok: false,
        message: notValidCredentialsMessage
      }
    }

    const token = await this.tokenGenerator.generate({
      id: customerByEmail.id
    })

    return {
      ok: true,
      data: {
        token
      }
    }
  }
}
