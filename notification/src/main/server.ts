import { generateKafkaClient } from '../infra/messaging/kafka'
import { Logger } from '@/shared'

export async function bootstrap() {
  Logger.info('Starting application')

  await generateKafkaClient()
}

bootstrap().catch(error => {
  Logger.fatal('Error bootstrapping application')
  Logger.fatal(error)
  process.exit(1)
})
