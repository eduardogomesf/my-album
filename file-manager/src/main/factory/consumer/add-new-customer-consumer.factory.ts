import { generateKafkaClient, createNewKafkaConsumer } from '@/infra/messaging/kafka'
import { AddNewCustomerEventConsumer } from '@/presentation/consumer'
import { ENVS } from '@/shared'
import { generateAddNewCustomerUseCase } from '../use-case'
import { generateCustomerRepository } from '../repository'

export const generateAddNewCustomerConsumer = async (): Promise<AddNewCustomerEventConsumer> => {
  const kafkaClient = generateKafkaClient()
  const kafkaConsumer = await createNewKafkaConsumer(kafkaClient, {
    consumerGroup: ENVS.KAFKA.CONSUMER_GROUPS.CUSTOMER.NEW_CUSTOMER,
    subscribeOptions: {
      topic: ENVS.KAFKA.TOPICS.CUSTOMER.CREATED,
      fromBeginning: false
    }
  })
  const customerRepository = generateCustomerRepository()
  const addNewCustomerUseCase = generateAddNewCustomerUseCase(customerRepository, customerRepository)
  const addNewCustomerEventConsumer = new AddNewCustomerEventConsumer(addNewCustomerUseCase, kafkaConsumer)
  return addNewCustomerEventConsumer
}
