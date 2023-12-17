import { type EmailNotification } from '@/domain/entity'

export interface EmailSender {
  send: (emailNotification: EmailNotification) => Promise<boolean>
}
