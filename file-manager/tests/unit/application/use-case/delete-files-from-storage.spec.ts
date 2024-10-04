import { DeleteFilesFromStorageUseCase } from '@/application/use-case'
import {
  type MessageSender,
  type DeleteFilesFromStorageService
} from '@/application/protocol'

jest.mock('uuid', () => ({
  v4: () => 'any-id'
}))

jest.mock('../../../../src/shared/delay.ts', () => {
  class Delay {
    static async wait() { Promise.resolve(null) }
  }
  
  return {
    Delay
  }
})

jest.mock('../../../../src/shared/logger.ts', () => {
  class Logger {
    info() {}
    verbose() {}
  }
  
  return {
    Logger
  }
})

const mockDate = new Date();

describe('Delete Files From Storage Use Case', () => {
  let sut: DeleteFilesFromStorageUseCase
  let deleteFilesFromStorageService: DeleteFilesFromStorageService
  let deleteFilesFromStorageSender: MessageSender

  jest
  .useFakeTimers()
  .setSystemTime(mockDate)

  beforeEach(() => {
    deleteFilesFromStorageService = {
      deleteMany: jest.fn().mockResolvedValue(true)
    }
    deleteFilesFromStorageSender = {
      send: jest.fn().mockResolvedValue(true)
    }

    sut = new DeleteFilesFromStorageUseCase(
      deleteFilesFromStorageService,
      deleteFilesFromStorageSender
    )
  })

  it('should delete a successfully', async () => {
    const payload = {
      filesIds: ['any-id', 'any-id-2'],
      userId: 'any-user-id',
      id: 'any-id',
      date: new Date(),
      retryCount: 0
    }

    const result = await sut.execute(payload)

    expect(result.ok).toBe(true)
    expect(result.data).toBeUndefined()
  })

  it('should calls dependencies with correct input', async () => {
    const payload = {
      filesIds: ['any-id', 'any-id-2'],
      userId: 'any-user-id',
      id: 'any-id',
      date: new Date(),
      retryCount: 0,
    }

    const deleteManySpy = jest.spyOn(deleteFilesFromStorageService, 'deleteMany')
    const sendSpy = jest.spyOn(deleteFilesFromStorageSender, 'send')

    await sut.execute(payload)

    expect(deleteManySpy).toHaveBeenCalledWith(payload.filesIds, payload.userId)
    expect(sendSpy).not.toHaveBeenCalled()
  })

  it('should republish message if deletion was not successful', async () => {
    deleteFilesFromStorageService.deleteMany = jest.fn().mockResolvedValue(false)

    const payload = {
      filesIds: ['any-id', 'any-id-2'],
      userId: 'any-user-id',
      id: 'any-id',
      date: new Date(),
      retryCount: 0,
    }

    const sendSpy = jest.spyOn(deleteFilesFromStorageSender, 'send')

    const result = await sut.execute(payload)

    expect(result.ok).toBe(true)
    expect(sendSpy).toHaveBeenCalledWith({
      id: 'any-id',
      filesIds: ['any-id', 'any-id-2'],
      userId: 'any-user-id',
      date: mockDate,
      retryCount: 1,
      lastAttempt: mockDate
    })
  })

  it('should pass along any error thrown when trying to create a user', async () => {
    deleteFilesFromStorageService.deleteMany = jest.fn().mockImplementation(
      () => { throw new Error('any-error') }
    )

    const payload = {
      filesIds: ['any-id', 'any-id-2'],
      userId: 'any-user-id',
      id: 'any-id',
      date: new Date(),
      retryCount: 0,
    }

    const result = sut.execute(payload)

    await expect(result).rejects.toThrow(new Error('any-error'))
  })
})
