import { Logger } from '@/shared'

export class Subscriber {
  private readonly logger: Logger
  public readonly name: string
  public readonly fn: any

  constructor(name: string, fn: any) {
    this.name = name

    this.name = name ?? 'UnknownSubscriber'

    if (!fn) {
      this.logger.error('Invalid subscriber creation')
      return
    }

    this.fn = fn
  }

  public update(...data: any[]) {
    this.fn(data)
  }
}

export abstract class Publisher {
  private readonly name: string
  private readonly logger: Logger
  private readonly subscribers: Subscriber[] = []

  constructor(name: string) {
    this.name = name ?? 'UnknownPublisher'
    this.logger = new Logger(this.name)
  }

  public addSubscriber(subscriber: Subscriber) {
    if (!subscriber) {
      this.logger.error('Invalid subscription attempt')
      return
    }

    this.subscribers.push(subscriber)
  }

  public removeSubscriber(subscriberName: string) {
    this.subscribers.filter(sub => sub.name !== subscriberName)
  }

  public notifySubscribers(...data: any[]) {
    for (const sub of this.subscribers) {
      sub.update(data)
    }
  }
}
