import { DeleteFileUseCase } from '@/application/use-case'
import {
  type GetFileByIdAndAlbumIdRepository,
  type DeleteFileRepository,
  type DeleteFileFromStorageService
} from '@/application/protocol'
import { getFileMock } from '../mock'

jest.mock('uuid', () => ({
  v4: () => 'any-id'
}))

describe('Delete file Use Case', () => {
  let sut: DeleteFileUseCase
  let getFileByIdAndAlbumIdRepository: GetFileByIdAndAlbumIdRepository
  let deleteFileRepository: DeleteFileRepository
  let deleteFileFromStorageService: DeleteFileFromStorageService

  beforeEach(() => {
    getFileByIdAndAlbumIdRepository = {
      getFileByIdAndAlbumId: jest.fn().mockResolvedValue(getFileMock())
    }
    deleteFileRepository = {
      deleteFile: jest.fn().mockResolvedValue(true)
    }
    deleteFileFromStorageService = {
      delete: jest.fn().mockResolvedValue(true)
    }

    sut = new DeleteFileUseCase(
      getFileByIdAndAlbumIdRepository,
      deleteFileRepository,
      deleteFileFromStorageService
    )
  })

  it('should delete a successfully', async () => {
    const payload = {
      fileId: 'any-id',
      albumId: 'any-album-id',
      userId: 'any-user-id'
    }

    const result = await sut.execute(payload)

    expect(result.ok).toBe(true)
    expect(result.data).toBeUndefined()
  })

  it('should calls dependencies with correct input', async () => {
    const payload = {
      fileId: 'any-id',
      albumId: 'any-album-id',
      userId: 'any-user-id'
    }

    const getFileByIdAndAlbumIdSpy = jest.spyOn(getFileByIdAndAlbumIdRepository, 'getFileByIdAndAlbumId')
    const deleteFileSpy = jest.spyOn(deleteFileRepository, 'deleteFile')
    const deleteFileFromStorageSpy = jest.spyOn(deleteFileFromStorageService, 'delete')

    await sut.execute(payload)

    expect(getFileByIdAndAlbumIdSpy).toHaveBeenCalledWith('any-id', 'any-album-id', 'any-user-id')
    expect(deleteFileSpy).toHaveBeenCalledWith(getFileMock())
    expect(deleteFileFromStorageSpy).toHaveBeenCalledWith(getFileMock(), 'any-user-id')
  })

  it('should not delete a file if it does not exist', async () => {
    getFileByIdAndAlbumIdRepository.getFileByIdAndAlbumId = jest.fn().mockResolvedValue(null)

    const payload = {
      fileId: 'any-id',
      albumId: 'any-album-id',
      userId: 'any-user-id'
    }

    const result = await sut.execute(payload)

    expect(result.ok).toBe(false)
    expect(result.message).toBe('File not found')
  })

  it('should pass along any error thrown when trying to create a user', async () => {
    getFileByIdAndAlbumIdRepository.getFileByIdAndAlbumId = jest.fn().mockImplementation(
      () => { throw new Error('any-error') }
    )

    const payload = {
      fileId: 'any-id',
      albumId: 'any-album-id',
      userId: 'any-user-id'
    }

    const result = sut.execute(payload)

    await expect(result).rejects.toThrow(new Error('any-error'))
  })
})
