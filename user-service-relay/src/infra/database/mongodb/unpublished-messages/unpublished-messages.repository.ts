import { Types } from 'mongoose'
import { Logger } from '@/shared'
import { UnpublishedMessageModel } from './unpublished-messages.entity'
import {
  type DeleteUnpublishedMessageRepository,
  type UpdateUnpublishedMessageRepository,
  type GetPendingUnpublishedMessagesRepository
} from '@/use-case/protocol'
import { type UnpublishedMessage } from '@/entity'

const logger = new Logger('MongoUnpublishedMessagesRepository')

export class MongoUnpublishedMessagesRepository implements
  GetPendingUnpublishedMessagesRepository, DeleteUnpublishedMessageRepository, UpdateUnpublishedMessageRepository {
  async findAllPending(): Promise<UnpublishedMessage[]> {
    try {
      return await UnpublishedMessageModel.find({
        hasError: false
      })
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
      logger.error('Error finding updating messages')
      logger.error(error)
      throw error
    }
  }

  async delete (id: string): Promise<void> {
    try {
      await UnpublishedMessageModel.deleteOne({ _id: new Types.ObjectId(id) })
    } catch (error) {
      logger.error('Error finding deleting messages')
      logger.error(error)
      throw error
    }
  }
}
