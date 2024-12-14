import { type Consumer, type Kafka } from 'kafkajs'

export interface ConsumerOptions {
  consumerGroup: string
  subscribeOptions: {
    topic: string
    fromBeginning: boolean
  }
}

export async function createNewKafkaConsumer(
  client: Kafka,
  consumerOptions: ConsumerOptions,
): Promise<Consumer> {
  const consumer = client.consumer({ groupId: consumerOptions.consumerGroup })
  await consumer.connect()
  await consumer.subscribe({
    topic: consumerOptions.subscribeOptions.topic,
    fromBeginning: consumerOptions.subscribeOptions.fromBeginning,
  })
  return consumer
}
