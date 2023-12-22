import { generateKafkaClient, createNewKafkaConsumer } from '@/infra/messaging/kafka'
import { EmailNotificationEventConsumer } from '@/presentation/consumer'
import { ENVS } from '@/shared'
import { generateSendEmailNotificationUseCase } from '../use-case'

export const generateEmailNotificationConsumer = async (): Promise<EmailNotificationEventConsumer> => {
  const kafkaClient = generateKafkaClient()
  const kafkaConsumer = await createNewKafkaConsumer(kafkaClient, {
    consumerGroup: ENVS.KAFKA.CONSUMER_GROUPS.NOTIFICATIONS.EMAIL,
    subscribeOptions: {
      topic: ENVS.KAFKA.TOPICS.NOTIFICATIONS.EMAIL,
      fromBeginning: false
    }
  })
  const sendEmailNotificationUseCase = generateSendEmailNotificationUseCase()
  const emailNotificationEventConsumer = new EmailNotificationEventConsumer(sendEmailNotificationUseCase, kafkaConsumer)
  return emailNotificationEventConsumer
}
