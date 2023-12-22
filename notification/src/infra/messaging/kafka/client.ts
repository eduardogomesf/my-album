import { Kafka } from 'kafkajs'
import { ENVS, Logger } from '../../../shared'

let kafkaClient: Kafka = null as any

export function generateKafkaClient(): Kafka {
  if (kafkaClient) {
    Logger.info('Kafka client already exists')

    return kafkaClient
  }

  Logger.info('Creating Kafka client...')

  kafkaClient = new Kafka({
    clientId: ENVS.APP.ID,
    brokers: [...ENVS.KAFKA.BROKERS_URL],
    connectionTimeout: 5000,
    retry: {
      initialRetryTime: 300,
      retries: 8
    }
  })

  Logger.info('Kafka client created!')

  return kafkaClient
}
