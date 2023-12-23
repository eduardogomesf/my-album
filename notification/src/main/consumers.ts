import { Logger } from '../shared'
import { generateEmailNotificationConsumer } from './factory/consumer'

export const startConsumers = async () => {
  Logger.info('Starting consumers...')

  const emailNotificationConsumer = await generateEmailNotificationConsumer()
  await emailNotificationConsumer.start()

  Logger.info('Consumers started')
}
