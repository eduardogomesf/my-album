import { ENVS } from '@/shared'
import { SendEmailNotificationUtil } from '@/infra/util'
import { generateKafkaProducer } from '../messaging'
import { type MongoUnpublishedMessagesRepository } from '@/infra/database/mongodb'

export const generateSendEmailNotificationUtil = async (
  unpublishedMessagesRepository: MongoUnpublishedMessagesRepository,
  emailTopic: string = ENVS.KAFKA.TOPICS.NOTIFICATIONS.EMAIL
) => {
  const sendEmailNotification = await generateKafkaProducer(
    emailTopic,
    unpublishedMessagesRepository
  )
  return new SendEmailNotificationUtil(sendEmailNotification)
}
