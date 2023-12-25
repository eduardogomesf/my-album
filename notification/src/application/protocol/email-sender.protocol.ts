import { type EmailNotification } from '@/domain/entity'

export interface EmailSenderResponse {
  ok: boolean
  message?: string
}

export interface EmailSender {
  send: (emailNotification: EmailNotification) => Promise<EmailSenderResponse>
}
