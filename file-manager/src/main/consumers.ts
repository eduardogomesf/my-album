import { Logger } from '../shared'
import { generateAddNewUserConsumer } from './factory/consumer'

const logger = new Logger('Consumers')

export const startConsumers = async () => {
  logger.info('Starting consumers...')

  const addNewUserConsumer = await generateAddNewUserConsumer()
  await addNewUserConsumer.start()

  logger.info('Consumers started')
}
