import { MoveFilesToOtherAlbum } from '@/application/use-case'
import {
  type MoveFilesToAlbumByFilesIdsRepository,
  type GetAlbumByIdRepository
} from '@/application/protocol'
import { getAlbumByIdMock } from '../mock'

describe('Moves file to other album Use Case', () => {
  let sut: MoveFilesToOtherAlbum
  let mockGetAlbumByIdRepository: GetAlbumByIdRepository
  let moveFilesByFilesIdsRepository: MoveFilesToAlbumByFilesIdsRepository

  beforeEach(() => {
    mockGetAlbumByIdRepository = { getById: jest.fn().mockResolvedValueOnce(getAlbumByIdMock()) }
    moveFilesByFilesIdsRepository = { moveFiles: jest.fn().mockResolvedValue(null) }

    sut = new MoveFilesToOtherAlbum(
      mockGetAlbumByIdRepository,
      moveFilesByFilesIdsRepository
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
