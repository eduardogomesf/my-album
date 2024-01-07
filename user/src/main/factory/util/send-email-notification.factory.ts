import { ENVS } from '@/shared'
import { SendEmailNotificationUtil } from '@/infra/util'
import { generateKafkaProducer } from '../messaging'

export const generateSendEmailNotificationUtil = async () => {
  const sendEmailNotification = await generateKafkaProducer(ENVS.KAFKA.TOPICS.NOTIFICATIONS.EMAIL)
  return new SendEmailNotificationUtil(sendEmailNotification)
}
