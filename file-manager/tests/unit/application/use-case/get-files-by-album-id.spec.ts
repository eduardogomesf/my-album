import { GetFilesByAlbumIdUseCase } from '@/application/use-case'
import { type GetFilesUrlsService, type GetAlbumByIdRepository, type GetFilesByAlbumIdRepository } from '@/application/protocol'
import { getAlbumByIdMock, getFileMock } from '../mock'

describe('Get Files By Album Id Use Case', () => {
  let sut: GetFilesByAlbumIdUseCase
  let mockGetFilesByAlbumIdRepository: GetFilesByAlbumIdRepository
  let mockGetAlbumByIdRepository: GetAlbumByIdRepository
  let mockGetFilesUrlsService: GetFilesUrlsService

  beforeEach(() => {
    mockGetFilesByAlbumIdRepository = {
      getManyById: jest.fn().mockResolvedValue([
        getFileMock(),
        getFileMock()
      ])
    }
    mockGetAlbumByIdRepository = { getById: jest.fn().mockResolvedValue(getAlbumByIdMock()) }
    mockGetFilesUrlsService = {
      getFilesUrls: jest.fn().mockResolvedValue([
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
      mockGetFilesUrlsService
    )
  })

  it('should get a list of files by album id successfully', async () => {
    const result = await sut.execute({
      albumId: 'any-album-id',
      userId: 'user-id'
    })

    expect(result.ok).toBe(true)
    expect(result.data).toHaveLength(2)
  })

  it('should call dependencies with right params ', async () => {
    const getByIdSpy = jest.spyOn(mockGetAlbumByIdRepository, 'getById')
    const getManyByIdSpy = jest.spyOn(mockGetFilesByAlbumIdRepository, 'getManyById')
    const getFilesUrlsSpy = jest.spyOn(mockGetFilesUrlsService, 'getFilesUrls')

    await sut.execute({
      albumId: 'any-album-id',
      userId: 'user-id'
    })

    expect(getByIdSpy).toHaveBeenCalledWith('any-album-id', 'user-id')
    expect(getManyByIdSpy).toHaveBeenCalledWith('any-album-id', 'user-id')
    expect(getFilesUrlsSpy).toHaveBeenCalledTimes(1)
  })

  it('should pass along any unknown error', async () => {
    mockGetAlbumByIdRepository.getById = jest.fn().mockRejectedValueOnce(new Error('any-error'))

    const result = sut.execute({
      albumId: 'any-album-id',
      userId: 'user-id'
    })

    await expect(result).rejects.toThrow('any-error')
  })
})
