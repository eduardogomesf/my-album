import { GetFilesByAlbumIdUseCase } from '@/application/use-case'
import {
  type GetFileUrlService,
  type GetAlbumByIdRepository,
  type GetFilesByAlbumIdRepository,
  type CountFilesByAlbumIdRepository,
} from '@/application/protocol'
import { getAlbumByIdMock, getFileMock } from '../mock'

describe('Get Files By Album Id Use Case', () => {
  let sut: GetFilesByAlbumIdUseCase
  let mockGetFilesByAlbumIdRepository: GetFilesByAlbumIdRepository
  let mockGetAlbumByIdRepository: GetAlbumByIdRepository
  let mockGetFileUrlService: GetFileUrlService
  let mockCountFilesByAlbumIdRepository: CountFilesByAlbumIdRepository

  beforeEach(() => {
    mockGetFilesByAlbumIdRepository = {
      getManyWithFilters: jest
        .fn()
        .mockResolvedValue([getFileMock(), getFileMock()]),
    }
    mockGetAlbumByIdRepository = {
      getById: jest.fn().mockResolvedValue(getAlbumByIdMock()),
    }
    mockGetFileUrlService = {
      getFileUrl: jest.fn().mockResolvedValue([
        {
          ...getFileMock(),
          url: 'any-url',
        },
        {
          ...getFileMock(),
          url: 'any-url',
        },
      ]),
    }
    mockCountFilesByAlbumIdRepository = {
      countWithFilters: jest.fn().mockResolvedValue(2),
    }

    sut = new GetFilesByAlbumIdUseCase(
      mockGetFilesByAlbumIdRepository,
      mockGetAlbumByIdRepository,
      mockGetFileUrlService,
      mockCountFilesByAlbumIdRepository,
    )
  })

  it('should get a list of files by album id successfully', async () => {
    const result = await sut.execute({
      albumId: 'any-album-id',
      userId: 'user-id',
      filters: {
        page: 1,
        limit: 10,
      },
    })

    expect(result.ok).toBe(true)
    expect(result.data?.files).toHaveLength(2)
    expect(result.data?.total).toBe(2)
    expect(result.data?.limit).toBe(10)
    expect(result.data?.page).toBe(1)
    expect(result.data?.totalPages).toBe(1)
    expect(result.data?.album).toEqual({
      id: 'any-id',
      name: 'any-name',
    })
  })

  it('should call dependencies with right params ', async () => {
    const getByIdSpy = jest.spyOn(mockGetAlbumByIdRepository, 'getById')
    const getManyWithFiltersSpy = jest.spyOn(
      mockGetFilesByAlbumIdRepository,
      'getManyWithFilters',
    )
    const getFileUrlSpy = jest.spyOn(mockGetFileUrlService, 'getFileUrl')
    const countWithFiltersSpy = jest.spyOn(
      mockCountFilesByAlbumIdRepository,
      'countWithFilters',
    )

    await sut.execute({
      albumId: 'any-album-id',
      userId: 'user-id',
      filters: {
        page: 1,
        limit: 10,
      },
    })

    expect(getByIdSpy).toHaveBeenCalledWith('any-album-id', 'user-id')
    expect(getManyWithFiltersSpy).toHaveBeenCalledWith('any-album-id', {
      limit: 10,
      page: 1,
    })
    expect(getFileUrlSpy).toHaveBeenCalledTimes(2)
    expect(countWithFiltersSpy).toHaveBeenCalledWith('any-album-id')
  })

  it('should not get files if album does not exist', async () => {
    mockGetAlbumByIdRepository.getById = jest.fn().mockResolvedValue(null)

    const result = await sut.execute({
      albumId: 'any-album-id',
      userId: 'user-id',
      filters: {
        page: 1,
        limit: 10,
      },
    })

    expect(result.ok).toBe(false)
    expect(result.message).toBe('Album not found')
  })

  it('should pass along any unknown error', async () => {
    mockGetAlbumByIdRepository.getById = jest
      .fn()
      .mockRejectedValueOnce(new Error('any-error'))

    const result = sut.execute({
      albumId: 'any-album-id',
      userId: 'user-id',
      filters: {
        page: 1,
        limit: 10,
      },
    })

    await expect(result).rejects.toThrow('any-error')
  })
})
