import { GetActiveAlbumsUseCase } from '@/application/use-case'
import { type GetAlbumsByStatusRepository } from '@/application/protocol'
import { getAlbumByIdMock } from '../mock/album.mock'

describe('Get Active Albums Use Case', () => {
  let sut: GetActiveAlbumsUseCase
  let mockGetAlbumsByStatusRepository: GetAlbumsByStatusRepository

  beforeEach(() => {
    mockGetAlbumsByStatusRepository = {
      getManyByStatus: jest.fn().mockResolvedValue([
        getAlbumByIdMock(),
        getAlbumByIdMock()
      ])
    }

    sut = new GetActiveAlbumsUseCase(mockGetAlbumsByStatusRepository)
  })

  it('should get a list of active albums successfully', async () => {
    const result = await sut.execute('user-id')

    expect(result.ok).toBe(true)
    expect(result.data).toHaveLength(2)
  })

  it('should call dependencies with right params ', async () => {
    const getManyByStatusSpy = jest.spyOn(mockGetAlbumsByStatusRepository, 'getManyByStatus')

    await sut.execute('user-id')

    expect(getManyByStatusSpy).toHaveBeenCalledTimes(1)
    expect(getManyByStatusSpy).toHaveBeenCalledWith('user-id', 'ACTIVE')
  })

  it('should pass along any unknown error', async () => {
    mockGetAlbumsByStatusRepository.getManyByStatus = jest.fn().mockRejectedValueOnce(new Error('any-error'))

    const result = sut.execute('user-id')

    await expect(result).rejects.toThrow('any-error')
  })
})
