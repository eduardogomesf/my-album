import { Logger } from '@/shared'
import { UseCases } from '@/presentation/interface/injections'
import { MessageConsumer } from '@/presentation/interface/message-consumer'
import { generateAddNewUserConsumer, generateDeleteFilesFromStorageConsumer } from '../factory/consumer'

const logger = new Logger('Consumers')

export const startConsumers = async (useCases: UseCases) => {
  logger.info('Starting consumers...')

  const addNewUserConsumer = await generateAddNewUserConsumer(useCases)
  const deleteFilesFromStorageConsumer = await generateDeleteFilesFromStorageConsumer(useCases)
  
  const consumers: MessageConsumer[] = [
    addNewUserConsumer,
    deleteFilesFromStorageConsumer
  ]

  await Promise.all(consumers.map(async consumer => { await consumer.start() }))

  logger.info('Consumers started')
}