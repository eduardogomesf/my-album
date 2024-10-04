import { type Producer, type Kafka, type Consumer } from 'kafkajs'

export interface KafkaResources {
  producer?: Producer
  client: Kafka
  consumer?: Consumer
}
