import { ReprocessUnpublishedMessages } from '@/use-case'
import {
  type GetPendingUnpublishedMessagesRepository,
  type MessageSender,
  type DeleteUnpublishedMessageRepository,
  type UpdateUnpublishedMessageRepository
} from '../src/use-case/protocol'

jest.mock('uuid', () => ({
  v4: () => 'any-id'
}))

jest.mock('@/shared/logger', () => {
  class Logger {
    info (message: string) {}
    error (message: string) {}
  }

  return {
    Logger
  }
})

const generateMessage = (id: string) => ({
  id,
  data: { message: 'test' },
  options: { topic: 'any-topic' }
})

describe('Reprocess unpublished messages use case', () => {
  let sut: ReprocessUnpublishedMessages
  let getPendingUnpublishedMessagesRepository: GetPendingUnpublishedMessagesRepository
  let messageSender: MessageSender
  let deleteUnpublishedMessagesRepository: DeleteUnpublishedMessageRepository
  let updateUnpublishedMessagesRepository: UpdateUnpublishedMessageRepository

  beforeEach(() => {
    getPendingUnpublishedMessagesRepository = {
      findAllPending: jest.fn().mockResolvedValue([
        generateMessage('any-id'),
        generateMessage('any-id-1'),
        generateMessage('any-id-2'),
        generateMessage('any-id-3'),
        generateMessage('any-id-4')
      ])
    }
    messageSender = {
      send: jest.fn().mockResolvedValue(true)
    }
    deleteUnpublishedMessagesRepository = {
      delete: jest.fn().mockResolvedValue(null)
    }
    updateUnpublishedMessagesRepository = {
      update: jest.fn().mockResolvedValue(null)
    }

    sut = new ReprocessUnpublishedMessages(
      getPendingUnpublishedMessagesRepository,
      messageSender,
      deleteUnpublishedMessagesRepository,
      updateUnpublishedMessagesRepository
    )
  })

  it('should reprocess all messages successfully', async () => {
    const deleteSpy = jest.spyOn(deleteUnpublishedMessagesRepository, 'delete')
    const sendSpy = jest.spyOn(messageSender, 'send')
    const updateSpy = jest.spyOn(updateUnpublishedMessagesRepository, 'update')

    const result = await sut.execute()

    expect(result).toBe(true)
    expect(deleteSpy).toHaveBeenCalledTimes(5)
    expect(sendSpy).toHaveBeenCalledTimes(5)
    expect(updateSpy).toHaveBeenCalledTimes(0)
  })

  it('should not delete the message if it was not sent', async () => {
    const deleteSpy = jest.spyOn(deleteUnpublishedMessagesRepository, 'delete')
    const sendSpy = jest.spyOn(messageSender, 'send')
    const updateSpy = jest.spyOn(updateUnpublishedMessagesRepository, 'update')

    const result = await sut.execute()

    expect(result).toBe(true)
    expect(deleteSpy).toHaveBeenCalledTimes(0)
    expect(sendSpy).toHaveBeenCalledTimes(5)
    expect(updateSpy).toHaveBeenCalledTimes(0)
  })

  it('should not process invalid messages', async () => {
    getPendingUnpublishedMessagesRepository.findAllPending = jest.fn().mockResolvedValue([
      {
        ...generateMessage('any-id'),
        data: null
      },
      {
        ...generateMessage('any-id-1'),
        options: { topic: null }
      },
      generateMessage('any-id-2'),
      generateMessage('any-id-3'),
      generateMessage('any-id-4')
    ])

    const deleteSpy = jest.spyOn(deleteUnpublishedMessagesRepository, 'delete')
    const updateSpy = jest.spyOn(updateUnpublishedMessagesRepository, 'update')
    const sendSpy = jest.spyOn(messageSender, 'send')

    const result = await sut.execute()

    expect(result).toBe(true)
    expect(deleteSpy).toHaveBeenCalledTimes(3)
    expect(updateSpy).toHaveBeenCalledTimes(2)
    expect(sendSpy).toHaveBeenCalledTimes(3)
  })
})
