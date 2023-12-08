import { v4 as uuid } from 'uuid'
import { type Options } from 'amqplib'

import { generateRabbitMQConnectionAndMainChannel } from './client'
import { type MessageSender } from '@/application/protocol/message-sender.protocol'
import { ENVS } from '@/shared'
import { Delay } from '@/shared/delay'
import { type MongoUnpublishedMessagesRepository } from '../../database/mongodb/unpublished-messages'

interface PublishOptions {
  persistent: boolean
}

export class RabbitMQSender implements MessageSender {
  constructor(
    private readonly exchangeName: string,
    private readonly routingKey: string = '',
    private readonly publishOptions: PublishOptions = { persistent: false },
    private readonly unpublishedMessagesRepository: MongoUnpublishedMessagesRepository
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
      messageId: messageWithId.id,
      appId: ENVS.APP.ID
    }

    try {
      console.log('Publishing message to RabbitMQ...')

      confirmChannel.publish(
        this.exchangeName,
        this.routingKey,
        Buffer.from(message),
        messageOptions
      )

      await confirmChannel.waitForConfirms()

      console.log(`Message of Id ${messageWithId.id} published to RabbitMQ`)
    } catch (error) {
      console.log('Error while sending message to RabbitMQ')
      console.log(error.message)

      await this.retry(message, messageOptions)
    }
  }

  async retry(message: string, messageOptions: Options.Publish) {
    await Delay.wait(Number(ENVS.RABBIT_MQ.DELAY_TIMEOUT))

    const { confirmChannel } = await generateRabbitMQConnectionAndMainChannel()

    const parsedMessage = JSON.parse(message)

    try {
      console.log('[Retry] - Publishing message to RabbitMQ...')

      confirmChannel.publish(
        this.exchangeName,
        this.routingKey,
        Buffer.from(message),
        messageOptions
      )

      await confirmChannel.waitForConfirms()

      console.log(`Message of Id ${parsedMessage.id} published to RabbitMQ`)
    } catch (error) {
      console.log('[Retry] - Error while sending message to RabbitMQ')
      console.log(error.message)

      await this.unpublishedMessagesRepository.save({
        id: parsedMessage.id,
        data: parsedMessage,
        options: messageOptions
      })

      console.log(`Message of Id ${parsedMessage.id} saved to MongoDB`)
    }
  }
}
