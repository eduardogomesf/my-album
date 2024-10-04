import { generateKafkaClient, createNewKafkaConsumer } from '@/infra/messaging/kafka'
import { AddNewUserEventConsumer } from '@/presentation/consumer'
import { ENVS } from '@/shared'
import { UseCases } from '@/presentation/interface/injections'

export const generateAddNewUserConsumer = async (useCases: UseCases): Promise<AddNewUserEventConsumer> => {
  const kafkaClient = generateKafkaClient()
  const kafkaConsumer = await createNewKafkaConsumer(kafkaClient, {
    consumerGroup: ENVS.KAFKA.CONSUMER_GROUPS.USER.NEW_USER,
    subscribeOptions: {
      topic: ENVS.KAFKA.TOPICS.USER.CREATED,
      fromBeginning: true
    }
  })
  const addNewUserEventConsumer = new AddNewUserEventConsumer(useCases.addNewUserUseCase, kafkaConsumer)
  return addNewUserEventConsumer
}
