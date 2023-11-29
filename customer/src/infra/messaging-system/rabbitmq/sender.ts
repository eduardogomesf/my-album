import { v4 as uuid } from 'uuid'

import { type MessageSender } from '../../../application/protocol/message-sender.protocol'
import { generateRabbitMQConnectionAndMainChannel } from './client'
import { type Options } from 'amqplib'

interface PublishOptions {
  persistent: boolean
}

export class RabbitMQSender implements MessageSender {
  constructor(
    private readonly exchangeName: string,
    private readonly routingKey: string = '',
    private readonly publishOptions: PublishOptions = { persistent: false }
  ) {
  }

  async send(rawMessage: Record<string, any>): Promise<void> {
    const { confirmChannel } = await generateRabbitMQConnectionAndMainChannel()

    const messageWithId = {
      ...rawMessage,
      id: rawMessage.id || uuid()
    }

    const message = JSON.stringify(messageWithId)

    const messageOptions: Options.Publish = {
      persistent: this.publishOptions.persistent,
      timestamp: Date.now(),
      messageId: messageWithId.id
    }

    try {
      console.log('Publishing message to RabbitMQ...')
      confirmChannel.publish(
        this.exchangeName,
        this.routingKey,
        Buffer.from(message),
        messageOptions,
        (error, ok) => {
          if (error) {
            console.log('HUH')
            throw error
          }
        }
      )

      await confirmChannel.waitForConfirms()

      console.log(`Message of Id ${messageWithId.id} published to RabbitMQ`)
    } catch (error) {
      console.log('Error while sending message to RabbitMQ')
      console.log(error)
    }
  }
}
