import { CreateNewCustomerUseCase } from '@/application/use-case'
import { generateBcryptHashPassword } from '../util'
import { generateMongoCustomerRepository } from '../repository'
import { generateKafkaProducer } from '../messaging'

export async function generateCreateNewCustomerUseCase() {
  const customerRepository = generateMongoCustomerRepository()
  const hashPassword = generateBcryptHashPassword()
  const messageProducer = await generateKafkaProducer()
  const createNewCustomerUseCase = new CreateNewCustomerUseCase(customerRepository, hashPassword, customerRepository, messageProducer)
  return createNewCustomerUseCase
}
