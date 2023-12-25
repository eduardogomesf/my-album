import { generateKafkaClient } from '../infra/messaging/kafka'
import { Logger } from '@/shared'
import { startConsumers } from './consumers'

const logger = new Logger('bootstrap')

export async function bootstrap() {
  logger.info('Starting application')

  generateKafkaClient()

  await startConsumers()
}

bootstrap().catch(error => {
  logger.fatal('Error bootstrapping application')
  logger.fatal(error)
  process.exit(1)
})
