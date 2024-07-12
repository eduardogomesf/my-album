import { User } from '@/domain/entity/user.entity'
import { type UseCase, type UseCaseResponse } from '../interface'
import {
  type HashPassword,
  type FindUserByEmailRepository,
  type CreateUserRepository
} from '../protocol'
import { Publisher } from '../interface/observer.interface'
import { ERROR_MESSAGES } from '../constant'

interface CreateNewUserUseCaseDTO {
  firstName: string
  lastName: string
  email: string
  cellphone: string
  password: string
}

export class CreateNewUserUseCase extends Publisher implements UseCase {
  constructor(
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly hashPassword: HashPassword,
    private readonly createUserRepository: CreateUserRepository
  ) {
    super(CreateNewUserUseCase.name)
  }

  async execute(payload: CreateNewUserUseCaseDTO): Promise<UseCaseResponse> {
    const userByEmail = await this.findUserByEmailRepository.findByEmail(payload.email)

    if (userByEmail) {
      return {
        ok: false,
        message: ERROR_MESSAGES.USER.EMAIL_ALREADY_EXIST
      }
    }

    const securePassword = await this.hashPassword.hash(payload.password)

    const user = new User({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      cellphone: payload.cellphone,
      password: securePassword
    })

    await this.createUserRepository.create(user)

    this.notifySubscribers({
      id: user.id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      cellphone: payload.cellphone
    })

    return {
      ok: true
    }
  }
}
