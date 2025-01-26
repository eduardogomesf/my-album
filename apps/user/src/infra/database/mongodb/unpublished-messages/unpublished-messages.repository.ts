import { Logger } from '@/shared'
import { UnpublishedMessageModel } from './unpublished-messages.entity'

interface Message {
  id: string
  data: any
  options: any
}

const logger = new Logger('MongoUnpublishedMessagesRepository')

export class MongoUnpublishedMessagesRepository {
  async save(data: Message) {
    try {
      const payload = {
        _id: data.id,
        data: data.data,
        options: data.options,
      }

      await UnpublishedMessageModel.create(payload)
    } catch (error) {
      logger.error(`Error saving unpublished message: ${JSON.stringify(data)}`)
      logger.error(error)
      throw error
    }
  }

  async findAll(): Promise<Message[]> {
    try {
      return await UnpublishedMessageModel.find()
    } catch (error) {
      logger.error('Error finding unpublished messages')
      logger.error(error)
      throw error
    }
  }
}
