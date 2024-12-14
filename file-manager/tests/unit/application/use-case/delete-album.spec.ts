import { DeleteAlbumUseCase } from '@/application/use-case'
import {
  type DeleteAlbumRepository,
  type GetAlbumByIdWithFilesCountRepository,
  type UpdateAlbumRepository,
} from '@/application/protocol'
import { getAlbumByIdMock } from '../mock/album.mock'

jest.mock('uuid', () => ({
  v4: () => 'any-id',
}))

describe('Delete Album Use Case', () => {
  let sut: DeleteAlbumUseCase
  let getAlbumByIdWithFilesCountRepository: GetAlbumByIdWithFilesCountRepository
  let updateAlbumRepository: UpdateAlbumRepository
  let deleteAlbumRepository: DeleteAlbumRepository

  beforeEach(() => {
    getAlbumByIdWithFilesCountRepository = {
      getByIdWithFilesCount: jest.fn().mockResolvedValueOnce({
        ...getAlbumByIdMock(),
        numberOfFiles: 1,
      }),
    }
    updateAlbumRepository = {
      update: jest.fn().mockResolvedValue(null),
    }
    deleteAlbumRepository = {
      delete: jest.fn().mockResolvedValue(null),
    }

    sut = new DeleteAlbumUseCase(
      getAlbumByIdWithFilesCountRepository,
      updateAlbumRepository,
      deleteAlbumRepository,
    )
  })

  it('should update album status to DELETED if album status is ACTIVE and has at least one file', async () => {
    const updateSpy = jest.spyOn(updateAlbumRepository, 'update')
    const deleteSpy = jest.spyOn(deleteAlbumRepository, 'delete')
    const getByIdWithFilesCountSpy = jest.spyOn(
      getAlbumByIdWithFilesCountRepository,
      'getByIdWithFilesCount',
    )

    const result = await sut.execute({
      albumId: 'album-id',
      userId: 'user-id',
    })

    expect(result.ok).toBe(true)
    expect(updateSpy).toHaveBeenCalledWith({
      ...getAlbumByIdMock(),
      status: 'DELETED',
      numberOfFiles: 1,
    })
    expect(deleteSpy).not.toHaveBeenCalled()
    expect(getByIdWithFilesCountSpy).toHaveBeenCalledWith('album-id', 'user-id')
  })

  it('should delete album if album status is DELETED', async () => {
    getAlbumByIdWithFilesCountRepository.getByIdWithFilesCount = jest
      .fn()
      .mockResolvedValueOnce({
        ...getAlbumByIdMock(),
        status: 'DELETED',
      })

    const updateSpy = jest.spyOn(updateAlbumRepository, 'update')
    const deleteSpy = jest.spyOn(deleteAlbumRepository, 'delete')
    const getByIdWithFilesCountSpy = jest.spyOn(
      getAlbumByIdWithFilesCountRepository,
      'getByIdWithFilesCount',
    )

    const result = await sut.execute({
      albumId: 'album-id',
      userId: 'user-id',
    })

    expect(result.ok).toBe(true)
    expect(updateSpy).not.toHaveBeenCalled()
    expect(deleteSpy).toHaveBeenCalledWith('album-id', 'user-id')
    expect(getByIdWithFilesCountSpy).toHaveBeenCalledWith('album-id', 'user-id')
  })

  it('should delete album if album status is ACTIVE but album has no files', async () => {
    getAlbumByIdWithFilesCountRepository.getByIdWithFilesCount = jest
      .fn()
      .mockResolvedValueOnce({
        ...getAlbumByIdMock(),
        numberOfFiles: 0,
      })

    const updateSpy = jest.spyOn(updateAlbumRepository, 'update')
    const deleteSpy = jest.spyOn(deleteAlbumRepository, 'delete')
    const getByIdWithFilesCountSpy = jest.spyOn(
      getAlbumByIdWithFilesCountRepository,
      'getByIdWithFilesCount',
    )

    const result = await sut.execute({
      albumId: 'album-id',
      userId: 'user-id',
    })

    expect(result.ok).toBe(true)
    expect(updateSpy).not.toHaveBeenCalled()
    expect(deleteSpy).toHaveBeenCalledWith('album-id', 'user-id')
    expect(getByIdWithFilesCountSpy).toHaveBeenCalledWith('album-id', 'user-id')
  })

  it('should not delete if the album does not exist', async () => {
    getAlbumByIdWithFilesCountRepository.getByIdWithFilesCount = jest
      .fn()
      .mockResolvedValueOnce(null)

    const result = await sut.execute({
      albumId: 'album-id',
      userId: 'user-id',
    })

    expect(result).toEqual({
      ok: false,
      message: 'Album not found',
    })
  })

  it('should pass along any unknown error', async () => {
    getAlbumByIdWithFilesCountRepository.getByIdWithFilesCount = jest
      .fn()
      .mockRejectedValueOnce(new Error('any-error'))

    const result = sut.execute({
      albumId: 'album-id',
      userId: 'user-id',
    })

    await expect(result).rejects.toThrow('any-error')
  })
})
