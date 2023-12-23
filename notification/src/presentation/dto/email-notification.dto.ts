export class EmailNotificationDTO {
  id?: string
  timestamp: number
  sourceEmail: string
  targetEmail: string
  subject: string
  body: string
  tags?: string[]
}
