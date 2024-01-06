import { type Injections } from '../protocol/injections.protocol'
import { EmailNotificationEventConsumer } from './add-new-customer.consumer'

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
