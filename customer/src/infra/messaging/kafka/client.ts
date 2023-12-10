import { Kafka } from 'kafkajs'
import { ENVS } from '../../../shared'

let kafkaClient: Kafka = null as any

export async function generateKafkaClient(): Promise<Kafka> {
  if (kafkaClient) {
    console.log('Kafka client already exists')

    return kafkaClient
  }

  console.log('Creating Kafka client...')

  kafkaClient = new Kafka({
    clientId: ENVS.APP.ID,
    brokers: [...ENVS.KAFKA.BROKERS_URL],
    connectionTimeout: 5000,
    retry: {
      initialRetryTime: 300,
      retries: 8
    }
  })

  console.log('Kafka client created!')

  return kafkaClient
}
