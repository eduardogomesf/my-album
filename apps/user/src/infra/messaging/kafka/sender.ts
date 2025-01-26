import { v4 as uuid } from 'uuid'

import { type KafkaResources } from './resources'
import { type MessageSender } from '@/application/protocol'
import { type MongoUnpublishedMessagesRepository } from '../../database/mongodb/unpublished-messages'
import { Logger } from '@/shared'

const logger = new Logger('KafkaProducer')

export class KafkaProducer implements MessageSender {
  constructor(
    private readonly kafkaResources: KafkaResources,
    private readonly unpublishedMessagesRepository: MongoUnpublishedMessagesRepository,
    private readonly topic: string,
  ) {}

  async send(rawMessage: Record<string, any>): Promise<void> {
    const { producer } = this.kafkaResources

    const timestamp = Date.now()

    const messageWithId = {
      ...rawMessage,
      id: rawMessage.id || uuid(),
      timestamp,
    }

    try {
      const message = JSON.stringify(messageWithId)

      logger.info(
        `Publishing message with id ${messageWithId.id} to topic ${this.topic} ...`,
      )

      await producer.send({
        topic: this.topic,
        messages: [
          {
            value: message,
            timestamp: String(timestamp),
          },
        ],
      })

      logger.info(
        `Message of id ${messageWithId.id} published to Kafka topic ${this.topic}`,
      )
    } catch (error) {
      logger.warn(`Error while sending message to Kafka topic ${this.topic}}`)
      logger.warn(error.message)

      await this.unpublishedMessagesRepository.save({
        id: messageWithId.id,
        data: messageWithId,
        options: {
          topic: this.topic,
        },
      })

      logger.warn(`Message of Id ${messageWithId.id} saved to MongoDB`)
    }
  }
}
