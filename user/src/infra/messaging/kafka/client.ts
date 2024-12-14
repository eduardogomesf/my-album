import { Kafka } from 'kafkajs'
import { ENVS, Logger } from '@/shared'

let kafkaClient: Kafka = null as any

const logger = new Logger('generateKafkaClient')

export function generateKafkaClient(): Kafka {
  if (kafkaClient) {
    logger.info('Kafka client already exists')

    return kafkaClient
  }

  logger.info('Creating Kafka client...')

  kafkaClient = new Kafka({
    clientId: ENVS.APP.ID,
    brokers: [...ENVS.KAFKA.BROKERS_URL],
    connectionTimeout: 5000,
    retry: {
      initialRetryTime: 300,
      retries: 8,
    },
  })

  logger.info('Kafka client created!')

  return kafkaClient
}
