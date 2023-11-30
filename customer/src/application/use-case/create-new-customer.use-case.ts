import { Customer } from '@/domain/entity/customer.entity'
import { type UseCaseResponse } from '../interface'
import {
  type HashPassword,
  type FindCustomerByEmailRepository,
  type CreateCustomerRepository,
  type MessageSender
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
    private readonly newCustomerCreatedSender: MessageSender
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
