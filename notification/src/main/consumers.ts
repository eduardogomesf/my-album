import { Logger } from '../shared'
import { generateEmailNotificationConsumer } from './factory/consumer'

const logger = new Logger('Consumers')

export const startConsumers = async () => {
  logger.info('Starting consumers...')

  const emailNotificationConsumer = await generateEmailNotificationConsumer()
  await emailNotificationConsumer.start()

  logger.info('Consumers started')
}
