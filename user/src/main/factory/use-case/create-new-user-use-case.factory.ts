import { CreateNewUserUseCase } from '@/application/use-case'
import { ENVS } from '@/shared'
import { generateBcryptHashPassword, generateSendEmailNotificationUtil } from '../util'
import { generateMongoUserRepository } from '../repository'
import { generateKafkaProducer } from '../messaging'

export async function generateCreateNewUserUseCase() {
  const userRepository = generateMongoUserRepository()
  const hashPassword = generateBcryptHashPassword()
  const newUserCreatedSender = await generateKafkaProducer(ENVS.KAFKA.TOPICS.CUSTOMER.CREATED)
  const sendWelcomeNotification = await generateSendEmailNotificationUtil()
  const createNewUserUseCase = new CreateNewUserUseCase(
    userRepository,
    hashPassword,
    userRepository,
    newUserCreatedSender,
    sendWelcomeNotification
  )
  return createNewUserUseCase
}
