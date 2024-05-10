import { DeleteAlbumUseCase } from '@/application/use-case'
import {
  type DeleteAlbumRepository,
  type GetAlbumByIdRepository,
  type UpdateAlbumRepository
} from '@/application/protocol'
import { getAlbumByIdMock } from '../mock/album.mock'

jest.mock('uuid', () => ({
  v4: () => 'any-id'
}))

describe('Delete Album Use Case', () => {
  let sut: DeleteAlbumUseCase
  let getAlbumByIdRepository: GetAlbumByIdRepository
  let updateAlbumRepository: UpdateAlbumRepository
  let deleteAlbumRepository: DeleteAlbumRepository

  beforeEach(() => {
    getAlbumByIdRepository = {
      getById: jest.fn()
        .mockResolvedValueOnce(getAlbumByIdMock())
    }
    updateAlbumRepository = {
      update: jest.fn().mockResolvedValue(null)
    }
    deleteAlbumRepository = {
      delete: jest.fn().mockResolvedValue(null)
    }

    sut = new DeleteAlbumUseCase(
      getAlbumByIdRepository,
      updateAlbumRepository,
      deleteAlbumRepository
    )
  })

  it('should update album status to DELETED if album status is ACTIVE', async () => {
    const updateSpy = jest.spyOn(updateAlbumRepository, 'update')
    const deleteSpy = jest.spyOn(deleteAlbumRepository, 'delete')
    const getAlbumByIdSpy = jest.spyOn(getAlbumByIdRepository, 'getById')

    const result = await sut.execute({
      albumId: 'album-id',
      userId: 'user-id'
    })

    expect(result.ok).toBe(true)
    expect(updateSpy).toHaveBeenCalledWith({
      ...getAlbumByIdMock(),
      status: 'DELETED'
    })
    expect(deleteSpy).not.toHaveBeenCalled()
    expect(getAlbumByIdSpy).toHaveBeenCalledWith('album-id', 'user-id')
  })

  it('should delete album if album status is DELETED', async () => {
    getAlbumByIdRepository.getById = jest.fn().mockResolvedValueOnce({
      ...getAlbumByIdMock(),
      status: 'DELETED'
    })

    const updateSpy = jest.spyOn(updateAlbumRepository, 'update')
    const deleteSpy = jest.spyOn(deleteAlbumRepository, 'delete')
    const getAlbumByIdSpy = jest.spyOn(getAlbumByIdRepository, 'getById')

    const result = await sut.execute({
      albumId: 'album-id',
      userId: 'user-id'
    })

    expect(result.ok).toBe(true)
    expect(updateSpy).not.toHaveBeenCalled()
    expect(deleteSpy).toHaveBeenCalledWith('album-id', 'user-id')
    expect(getAlbumByIdSpy).toHaveBeenCalledWith('album-id', 'user-id')
  })

  it('should not delete if the album does not exist', async () => {
    getAlbumByIdRepository.getById = jest.fn().mockResolvedValueOnce(null)

    const result = await sut.execute({
      albumId: 'album-id',
      userId: 'user-id'
    })

    expect(result).toEqual({
      ok: false,
      message: 'Album not found'
    })
  })

  it('should pass along any unknown error', async () => {
    getAlbumByIdRepository.getById = jest.fn().mockRejectedValueOnce(new Error('any-error'))

    const result = sut.execute({
      albumId: 'album-id',
      userId: 'user-id'
    })

    await expect(result).rejects.toThrow('any-error')
  })
})
