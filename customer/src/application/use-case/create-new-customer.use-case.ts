import { Customer } from '@/domain/entity/customer.entity'
import { type UseCaseResponse } from '../interface'
import {
  type HashPassword,
  type FindCustomerByEmailRepository,
  type CreateCustomerRepository,
  type MessageSender,
  type SendEmailNotification
} from '../protocol'

interface CreateNewCustomerUseCaseDTO {
  firstName: string
  lastName: string
  email: string
  cellphone: string
  password: string
}

export class CreateNewCustomerUseCase {
  constructor(
    private readonly findCustomerByEmailRepository: FindCustomerByEmailRepository,
    private readonly hashPassword: HashPassword,
    private readonly createCustomerRepository: CreateCustomerRepository,
    private readonly newCustomerCreatedSender: MessageSender,
    private readonly sendEmailNotification: SendEmailNotification
  ) {}

  async create(payload: CreateNewCustomerUseCaseDTO): Promise<UseCaseResponse> {
    const userByEmail = await this.findCustomerByEmailRepository.findByEmail(payload.email)

    if (userByEmail) {
      return {
        ok: false,
        message: 'E-mail already in use'
      }
    }

    const securePassword = await this.hashPassword.hash(payload.password)

    const customer = new Customer({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      cellphone: payload.cellphone,
      password: securePassword
    })

    await this.createCustomerRepository.create(customer)

    await this.newCustomerCreatedSender.send({
      id: customer.id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      cellphone: payload.cellphone
    })

    await this.sendEmailNotification.send({
      sourceEmail: '001',
      targetEmail: payload.email,
      subject: 'Welcome to our platform',
      body: '<p>Hello, welcome to our platform.</p>'
    })

    return {
      ok: true
    }
  }
}
