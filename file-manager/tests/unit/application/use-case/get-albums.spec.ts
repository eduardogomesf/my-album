import { GetAlbumsUseCase } from '@/application/use-case'
import { type GetAlbumsByStatusRepository } from '@/application/protocol'
import { getAlbumByIdMock } from '../mock/album.mock'

describe('Get Albums Use Case', () => {
  let sut: GetAlbumsUseCase
  let mockGetAlbumsByStatusRepository: GetAlbumsByStatusRepository

  beforeEach(() => {
    mockGetAlbumsByStatusRepository = {
      getManyByStatus: jest.fn().mockResolvedValue([
        getAlbumByIdMock(),
        getAlbumByIdMock()
      ])
    }

    sut = new GetAlbumsUseCase(mockGetAlbumsByStatusRepository)
  })

  it('should get a list of active albums successfully', async () => {
    const getManyByStatusSpy = jest.spyOn(mockGetAlbumsByStatusRepository, 'getManyByStatus')

    const result = await sut.execute({
      userId: 'user-id',
      deletedAlbums: false
    })

    expect(result.ok).toBe(true)
    expect(result.data).toHaveLength(2)
    expect(getManyByStatusSpy).toHaveBeenCalledWith('user-id', 'ACTIVE')
  })

  it('should get a list of deleted albums successfully', async () => {
    const getManyByStatusSpy = jest.spyOn(mockGetAlbumsByStatusRepository, 'getManyByStatus')

    const result = await sut.execute({
      userId: 'user-id',
      deletedAlbums: true
    })

    expect(result.ok).toBe(true)
    expect(result.data).toHaveLength(2)
    expect(getManyByStatusSpy).toHaveBeenCalledWith('user-id', 'DELETED')
  })

  it('should pass along any unknown error', async () => {
    mockGetAlbumsByStatusRepository.getManyByStatus = jest.fn().mockRejectedValueOnce(new Error('any-error'))

    const result = sut.execute({
      userId: 'user-id',
      deletedAlbums: true
    })

    await expect(result).rejects.toThrow('any-error')
  })
})
