import { Logger } from '@/shared'
import { UnpublishedMessageModel } from './unpublished-messages.entity'

interface Message {
  id: string
  data: any
  options: any
}

export class MongoUnpublishedMessagesRepository {
  async save(data: Message) {
    try {
      const payload = {
        _id: data.id,
        data: data.data,
        options: data.options
      }

      await UnpublishedMessageModel.create(payload)
    } catch (error) {
      Logger.error(`Error saving unpublished message: ${JSON.stringify(data)}`)
      Logger.error(error)
      throw error
    }
  }

  async findAll(): Promise<Message[]> {
    try {
      return await UnpublishedMessageModel.find()
    } catch (error) {
      Logger.error('Error finding unpublished messages')
      Logger.error(error)
      throw error
    }
  }
}
