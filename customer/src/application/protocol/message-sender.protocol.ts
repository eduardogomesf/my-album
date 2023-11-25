export interface MessageSender {
  send: (message: Record<string, any>) => Promise<void>
}
