import { CreateNewCustomerUseCase } from '../../../application/use-case'
import { generateBcryptHashPassword } from '../cryptography/bcrypt-hash-password.factory'
import { generateMongoCustomerRepository } from '../repository/mongo-customer-repository.factory'

export function generateCreateNewCustomerUseCase() {
  const customerRepository = generateMongoCustomerRepository()
  const hashPassword = generateBcryptHashPassword()
  const createNewCustomerUseCase = new CreateNewCustomerUseCase(customerRepository, hashPassword, customerRepository)
  return createNewCustomerUseCase
}
