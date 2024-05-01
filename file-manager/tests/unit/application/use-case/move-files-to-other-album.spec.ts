import { MoveFilesToOtherAlbumUseCase } from '@/application/use-case'
import {
  type MoveFilesToAlbumByFilesIdsRepository,
  type GetAlbumByIdRepository,
  type GetFilesByIdsRepository
} from '@/application/protocol'
import { getAlbumByIdMock } from '../mock'

describe('Moves file to other album Use Case', () => {
  let sut: MoveFilesToOtherAlbumUseCase
  let mockGetAlbumByIdRepository: GetAlbumByIdRepository
  let moveFilesByFilesIdsRepository: MoveFilesToAlbumByFilesIdsRepository
  let getFilesByIdsRepository: GetFilesByIdsRepository

  beforeEach(() => {
    mockGetAlbumByIdRepository = { getById: jest.fn().mockResolvedValueOnce(getAlbumByIdMock()) }
    moveFilesByFilesIdsRepository = { moveFiles: jest.fn().mockResolvedValue(null) }
    getFilesByIdsRepository = {
      getByIds: jest.fn().mockResolvedValue([{
        ...getAlbumByIdMock(),
        album: getAlbumByIdMock()
      }])
    }

    sut = new MoveFilesToOtherAlbumUseCase(
      mockGetAlbumByIdRepository,
      moveFilesByFilesIdsRepository,
      getFilesByIdsRepository
    )
  })

  it('should move files successfully', async () => {
    const result = await sut.execute({
      userId: 'user-id',
      targetAlbumId: 'album-id',
      filesIds: ['file-id', 'file-id-2']
    })

    expect(result.ok).toBe(true)
  })

  it('should calls dependencies with correct input', async () => {
    const getAlbumByIdSpy = jest.spyOn(mockGetAlbumByIdRepository, 'getById')
    const moveFilesSpy = jest.spyOn(moveFilesByFilesIdsRepository, 'moveFiles')
    const getFilesByIdsSpy = jest.spyOn(getFilesByIdsRepository, 'getByIds')

    await sut.execute({
      userId: 'user-id',
      targetAlbumId: 'album-id',
      filesIds: ['file-id', 'file-id-2']
    })

    expect(getAlbumByIdSpy).toHaveBeenCalledWith('album-id', 'user-id')
    expect(moveFilesSpy).toHaveBeenCalledWith({
      targetAlbumId: 'album-id',
      filesIds: ['file-id', 'file-id-2'],
      userId: 'user-id'
    })
    expect(getFilesByIdsSpy).toHaveBeenCalledWith(['file-id', 'file-id-2'], 'user-id')
  })

  it('should not move files if target album does not exist', async () => {
    mockGetAlbumByIdRepository.getById = jest.fn().mockResolvedValueOnce(null)

    const result = await sut.execute({
      targetAlbumId: 'album-id',
      filesIds: ['file-id', 'file-id-2'],
      userId: 'user-id'
    })

    expect(result).toEqual({
      ok: false,
      message: 'Album not found'
    })
  })

  it('should not move files if target album is deleted', async () => {
    mockGetAlbumByIdRepository.getById = jest.fn().mockResolvedValueOnce({
      ...getAlbumByIdMock(),
      status: 'DELETED'
    })

    const result = await sut.execute({
      targetAlbumId: 'album-id',
      filesIds: ['file-id', 'file-id-2'],
      userId: 'user-id'
    })

    expect(result).toEqual({
      ok: false,
      message: 'Cannot move files to a deleted album'
    })
  })

  it('should not move files if user does not have permission', async () => {
    getFilesByIdsRepository.getByIds = jest.fn().mockResolvedValueOnce([{
      ...getAlbumByIdMock(),
      album: { ...getAlbumByIdMock(), userId: 'another-user-id' }
    }])

    const result = await sut.execute({
      targetAlbumId: 'album-id',
      filesIds: ['file-id', 'file-id-2'],
      userId: 'user-id'
    })

    expect(result).toEqual({
      ok: false,
      message: 'You do not have permission to perform this action'
    })
  })

  it('should pass along any unknown error', async () => {
    mockGetAlbumByIdRepository.getById = jest.fn().mockRejectedValueOnce(new Error('any-error'))

    const result = sut.execute({
      targetAlbumId: 'album-id',
      filesIds: ['file-id', 'file-id-2'],
      userId: 'user-id'
    })

    await expect(result).rejects.toThrow('any-error')
  })
})
