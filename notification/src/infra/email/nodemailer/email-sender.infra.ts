import type nodemailer from 'nodemailer'
import { type EmailSender } from '@/application/protocol'
import { type EmailNotification } from '@/domain/entity'

export class NodemailerEmailSender implements EmailSender {
  transporter: nodemailer.Transporter

  constructor(transporter: nodemailer.Transporter) {
    this.transporter = transporter
  }

  async send(emailNotification: EmailNotification): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: emailNotification.sourceEmail,
        to: emailNotification.targetEmail,
        subject: emailNotification.subject,
        text: emailNotification.text,
        html: emailNotification.body
      })

      return true
    } catch (error) {
      return false
    }
  }
}
