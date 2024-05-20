import { v4 as uuid } from 'uuid'

import { type KafkaResources } from './resources'
import { type MessageSender } from '@/use-case/protocol'
import { Logger } from '@/shared'

const logger = new Logger('KafkaProducer')

interface SendOptions {
  topic: string
}
export class KafkaProducer implements MessageSender {
  constructor(
    private readonly kafkaResources: KafkaResources
  ) {
  }

  async send(
    rawMessage: Record<string, any>,
    options: SendOptions
  ): Promise<boolean> {
    const { producer } = this.kafkaResources

    const timestamp = Date.now()

    const messageWithId = {
      ...rawMessage,
      id: rawMessage.id || uuid(),
      timestamp
    }

    try {
      const message = JSON.stringify(messageWithId)

      logger.info(`Publishing message with id ${messageWithId.id} to topic ${options.topic} ...`)

      await producer.send({
        topic: options.topic,
        messages: [
          {
            value: message,
            timestamp: String(timestamp)
          }
        ]
      })

      logger.info(`Message of id ${messageWithId.id} published to Kafka topic ${options.topic}`)
      return true
    } catch (error) {
      logger.warn(`Error while sending message to Kafka topic ${options.topic}}`)
      logger.warn(error.message)
      return false
    }
  }
}
