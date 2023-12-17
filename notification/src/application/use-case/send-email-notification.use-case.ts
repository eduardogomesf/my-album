import { EmailNotification } from '@/domain/entity/email-notification.entity'
import { type EmailSender } from '../protocol'
import { type UseCaseResponse } from '../interface'

interface SendEmailNotificationPayload {
  timestamp: number
  sourceEmail: string
  targetEmail: string
  subject: string
  body: string
  tags?: string[]
}

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

    const emailWasSent = await this.emailSender.send(emailNotificationEntity)

    return { ok: emailWasSent, message: emailWasSent ? 'Email was sent' : 'Email was not sent' }
  }
}
