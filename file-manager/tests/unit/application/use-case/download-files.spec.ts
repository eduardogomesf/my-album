import { Readable } from 'node:stream'
import { DownloadFilesUseCase } from '@/application/use-case/file'
import {
  type GetAlbumByIdRepository,
  type GetFilesByIdsRepository,
  type GetFileStreamFromStorageService,
} from '@/application/protocol'
import { getAlbumByIdMock, getFileWithAlbumMock } from '../mock'

jest.mock('uuid', () => ({
  v4: () => 'any-id',
}))

describe('Download Files Use Case', () => {
  let sut: DownloadFilesUseCase
  let getAlbumByIdRepository: GetAlbumByIdRepository
  let getFilesByIdsRepository: GetFilesByIdsRepository
  let getFileStreamFromStorageService: GetFileStreamFromStorageService

  beforeEach(() => {
    getAlbumByIdRepository = {
      getById: jest.fn().mockResolvedValue(getAlbumByIdMock()),
    }
    getFilesByIdsRepository = {
      getByIds: jest
        .fn()
        .mockResolvedValue([getFileWithAlbumMock(), getFileWithAlbumMock()]),
    }
    getFileStreamFromStorageService = {
      getFileStream: jest.fn().mockResolvedValue(
        new Readable({
          read() {
            this.push('Any content')
            this.push(null) // Signal the end of the stream
          },
        }),
      ),
    }

    sut = new DownloadFilesUseCase(
      getAlbumByIdRepository,
      getFilesByIdsRepository,
      getFileStreamFromStorageService,
    )
  })

  it('should download files successfully', async () => {
    const getByIdSpy = jest.spyOn(getAlbumByIdRepository, 'getById')
    const getByIdsSpy = jest.spyOn(getFilesByIdsRepository, 'getByIds')
    const getFileStreamSpy = jest.spyOn(
      getFileStreamFromStorageService,
      'getFileStream',
    )

    const result = await sut.execute({
      albumId: 'any-album-id',
      userId: 'user-id',
      filesIds: ['file-id', 'file-id-1'],
      archiver: {
        append: jest.fn(),
      } as any,
    })

    expect(result.ok).toBe(true)
    expect(result.data).toBe(null)
    expect(getByIdSpy).toHaveBeenCalledWith('any-album-id', 'user-id')
    expect(getByIdsSpy).toHaveBeenCalledWith(
      ['file-id', 'file-id-1'],
      'user-id',
    )
    expect(getFileStreamSpy).toHaveBeenCalledTimes(2)
  })

  it('should not download files if album doesnot exists', async () => {
    getAlbumByIdRepository.getById = jest.fn().mockResolvedValueOnce(null)

    const result = await sut.execute({
      albumId: 'any-album-id',
      userId: 'user-id',
      filesIds: ['file-id', 'file-id-1'],
      archiver: null as any,
    })

    expect(result.ok).toBe(false)
    expect(result.message).toBe('Album not found')
  })

  it('should not download files if any of the requested files does not belong to the current user', async () => {
    const modifiedFileWithAlbumMock = getFileWithAlbumMock()
    modifiedFileWithAlbumMock.album.userId = 'other-user-id'

    getFilesByIdsRepository.getByIds = jest
      .fn()
      .mockResolvedValue([getFileWithAlbumMock(), modifiedFileWithAlbumMock])

    const result = await sut.execute({
      albumId: 'any-album-id',
      userId: 'user-id',
      filesIds: ['file-id', 'file-id-1'],
      archiver: null as any,
    })

    expect(result.ok).toBe(false)
    expect(result.message).toBe(
      'You do not have permission to perform this action',
    )
  })

  it('should pass along any unknown error', async () => {
    getAlbumByIdRepository.getById = jest
      .fn()
      .mockRejectedValueOnce(new Error('any-error'))

    const result = sut.execute({
      albumId: 'any-album-id',
      userId: 'user-id',
      filesIds: ['file-id', 'file-id-1'],
      archiver: null as any,
    })

    await expect(result).rejects.toThrow('any-error')
  })
})
