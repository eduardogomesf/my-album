import type nodemailer from 'nodemailer'
import { type EmailSenderResponse, type EmailSender } from '@/application/protocol'
import { type EmailNotification } from '@/domain/entity'
import { Logger } from '@/shared'

const logger = new Logger('NodemailerEmailSender')

export class NodemailerEmailSender implements EmailSender {
  transporter: nodemailer.Transporter

  constructor(transporter: nodemailer.Transporter) {
    this.transporter = transporter
  }

  async send(emailNotification: EmailNotification): Promise<EmailSenderResponse> {
    try {
      logger.info('Sending email...')

      await this.transporter.sendMail({
        from: emailNotification.sourceEmail,
        to: emailNotification.targetEmail,
        subject: emailNotification.subject,
        text: emailNotification.text,
        html: emailNotification.body
      })

      logger.info('Email sent')

      return { ok: true }
    } catch (error) {
      logger.error(error.message)
      return { ok: false, message: error.message }
    }
  }
}
