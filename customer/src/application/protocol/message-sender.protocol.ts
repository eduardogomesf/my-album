export interface MessageSender {
  send: (message: any) => Promise<boolean>
}
