import { generateKafkaClient, createNewKafkaProducer, KafkaProducer } from '@/infra/messaging/kafka'
import { MongoUnpublishedMessagesRepository } from '@/infra/database/mongodb'

export async function generateKafkaProducer(topicName: string) {
  const kafkaClient = generateKafkaClient()
  const kafkaProducer = await createNewKafkaProducer(kafkaClient)

  const unpublishedMessagesRepository = new MongoUnpublishedMessagesRepository()

  return new KafkaProducer(
    { client: kafkaClient, producer: kafkaProducer },
    unpublishedMessagesRepository,
    topicName
  )
}
