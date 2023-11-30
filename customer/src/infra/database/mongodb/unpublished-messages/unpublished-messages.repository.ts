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
      console.error('Error saving unpublished message')
      console.log(JSON.stringify(data))
      console.error(error)
      throw error
    }
  }

  async findAll(): Promise<Message[]> {
    try {
      return await UnpublishedMessageModel.find()
    } catch (error) {
      console.error('Error finding unpublished messages')
      console.error(error)
      throw error
    }
  }
}
