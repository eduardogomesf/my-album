import { type ReprocessUnpublishedMessages } from '@/use-case'
import { generateKafkaProducer } from '../factory/messaging'
import { generateMongoUnpublishedMessagesRepository } from '../factory/repository'
import { generateReprocessUnpublishedMessagesUseCase } from '../factory/use-case'

export interface UseCases {
  reprocessUnpublishedMessagesUseCase: ReprocessUnpublishedMessages
}

export const getApplicationUseCases = async (): Promise<UseCases> => {
  // Repositories
  const unpublishedMessagesRepository = generateMongoUnpublishedMessagesRepository()

  // Message senders
  const kafkaProducer = await generateKafkaProducer()

  // Use cases
  const reprocessUnpublishedMessagesUseCase = generateReprocessUnpublishedMessagesUseCase(
    unpublishedMessagesRepository,
    kafkaProducer,
    unpublishedMessagesRepository,
    unpublishedMessagesRepository
  )

  return {
    reprocessUnpublishedMessagesUseCase
  }
}
