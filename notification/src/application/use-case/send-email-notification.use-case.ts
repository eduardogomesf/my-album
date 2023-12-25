import { EmailNotification } from '@/domain/entity/email-notification.entity'
import { type EmailSender } from '../protocol'
import { type UseCaseResponse } from '../interface'
import { ENVS, Logger } from '@/shared'

interface SendEmailNotificationPayload {
  timestamp: number
  sourceEmail: string
  targetEmail: string
  subject: string
  body: string
  tags?: string[]
}

const logger = new Logger('SendEmailNotificationUseCase')

export class SendEmailNotificationUseCase {
  constructor(
    private readonly emailSender: EmailSender
  ) {}

  async send(
    emailNotification: SendEmailNotificationPayload
  ): Promise<UseCaseResponse> {
    let emailNotificationEntity: EmailNotification

    try {
      emailNotificationEntity = new EmailNotification(emailNotification)
    } catch (error) {
      return { ok: false, message: error.message }
    }

    const sourceEmail = ENVS.SMTP.SOURCE_EMAILS.find(email => email === emailNotification.sourceEmail)

    if (!sourceEmail) {
      logger.info(`Email ${emailNotification.sourceEmail} is not allowed to send emails`)
      return { ok: false, message: `Email ${emailNotification.sourceEmail} is not allowed to send emails` }
    }

    const emailWasSent = await this.emailSender.send(emailNotificationEntity)

    return { ok: emailWasSent.ok, message: emailWasSent.message }
  }
}
