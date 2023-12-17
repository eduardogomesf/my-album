import { type Producer, type Kafka } from 'kafkajs'

export interface KafkaResources {
  producer: Producer
  client: Kafka
}
