import { MongoUnpublishedMessagesRepository } from '@/infra/database/mongodb/unpublished-messages'

export function generateMongoUnpublishedMessagesRepository() {
  return new MongoUnpublishedMessagesRepository()
}
