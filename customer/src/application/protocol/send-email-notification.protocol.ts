export interface SendEmailNotificationPayload {
  sourceEmail: string
  targetEmail: string
  subject: string
  tags?: string[]
  body: string
}

export interface SendEmailNotification {
  send: (payload: SendEmailNotificationPayload) => Promise<void>
}
