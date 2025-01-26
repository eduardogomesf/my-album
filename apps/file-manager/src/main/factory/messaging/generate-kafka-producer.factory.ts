import {
  generateKafkaClient,
  createNewKafkaProducer,
  KafkaProducer,
} from '@/infra/messaging/kafka'

export async function generateKafkaProducer(topicName: string) {
  const kafkaClient = generateKafkaClient()
  const kafkaProducer = await createNewKafkaProducer(kafkaClient)

  return new KafkaProducer(
    { client: kafkaClient, producer: kafkaProducer },
    topicName,
  )
}
