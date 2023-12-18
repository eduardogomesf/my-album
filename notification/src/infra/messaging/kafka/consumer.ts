import { type Consumer, type Kafka } from 'kafkajs'

export async function createNewKafkaConsumer(client: Kafka, consumerGroup: string): Promise<Consumer> {
  const consumer = client.consumer({ groupId: consumerGroup })
  await consumer.connect()
  return consumer
}
