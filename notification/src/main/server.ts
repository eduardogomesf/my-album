import { generateKafkaClient } from '../infra/messaging/kafka'
import { Logger } from '@/shared'
import { startConsumers } from './consumers'

export async function bootstrap() {
  Logger.info('Starting application')

  generateKafkaClient()

  await startConsumers()
}

bootstrap().catch(error => {
  Logger.fatal('Error bootstrapping application')
  Logger.fatal(error)
  process.exit(1)
})
