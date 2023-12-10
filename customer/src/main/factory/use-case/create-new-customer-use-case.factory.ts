import { CreateNewCustomerUseCase } from '@/application/use-case'
import { ENVS } from '@/shared'
import { generateBcryptHashPassword } from '../util'
import { generateMongoCustomerRepository } from '../repository'
import { generateKafkaProducer } from '../messaging'

export async function generateCreateNewCustomerUseCase() {
  const customerRepository = generateMongoCustomerRepository()
  const hashPassword = generateBcryptHashPassword()
  const newCustomerCreatedSender = await generateKafkaProducer(ENVS.KAFKA.TOPICS.CUSTOMER.CREATED)
  const sendWelcomeNotification = await generateKafkaProducer(ENVS.KAFKA.TOPICS.NOTIFICATIONS.CUSTOMER.WELCOME)
  const createNewCustomerUseCase = new CreateNewCustomerUseCase(
    customerRepository,
    hashPassword,
    customerRepository,
    newCustomerCreatedSender,
    sendWelcomeNotification
  )
  return createNewCustomerUseCase
}
