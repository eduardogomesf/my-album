export interface MessageConsumer {
  start(): Promise<void>
}