export interface SendEmailNotificationPayload {
  firstName: string
  lastName: string
  title: string
  email: string
  template: string
}

export interface SendEmailNotification {
  send: (payload: SendEmailNotificationPayload) => Promise<void>
}
