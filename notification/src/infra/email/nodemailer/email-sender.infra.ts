import type nodemailer from 'nodemailer'
import { type EmailSenderResponse, type EmailSender } from '@/application/protocol'
import { type EmailNotification } from '@/domain/entity'
import { Logger } from '@/shared'

export class NodemailerEmailSender implements EmailSender {
  transporter: nodemailer.Transporter

  constructor(transporter: nodemailer.Transporter) {
    this.transporter = transporter
  }

  async send(emailNotification: EmailNotification): Promise<EmailSenderResponse> {
    try {
      Logger.info('Sending email...')

      await this.transporter.sendMail({
        from: emailNotification.sourceEmail,
        to: emailNotification.targetEmail,
        subject: emailNotification.subject,
        text: emailNotification.text,
        html: emailNotification.body
      })

      Logger.info('Email sent')

      return { ok: true }
    } catch (error) {
      Logger.error(error.message)
      return { ok: false, message: error.message }
    }
  }
}
