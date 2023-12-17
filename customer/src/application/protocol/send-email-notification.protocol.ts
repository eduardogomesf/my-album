export interface SendEmailNotificationPayload {
  sourceEmail: '001' | '002' | '003'
  targetEmail: string
  subject: string
  tags?: string[]
  body: string
}

export interface SendEmailNotification {
  send: (payload: SendEmailNotificationPayload) => Promise<void>
}
