import { type Channel } from 'amqplib'
import { type MessageSender } from '../../../application/protocol/message-sender.protocol'

interface AssertQueueOptions {
  durable: boolean
}

interface PublishOptions {
  persistent: boolean
}

export class RabbitMQSender implements MessageSender {
  constructor(
    private readonly channel: Channel,
    private readonly queueName: string,
    private readonly assertQueueOptions: AssertQueueOptions = { durable: false },
    private readonly publishOptions: PublishOptions = { persistent: false }
  ) {

  }

  async send(message: string): Promise<boolean> {
    await this.channel.assertQueue(this.queueName, {
      durable: this.assertQueueOptions.durable
    })

    return this.channel.sendToQueue(this.queueName, Buffer.from(message), {
      persistent: this.publishOptions.persistent
    })
  }
}
