export interface MessageSender<T = any> {
  send: (message: Record<string, T>) => Promise<void>
}
