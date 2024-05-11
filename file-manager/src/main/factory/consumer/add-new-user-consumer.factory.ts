import { generateKafkaClient, createNewKafkaConsumer } from '@/infra/messaging/kafka'
import { AddNewUserEventConsumer } from '@/presentation/consumer'
import { ENVS } from '@/shared'
import { generateAddNewUserUseCase } from '../use-case'
import { generateUserRepository } from '../repository'

export const generateAddNewUserConsumer = async (): Promise<AddNewUserEventConsumer> => {
  const kafkaClient = generateKafkaClient()
  const kafkaConsumer = await createNewKafkaConsumer(kafkaClient, {
    consumerGroup: ENVS.KAFKA.CONSUMER_GROUPS.USER.NEW_USER,
    subscribeOptions: {
      topic: ENVS.KAFKA.TOPICS.USER.CREATED,
      fromBeginning: true
    }
  })
  const userRepository = generateUserRepository()
  const addNewUserUseCase = generateAddNewUserUseCase(userRepository, userRepository)
  const addNewUserEventConsumer = new AddNewUserEventConsumer(addNewUserUseCase, kafkaConsumer)
  return addNewUserEventConsumer
}
