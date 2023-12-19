import nodemailer from 'nodemailer'
import { NodemailerEmailSender } from '@/infra/email/nodemailer'
import { type EmailSender } from '@/application/protocol'

export interface NodemailerOptions {
  host: string
  port: number
  secure: boolean
}

export const generateNodemailerEmailSender = (options: NodemailerOptions): EmailSender => {
  const transporter = nodemailer.createTransport({
    host: options.host,
    port: options.port,
    secure: options.secure ?? false
  })
  const nodemailerEmailSender = new NodemailerEmailSender(transporter)
  return nodemailerEmailSender
}
