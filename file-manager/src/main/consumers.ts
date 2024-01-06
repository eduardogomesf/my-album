import { Logger } from '../shared'
import { generateAddNewCustomerConsumer } from './factory/consumer'

const logger = new Logger('Consumers')

export const startConsumers = async () => {
  logger.info('Starting consumers...')

  const addNewCustomerConsumer = await generateAddNewCustomerConsumer()
  await addNewCustomerConsumer.start()

  logger.info('Consumers started')
}
