import { GetAlbumsUseCase } from '@/application/use-case'
import { type GetAlbumsRepository } from '@/application/protocol'
import { getAlbumByIdMock } from '../mock/album.mock'

describe('Get Albums Use Case', () => {
  let sut: GetAlbumsUseCase
  let mockGetAlbumsRepository: GetAlbumsRepository

  beforeEach(() => {
    mockGetAlbumsRepository = {
      getAll: jest.fn().mockResolvedValue([
        getAlbumByIdMock(),
        getAlbumByIdMock()
      ])
    }

    sut = new GetAlbumsUseCase(mockGetAlbumsRepository)
  })

  it('should get a list of albums successfully', async () => {
    const result = await sut.execute('user-id')

    expect(result.ok).toBe(true)
    expect(result.data).toHaveLength(2)
  })

  it('should call dependencies with right params ', async () => {
    const getAllSpy = jest.spyOn(mockGetAlbumsRepository, 'getAll')

    await sut.execute('user-id')

    expect(getAllSpy).toHaveBeenCalledTimes(1)
    expect(getAllSpy).toHaveBeenCalledWith('user-id')
  })

  it('should pass along any unknown error', async () => {
    mockGetAlbumsRepository.getAll = jest.fn().mockRejectedValueOnce(new Error('any-error'))

    const result = sut.execute('user-id')

    await expect(result).rejects.toThrow('any-error')
  })
})
