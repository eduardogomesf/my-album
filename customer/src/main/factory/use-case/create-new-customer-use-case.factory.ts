import { CreateNewCustomerUseCase } from '../../../application/use-case'
import { generateBcryptHashPassword } from '../util'
import { generateMongoCustomerRepository } from '../repository'

export function generateCreateNewCustomerUseCase() {
  const customerRepository = generateMongoCustomerRepository()
  const hashPassword = generateBcryptHashPassword()
  const createNewCustomerUseCase = new CreateNewCustomerUseCase(customerRepository, hashPassword, customerRepository)
  return createNewCustomerUseCase
}
