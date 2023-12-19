import { ENVS } from '@/shared'
import { SendEmailNotificationUseCase } from '@/application/use-case'
import { generateNodemailerEmailSender } from '../email'

export const generateSendEmailNotificationUseCase = async () => {
  const emailSender = generateNodemailerEmailSender({
    host: ENVS.SMTP.DEFAULT.EMAIL_HOST,
    port: ENVS.SMTP.DEFAULT.EMAIL_PORT,
    secure: ENVS.SMTP.DEFAULT.EMAIL_SECURE === 'true'
  })
  const sendEmailNotificationUseCase = new SendEmailNotificationUseCase(emailSender)
  return sendEmailNotificationUseCase
}
