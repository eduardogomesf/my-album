import { MoveFilesToAlbumUseCase } from '@/application/use-case'
import { type UpdateFileRepository, type GetFilesByIdsRepository } from '@/application/protocol/files'
import { type GetAlbumByIdRepository } from '@/application/protocol'
import { getAlbumByIdMock } from '../mock/album.mock'
import { getFileMock } from '../mock'

jest.mock('uuid', () => ({
  v4: () => 'any-id'
}))

describe('Move files to album Use Case', () => {
  let sut: MoveFilesToAlbumUseCase
  let mockGetAlbumByIdRepository: GetAlbumByIdRepository
  let mockGetFilesByIdsRepository: GetFilesByIdsRepository
  let mockUpdateFileRepository: UpdateFileRepository

  beforeEach(() => {
    mockGetAlbumByIdRepository = { getById: jest.fn().mockResolvedValue(getAlbumByIdMock()) }
    mockGetFilesByIdsRepository = {
      getByIds: jest.fn().mockResolvedValue([
        getFileMock(),
        getFileMock()
      ])
    }
    mockUpdateFileRepository = { update: jest.fn() }

    sut = new MoveFilesToAlbumUseCase(
      mockGetAlbumByIdRepository,
      mockGetFilesByIdsRepository,
      mockUpdateFileRepository
    )
  })

  it('should create a new file successfully', async () => {
    const result = await sut.execute({
      sourceAlbumId: 'source-album-id',
      destinationAlbumId: 'destination-album-id',
      fileIds: ['file-id-1', 'file-id-2'],
      userId: 'user-id'
    })

    expect(result.ok).toBe(true)
    expect(result.data).toBeNull()
  })

  it('should calls dependencies with correct input', async () => {
    const getAlbumByIdSpy = jest.spyOn(mockGetAlbumByIdRepository, 'getById')
    const getByIdsSpy = jest.spyOn(mockGetFilesByIdsRepository, 'getByIds')
    const updateSpy = jest.spyOn(mockUpdateFileRepository, 'update')

    await sut.execute({
      sourceAlbumId: 'source-album-id',
      destinationAlbumId: 'destination-album-id',
      fileIds: ['file-id-1', 'file-id-2'],
      userId: 'user-id'
    })

    expect(getAlbumByIdSpy).toHaveBeenCalledTimes(2)
    expect(getAlbumByIdSpy).toHaveBeenNthCalledWith(1, 'source-album-id', 'user-id')
    expect(getAlbumByIdSpy).toHaveBeenNthCalledWith(2, 'destination-album-id', 'user-id')
    expect(getByIdsSpy).toHaveBeenCalledWith(['file-id-1', 'file-id-2'], 'source-album-id')
    expect(updateSpy).toHaveBeenCalledTimes(2)
    expect(updateSpy).toHaveBeenNthCalledWith(1, expect.objectContaining({ albumId: 'destination-album-id' }))
    expect(updateSpy).toHaveBeenNthCalledWith(2, expect.objectContaining({ albumId: 'destination-album-id' }))
  })

  it('should not move files if source album does not exist', async () => {
    mockGetAlbumByIdRepository.getById = jest.fn().mockResolvedValueOnce(null)

    const result = await sut.execute({
      sourceAlbumId: 'source-album-id',
      destinationAlbumId: 'destination-album-id',
      fileIds: ['file-id-1', 'file-id-2'],
      userId: 'user-id'
    })

    expect(result).toEqual({
      ok: false,
      message: 'Source album not found'
    })
  })
  it('should not move files if source album is marked to be deleted', async () => {
    mockGetAlbumByIdRepository.getById = jest.fn().mockResolvedValueOnce(
      { ...getAlbumByIdMock(), isDeleted: true }
    )

    const result = await sut.execute({
      sourceAlbumId: 'source-album-id',
      destinationAlbumId: 'destination-album-id',
      fileIds: ['file-id-1', 'file-id-2'],
      userId: 'user-id'
    })

    expect(result).toEqual({
      ok: false,
      message: 'Source album not found'
    })
  })

  it('should not move files if destination album does not exist', async () => {
    mockGetAlbumByIdRepository.getById = jest.fn().mockImplementation((param) => {
      if (param === 'source-album-id') return getAlbumByIdMock()
      return null
    })

    const result = await sut.execute({
      sourceAlbumId: 'source-album-id',
      destinationAlbumId: 'destination-album-id',
      fileIds: ['file-id-1', 'file-id-2'],
      userId: 'user-id'
    })

    expect(result).toEqual({
      ok: false,
      message: 'Destination album not found'
    })
  })
  it('should not move files if source album is marked to be deleted', async () => {
    mockGetAlbumByIdRepository.getById = jest.fn().mockImplementation((param) => {
      if (param === 'source-album-id') return getAlbumByIdMock()
      return { ...getAlbumByIdMock(), isDeleted: true }
    })

    const result = await sut.execute({
      sourceAlbumId: 'source-album-id',
      destinationAlbumId: 'destination-album-id',
      fileIds: ['file-id-1', 'file-id-2'],
      userId: 'user-id'
    })

    expect(result).toEqual({
      ok: false,
      message: 'Destination album not found'
    })
  })

  it('should pass along any unknown error', async () => {
    mockGetFilesByIdsRepository.getByIds = jest.fn().mockRejectedValueOnce(new Error('any-error'))

    const result = sut.execute({
      sourceAlbumId: 'source-album-id',
      destinationAlbumId: 'destination-album-id',
      fileIds: ['file-id-1', 'file-id-2'],
      userId: 'user-id'
    })

    await expect(result).rejects.toThrow('any-error')
  })
})
