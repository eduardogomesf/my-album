import { v4 as uuid } from 'uuid'

import { type KafkaResources } from './resources'
import { type MessageSender } from '@/application/protocol/message-sender.protocol'
import { type MongoUnpublishedMessagesRepository } from '../../database/mongodb/unpublished-messages'

export class KafkaProducer implements MessageSender {
  constructor(
    private readonly kafkaResources: KafkaResources,
    private readonly unpublishedMessagesRepository: MongoUnpublishedMessagesRepository,
    private readonly topic: string
  ) {
  }

  async send(rawMessage: Record<string, any>): Promise<void> {
    const { producer } = this.kafkaResources

    const timestamp = Date.now()

    const messageWithId = {
      ...rawMessage,
      id: rawMessage.id || uuid(),
      timestamp
    }

    try {
      const message = JSON.stringify(messageWithId)

      console.log(`Publishing message to Kafka topic ${this.topic} ...`)

      await producer.send({
        topic: this.topic,
        messages: [
          {
            value: message,
            timestamp: String(timestamp)
          }
        ]
      })

      console.log(`Message of Id ${messageWithId.id} published to Kafka topic ${this.topic}`)
    } catch (error) {
      console.log(`Error while sending message to Kafka topic ${this.topic}}`)
      console.log(error.message)

      await this.unpublishedMessagesRepository.save({
        id: messageWithId.id,
        data: messageWithId,
        options: messageWithId
      })

      console.log(`Message of Id ${messageWithId.id} saved to MongoDB`)
    }
  }
}