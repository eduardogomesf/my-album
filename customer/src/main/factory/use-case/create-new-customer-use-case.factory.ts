import { CreateNewCustomerUseCase } from '@/application/use-case'
import { generateBcryptHashPassword } from '../util'
import { generateMongoCustomerRepository } from '../repository'
import { generateNewCustomerCreatedSender } from '../messaging-system'

export function generateCreateNewCustomerUseCase() {
  const customerRepository = generateMongoCustomerRepository()
  const hashPassword = generateBcryptHashPassword()
  const messageSender = generateNewCustomerCreatedSender()
  const createNewCustomerUseCase = new CreateNewCustomerUseCase(customerRepository, hashPassword, customerRepository, messageSender)
  return createNewCustomerUseCase
}
