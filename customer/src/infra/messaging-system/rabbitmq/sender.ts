import { type MessageSender } from '../../../application/protocol/message-sender.protocol'
import { generateRabbitMQConnectionAndMainChannel } from './client'

interface AssertQueueOptions {
  durable: boolean
}

interface PublishOptions {
  persistent: boolean
}

export class RabbitMQSender implements MessageSender {
  constructor(
    private readonly queueName: string,
    private readonly assertQueueOptions: AssertQueueOptions = { durable: false },
    private readonly publishOptions: PublishOptions = { persistent: false }
  ) {
  }

  async send(message: string): Promise<boolean> {
    const { channel } = await generateRabbitMQConnectionAndMainChannel()

    await channel.assertQueue(this.queueName, {
      durable: this.assertQueueOptions.durable
    })

    return channel.sendToQueue(this.queueName, Buffer.from(message), {
      persistent: this.publishOptions.persistent
    })
  }
}
