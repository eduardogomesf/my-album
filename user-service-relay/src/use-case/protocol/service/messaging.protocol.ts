export interface MessageSender {
  send: (message: Record<string, any>, options: Record<string, any>) => Promise<boolean>
}
