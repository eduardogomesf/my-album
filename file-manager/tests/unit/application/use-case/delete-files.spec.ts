import { DeleteFilesUseCase } from '@/application/use-case'
import {
  type GetFilesByIdsAndAlbumIdRepository,
  type DeleteFilesRepository,
  type DeleteFileFromStorageService
} from '@/application/protocol'
import { getFileMock } from '../mock'

jest.mock('uuid', () => ({
  v4: () => 'any-id'
}))

describe('Delete file Use Case', () => {
  let sut: DeleteFilesUseCase
  let getFilesByIdsAndAlbumIdRepository: GetFilesByIdsAndAlbumIdRepository
  let deleteFilesRepository: DeleteFilesRepository
  let deleteFileFromStorageService: DeleteFileFromStorageService

  beforeEach(() => {
    getFilesByIdsAndAlbumIdRepository = {
      getFilesByIdsAndAlbumId: jest.fn().mockResolvedValue([getFileMock(), getFileMock()])
    }
    deleteFilesRepository = {
      deleteFiles: jest.fn().mockResolvedValue(true)
    }
    deleteFileFromStorageService = {
      delete: jest.fn().mockResolvedValue(true)
    }

    sut = new DeleteFilesUseCase(
      getFilesByIdsAndAlbumIdRepository,
      deleteFilesRepository,
      deleteFileFromStorageService
    )
  })

  it('should delete a successfully', async () => {
    const payload = {
      filesIds: ['any-id', 'any-id-2'],
      albumId: 'any-album-id',
      userId: 'any-user-id'
    }

    const result = await sut.execute(payload)

    expect(result.ok).toBe(true)
    expect(result.data).toBeUndefined()
  })

  it('should calls dependencies with correct input', async () => {
    const payload = {
      filesIds: ['any-id', 'any-id-2'],
      albumId: 'any-album-id',
      userId: 'any-user-id'
    }

    const getFileByIdAndAlbumIdSpy = jest.spyOn(getFilesByIdsAndAlbumIdRepository, 'getFilesByIdsAndAlbumId')
    const deleteFileSpy = jest.spyOn(deleteFilesRepository, 'deleteFiles')
    const deleteFileFromStorageSpy = jest.spyOn(deleteFileFromStorageService, 'delete')

    await sut.execute(payload)

    expect(getFileByIdAndAlbumIdSpy).toHaveBeenCalledWith(['any-id', 'any-id-2'], 'any-album-id', 'any-user-id')
    expect(deleteFileSpy).toHaveBeenCalledWith([getFileMock(), getFileMock()])
    expect(deleteFileFromStorageSpy).toHaveBeenCalledTimes(2)
  })

  it('should not delete a file if it does not exist', async () => {
    getFilesByIdsAndAlbumIdRepository.getFilesByIdsAndAlbumId = jest.fn().mockResolvedValue([])

    const payload = {
      filesIds: ['any-id', 'any-id-2'],
      albumId: 'any-album-id',
      userId: 'any-user-id'
    }

    const result = await sut.execute(payload)

    expect(result.ok).toBe(false)
    expect(result.message).toBe('Files not found')
  })

  it('should pass along any error thrown when trying to create a user', async () => {
    getFilesByIdsAndAlbumIdRepository.getFilesByIdsAndAlbumId = jest.fn().mockImplementation(
      () => { throw new Error('any-error') }
    )

    const payload = {
      filesIds: ['any-id', 'any-id-2'],
      albumId: 'any-album-id',
      userId: 'any-user-id'
    }

    const result = sut.execute(payload)

    await expect(result).rejects.toThrow(new Error('any-error'))
  })
})
