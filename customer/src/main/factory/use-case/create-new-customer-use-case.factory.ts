import { CreateNewCustomerUseCase } from '@/application/use-case'
import { ENVS } from '@/shared'
import { generateBcryptHashPassword } from '../util'
import { generateMongoCustomerRepository } from '../repository'
import { generateKafkaProducer } from '../messaging'

export async function generateCreateNewCustomerUseCase() {
  const customerRepository = generateMongoCustomerRepository()
  const hashPassword = generateBcryptHashPassword()
  const messageProducer = await generateKafkaProducer(ENVS.KAFKA.TOPICS.CUSTOMER.CREATED)
  const createNewCustomerUseCase = new CreateNewCustomerUseCase(customerRepository, hashPassword, customerRepository, messageProducer)
  return createNewCustomerUseCase
}
