import { generateKafkaClient, createNewKafkaConsumer } from '@/infra/messaging/kafka'
import { ENVS } from '@/shared'
import { DeleteFilesFromStorageEventConsumer } from '@/presentation/consumer'
import { UseCases } from '@/presentation/interface/injections'

export const generateDeleteFilesFromStorageConsumer = async (dependencies: UseCases): Promise<DeleteFilesFromStorageEventConsumer> => {
  const kafkaClient = generateKafkaClient()
  const kafkaConsumer = await createNewKafkaConsumer(kafkaClient, {
    consumerGroup: ENVS.KAFKA.CONSUMER_GROUPS.FILE.DELETE_MANY,
    subscribeOptions: {
      topic: ENVS.KAFKA.TOPICS.FILE.DELETE_MANY,
      fromBeginning: true
    }
  })
  const deleteFilesFromStorageEventConsumer = new DeleteFilesFromStorageEventConsumer(
    dependencies.deleteFilesFromStorageUseCase, kafkaConsumer
  )
  return deleteFilesFromStorageEventConsumer
}
