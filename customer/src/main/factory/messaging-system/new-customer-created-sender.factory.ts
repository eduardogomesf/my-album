import { RabbitMQSender } from '../../../infra/messaging-system/rabbitmq/sender'
import { ENVS } from '../../../shared'

export const generateNewCustomerCreatedSender = () => {
  return new RabbitMQSender(
    ENVS.RABBIT_MQ.QUEUES.NEW_CUSTOMER_CREATED.NAME,
    { durable: true },
    { persistent: true }
  )
}
