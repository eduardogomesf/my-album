import { Logger } from '@/shared'
import { UnpublishedMessageModel } from './entity'
import {
  type DeleteUnpublishedMessageRepository,
  type UpdateUnpublishedMessageRepository,
  type GetPendingUnpublishedMessagesRepository
} from '@/use-case/protocol'
import { UnpublishedMessage } from '@/entity'

const logger = new Logger('MongoUnpublishedMessagesRepository')

export class MongoUnpublishedMessagesRepository implements
  GetPendingUnpublishedMessagesRepository, DeleteUnpublishedMessageRepository, UpdateUnpublishedMessageRepository {
  async findAllPending(): Promise<UnpublishedMessage[]> {
    try {
      const raw = await UnpublishedMessageModel.find({
        hasError: false
      })
      return raw.map((message) => (new UnpublishedMessage({
        id: message._id.toString(),
        data: message.data,
        options: message.options,
        error: message.error ?? '',
        hasError: message.hasError ?? false,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt
      })))
    } catch (error) {
      logger.error('Error finding unpublished messages')
      logger.error(error)
      throw error
    }
  }

  async update(message: UnpublishedMessage): Promise<void> {
    try {
      await UnpublishedMessageModel.updateOne(
        { _id: message.id },
        message
      )
    } catch (error) {
      logger.error('Error updating message')
      logger.error(error)
      throw error
    }
  }

  async delete (id: string): Promise<void> {
    try {
      await UnpublishedMessageModel.deleteOne({ _id: id })
    } catch (error) {
      logger.error('Error finding deleting messages')
      logger.error(error)
      throw error
    }
  }
}
