import { GetDeletedAlbumsUseCase } from '@/application/use-case'
import { type GetAlbumsByStatusRepository } from '@/application/protocol'
import { getAlbumByIdMock } from '../mock/album.mock'

describe('Get Deleted Albums Use Case', () => {
  let sut: GetDeletedAlbumsUseCase
  let mockGetAlbumsByStatusRepository: GetAlbumsByStatusRepository

  beforeEach(() => {
    mockGetAlbumsByStatusRepository = {
      getManyByStatus: jest.fn().mockResolvedValue([
        {
          ...getAlbumByIdMock(),
          status: 'DELETED'
        },
        {
          ...getAlbumByIdMock(),
          status: 'DELETED'
        }
      ])
    }

    sut = new GetDeletedAlbumsUseCase(mockGetAlbumsByStatusRepository)
  })

  it('should get a list of deleted albums successfully', async () => {
    const result = await sut.execute({
      userId: 'user-id'
    })

    expect(result.ok).toBe(true)
    expect(result.data).toHaveLength(2)
  })

  it('should call dependencies with right params ', async () => {
    const getManyByStatusSpy = jest.spyOn(mockGetAlbumsByStatusRepository, 'getManyByStatus')

    await sut.execute({
      userId: 'user-id'
    })

    expect(getManyByStatusSpy).toHaveBeenCalledTimes(1)
    expect(getManyByStatusSpy).toHaveBeenCalledWith('user-id', 'DELETED')
  })

  it('should pass along any unknown error', async () => {
    mockGetAlbumsByStatusRepository.getManyByStatus = jest.fn().mockRejectedValueOnce(new Error('any-error'))

    const result = sut.execute({
      userId: 'user-id'
    })

    await expect(result).rejects.toThrow('any-error')
  })
})
