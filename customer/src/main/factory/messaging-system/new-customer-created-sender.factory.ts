import { RabbitMQSender } from '@/infra/messaging-system/rabbitmq/sender'
import { ENVS } from '@/shared'

export const generateNewCustomerCreatedSender = () => {
  return new RabbitMQSender(
    ENVS.RABBIT_MQ.EXCHANGES.CUSTOMER_REGISTRATION.NAME,
    ENVS.RABBIT_MQ.EXCHANGES.CUSTOMER_REGISTRATION.ROUTING_KEYS.NEW_CUSTOMER_CREATED,
    { persistent: true }
  )
}
