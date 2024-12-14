import { RestoreAlbumUseCase } from '@/application/use-case'
import {
  type GetAlbumByIdRepository,
  type UpdateAlbumRepository,
} from '@/application/protocol'
import { getAlbumByIdMock } from '../mock/album.mock'

jest.mock('uuid', () => ({
  v4: () => 'any-id',
}))

describe('Restore Album Use Case', () => {
  let sut: RestoreAlbumUseCase
  let getAlbumByIdRepository: GetAlbumByIdRepository
  let updateAlbumRepository: UpdateAlbumRepository

  beforeEach(() => {
    getAlbumByIdRepository = {
      getById: jest.fn().mockResolvedValueOnce({
        ...getAlbumByIdMock(),
        status: 'DELETED',
      }),
    }
    updateAlbumRepository = {
      update: jest.fn().mockResolvedValue(null),
    }

    sut = new RestoreAlbumUseCase(getAlbumByIdRepository, updateAlbumRepository)
  })

  it('should restore album successfully', async () => {
    const getAlbumByIdSpy = jest.spyOn(getAlbumByIdRepository, 'getById')
    const updateSpy = jest.spyOn(updateAlbumRepository, 'update')

    const result = await sut.execute({
      albumId: 'album-id',
      userId: 'user-id',
    })

    expect(result.ok).toBe(true)
    expect(getAlbumByIdSpy).toHaveBeenCalledWith('album-id', 'user-id')
    expect(updateSpy).toHaveBeenCalledWith({
      ...getAlbumByIdMock(),
      status: 'ACTIVE',
    })
  })

  it('should not restore if the album does not exist', async () => {
    getAlbumByIdRepository.getById = jest.fn().mockResolvedValueOnce(null)

    const result = await sut.execute({
      albumId: 'album-id',
      userId: 'user-id',
    })

    expect(result).toEqual({
      ok: false,
      message: 'Album not found',
    })
  })

  it('should not restore if album is not deleted', async () => {
    getAlbumByIdRepository.getById = jest.fn().mockResolvedValueOnce({
      ...getAlbumByIdMock(),
      status: 'ACTIVE',
    })

    const result = await sut.execute({
      albumId: 'album-id',
      userId: 'user-id',
    })

    expect(result).toEqual({
      ok: false,
      message: 'Album is not deleted',
    })
  })

  it('should pass along any unknown error', async () => {
    getAlbumByIdRepository.getById = jest
      .fn()
      .mockRejectedValueOnce(new Error('any-error'))

    const result = sut.execute({
      albumId: 'album-id',
      userId: 'user-id',
    })

    await expect(result).rejects.toThrow('any-error')
  })
})
