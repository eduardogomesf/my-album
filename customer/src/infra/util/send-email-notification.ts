import { type SendEmailNotificationPayload, type MessageSender, type SendEmailNotification } from '@/application/protocol'

export class SendEmailNotificationUtil implements SendEmailNotification {
  constructor(
    private readonly sendEmailNotification: MessageSender
  ) {}

  async send(payload: SendEmailNotificationPayload) {
    await this.sendEmailNotification.send(payload)
  }
}
