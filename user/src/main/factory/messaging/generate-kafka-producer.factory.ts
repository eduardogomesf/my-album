import { generateKafkaClient, createNewKafkaProducer, KafkaProducer } from '@/infra/messaging/kafka'
import { type MongoUnpublishedMessagesRepository } from '@/infra/database/mongodb'

export async function generateKafkaProducer(
  topicName: string,
  unpublishedMessagesRepository: MongoUnpublishedMessagesRepository
) {
  const kafkaClient = generateKafkaClient()
  const kafkaProducer = await createNewKafkaProducer(kafkaClient)

  return new KafkaProducer(
    { client: kafkaClient, producer: kafkaProducer },
    unpublishedMessagesRepository,
    topicName
  )
}
