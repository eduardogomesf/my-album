import { User } from '@/domain/entity/user.entity'
import { type UseCaseResponse } from '../interface'
import {
  type HashPassword,
  type FindUserByEmailRepository,
  type CreateUserRepository,
  type MessageSender,
  type SendEmailNotification
} from '../protocol'

interface CreateNewUserUseCaseDTO {
  firstName: string
  lastName: string
  email: string
  cellphone: string
  password: string
}

export class CreateNewUserUseCase {
  constructor(
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly hashPassword: HashPassword,
    private readonly createUserRepository: CreateUserRepository,
    private readonly newUserCreatedSender: MessageSender,
    private readonly sendEmailNotification: SendEmailNotification
  ) {}

  async create(payload: CreateNewUserUseCaseDTO): Promise<UseCaseResponse> {
    const userByEmail = await this.findUserByEmailRepository.findByEmail(payload.email)

    if (userByEmail) {
      return {
        ok: false,
        message: 'E-mail already in use'
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

    await this.newUserCreatedSender.send({
      id: user.id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      cellphone: payload.cellphone
    })

    await this.sendEmailNotification.send({
      sourceEmail: 'test@test.com',
      targetEmail: payload.email,
      subject: 'Welcome to our platform',
      body: '<p>Hello, welcome to our platform.</p>'
    })

    return {
      ok: true
    }
  }
}
