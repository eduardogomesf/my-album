import { type Injections } from '../protocol/injections.protocol'
import { EmailNotificationEventConsumer } from './email-notification.consumer'

export const setupConsumers = (dependencies: Injections) => {
  const consumers = [
    new EmailNotificationEventConsumer(
      dependencies.sendEmailNotificationUseCase,
      dependencies.kafkaConsumer
    )
  ]

  return {
    start: async () => {
      await Promise.all(consumers.map(async consumer => { await consumer.start() }))
    }
  }
}
