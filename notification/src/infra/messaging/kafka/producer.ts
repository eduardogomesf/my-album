import { type Producer, type Kafka } from 'kafkajs'

export async function createNewKafkaProducer(client: Kafka): Promise<Producer> {
  const producer = client.producer()
  await producer.connect()
  return producer
}
