import { RabbitMQSender } from '@/infra/messaging-system/rabbitmq/sender'
import { ENVS } from '@/shared'
import { generateMongoUnpublishedMessagesRepository } from '../repository/mongo-unpublished-messages-repository.factory'

export const generateNewCustomerCreatedSender = () => {
  const unpublishedMessagesRepository = generateMongoUnpublishedMessagesRepository()

  return new RabbitMQSender(
    ENVS.RABBIT_MQ.EXCHANGES.CUSTOMER_REGISTRATION.NAME,
    ENVS.RABBIT_MQ.EXCHANGES.CUSTOMER_REGISTRATION.ROUTING_KEYS.NEW_CUSTOMER_CREATED,
    { persistent: true },
    unpublishedMessagesRepository
  )
}
