import { GetAlbumsUseCase } from '@/application/use-case'
import {
  type GetFileUrlService,
  type GetLastPhotoByAlbumIdRepository,
  type GetAlbumsByStatusRepository,
} from '@/application/protocol'
import { getFileMock } from '../mock'

describe('Get Albums Use Case', () => {
  let sut: GetAlbumsUseCase
  let mockGetAlbumsByStatusRepository: GetAlbumsByStatusRepository
  let mockGetLastPhotoByAlbumIdRepository: GetLastPhotoByAlbumIdRepository
  let mockGetFileUrlService: GetFileUrlService

  beforeEach(() => {
    mockGetAlbumsByStatusRepository = {
      getManyByStatus: jest.fn().mockResolvedValue([
        {
          id: 'album-id-1',
          name: 'album-name-1',
          updatedAt: new Date(),
          numberOfPhotos: 1,
          numberOfVideos: 1,
        },
        {
          id: 'album-id-2',
          name: 'album-name-2',
          updatedAt: new Date(),
          numberOfPhotos: 1,
          numberOfVideos: 1,
        },
      ]),
    }
    mockGetLastPhotoByAlbumIdRepository = {
      getLastPhotoByAlbumId: jest.fn().mockResolvedValue(getFileMock()),
    }
    mockGetFileUrlService = {
      getFileUrl: jest.fn().mockResolvedValue('https://any-url.com'),
    }

    sut = new GetAlbumsUseCase(
      mockGetAlbumsByStatusRepository,
      mockGetLastPhotoByAlbumIdRepository,
      mockGetFileUrlService,
    )
  })

  it('should get a list of active albums successfully', async () => {
    const getManyByStatusSpy = jest.spyOn(
      mockGetAlbumsByStatusRepository,
      'getManyByStatus',
    )
    const getLastPhotoByAlbumIdSpy = jest.spyOn(
      mockGetLastPhotoByAlbumIdRepository,
      'getLastPhotoByAlbumId',
    )
    const getFileUrlSpy = jest.spyOn(mockGetFileUrlService, 'getFileUrl')

    const result = await sut.execute({
      userId: 'user-id',
      deletedAlbums: false,
    })

    expect(result.ok).toBe(true)
    expect(result.data).toHaveLength(2)
    expect(getManyByStatusSpy).toHaveBeenCalledWith('user-id', 'ACTIVE')
    expect(getLastPhotoByAlbumIdSpy).toHaveBeenCalledTimes(2)
    expect(getFileUrlSpy).toHaveBeenCalledWith(getFileMock(), 'user-id')
  })

  it('should get a list of deleted albums successfully', async () => {
    const getManyByStatusSpy = jest.spyOn(
      mockGetAlbumsByStatusRepository,
      'getManyByStatus',
    )

    const result = await sut.execute({
      userId: 'user-id',
      deletedAlbums: true,
    })

    expect(result.ok).toBe(true)
    expect(result.data).toHaveLength(2)
    expect(getManyByStatusSpy).toHaveBeenCalledWith('user-id', 'DELETED')
  })

  it('should pass along any unknown error', async () => {
    mockGetAlbumsByStatusRepository.getManyByStatus = jest
      .fn()
      .mockRejectedValueOnce(new Error('any-error'))

    const result = sut.execute({
      userId: 'user-id',
      deletedAlbums: true,
    })

    await expect(result).rejects.toThrow('any-error')
  })
})
