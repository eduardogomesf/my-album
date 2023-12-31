import { Customer } from '@/domain/entity'
import { type UseCaseResponse } from '../interface'
import { type CreateCustomerRepository, type GetCustomerByEmailRepository } from '../protocol'

interface AddNewCustomerDTO {
  id?: string
  firstName: string
  lastName: string
  email: string
}

export class AddNewCustomerUseCase {
  constructor(
    private readonly getCustomerByEmailRepository: GetCustomerByEmailRepository,
    private readonly createCustomerRepository: CreateCustomerRepository
  ) {}

  async execute(customerDto: AddNewCustomerDTO): Promise<UseCaseResponse> {
    const customerAlreadyExists = await this.getCustomerByEmailRepository.getByEmail(customerDto.email)

    if (customerAlreadyExists) {
      return {
        data: customerAlreadyExists,
        ok: true,
        message: 'Customer already exists'
      }
    }

    const customer = new Customer({
      id: customerDto.id,
      firstName: customerDto.firstName,
      lastName: customerDto.lastName,
      email: customerDto.email
    })

    await this.createCustomerRepository.create(customer)

    return {
      data: customer,
      ok: true,
      message: 'Customer created successfully'
    }
  }
}
