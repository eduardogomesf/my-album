import { GetFilesByAlbumIdUseCase } from '@/application/use-case'
import { type GetFileUrlService, type GetAlbumByIdRepository, type GetFilesByAlbumIdRepository } from '@/application/protocol'
import { getAlbumByIdMock, getFileMock } from '../mock'

describe('Get Files By Album Id Use Case', () => {
  let sut: GetFilesByAlbumIdUseCase
  let mockGetFilesByAlbumIdRepository: GetFilesByAlbumIdRepository
  let mockGetAlbumByIdRepository: GetAlbumByIdRepository
  let mockGetFileUrlService: GetFileUrlService

  beforeEach(() => {
    mockGetFilesByAlbumIdRepository = {
      getManyWithFilters: jest.fn().mockResolvedValue([
        getFileMock(),
        getFileMock()
      ])
    }
    mockGetAlbumByIdRepository = { getById: jest.fn().mockResolvedValue(getAlbumByIdMock()) }
    mockGetFileUrlService = {
      getFileUrl: jest.fn().mockResolvedValue([
        {
          ...getFileMock(),
          url: 'any-url'
        },
        {
          ...getFileMock(),
          url: 'any-url'
        }
      ])
    }

    sut = new GetFilesByAlbumIdUseCase(
      mockGetFilesByAlbumIdRepository,
      mockGetAlbumByIdRepository,
      mockGetFileUrlService
    )
  })

  it('should get a list of files by album id successfully', async () => {
    const result = await sut.execute({
      albumId: 'any-album-id',
      userId: 'user-id',
      filters: {
        page: 1,
        limit: 10
      }
    })

    expect(result.ok).toBe(true)
    expect(result.data).toHaveLength(2)
  })

  it('should call dependencies with right params ', async () => {
    const getByIdSpy = jest.spyOn(mockGetAlbumByIdRepository, 'getById')
    const getManyWithFiltersSpy = jest.spyOn(mockGetFilesByAlbumIdRepository, 'getManyWithFilters')
    const getFileUrlSpy = jest.spyOn(mockGetFileUrlService, 'getFileUrl')

    await sut.execute({
      albumId: 'any-album-id',
      userId: 'user-id',
      filters: {
        page: 1,
        limit: 10
      }
    })

    expect(getByIdSpy).toHaveBeenCalledWith('any-album-id', 'user-id')
    expect(getManyWithFiltersSpy).toHaveBeenCalledWith('any-album-id', { limit: 10, page: 1, status: 'ACTIVE' })
    expect(getFileUrlSpy).toHaveBeenCalledTimes(2)
  })

  it('should pass along any unknown error', async () => {
    mockGetAlbumByIdRepository.getById = jest.fn().mockRejectedValueOnce(new Error('any-error'))

    const result = sut.execute({
      albumId: 'any-album-id',
      userId: 'user-id',
      filters: {
        page: 1,
        limit: 10
      }
    })

    await expect(result).rejects.toThrow('any-error')
  })
})
