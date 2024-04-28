import { AddNewAlbumUseCase } from '@/application/use-case'
import { type GetUserByIdRepository, type GetAlbumByNameRepository, type SaveAlbumRepository } from '@/application/protocol'
import { getAlbumByIdMock } from '../mock/album.mock'

jest.mock('uuid', () => ({
  v4: () => 'any-id'
}))

describe('Add New Album Use Case', () => {
  let sut: AddNewAlbumUseCase
  let mockGetUserByIdRepository: GetUserByIdRepository
  let mockGetAlbumByNameRepository: GetAlbumByNameRepository
  let mockSaveAlbumRepository: SaveAlbumRepository

  beforeEach(() => {
    mockGetUserByIdRepository = { getById: jest.fn().mockResolvedValueOnce({ id: 'user-id' }) }
    mockGetAlbumByNameRepository = { getByName: jest.fn().mockResolvedValueOnce(null) }
    mockSaveAlbumRepository = { save: jest.fn() }

    sut = new AddNewAlbumUseCase(
      mockGetUserByIdRepository,
      mockGetAlbumByNameRepository,
      mockSaveAlbumRepository
    )
  })

  it('should create a new album successfully', async () => {
    const result = await sut.execute({
      name: 'any-name',
      userId: 'user-id'
    })

    expect(result.ok).toBe(true)
  })

  it('should calls dependencies with correct input', async () => {
    const getUserByIdSpy = jest.spyOn(mockGetUserByIdRepository, 'getById')
    const getAlbumByNameSpy = jest.spyOn(mockGetAlbumByNameRepository, 'getByName')
    const saveAlbumSpy = jest.spyOn(mockSaveAlbumRepository, 'save')

    await sut.execute({
      name: 'any-name',
      userId: 'user-id'
    })

    expect(getUserByIdSpy).toHaveBeenCalledWith('user-id')
    expect(getAlbumByNameSpy).toHaveBeenCalledWith('any-name', 'user-id')
    expect(saveAlbumSpy).toHaveBeenCalledWith({
      id: 'any-id',
      name: 'any-name',
      userId: 'user-id',
      status: 'ACTIVE',
      createdAt: null,
      updatedAt: null
    })
  })

  it('should not add an album if user does not exist', async () => {
    mockGetUserByIdRepository.getById = jest.fn().mockResolvedValueOnce(null)

    const result = await sut.execute({
      name: 'any-name',
      userId: 'user-id'
    })

    expect(result).toEqual({
      ok: false,
      message: 'User not found'
    })
  })

  it('should not add an album if album already exists', async () => {
    mockGetAlbumByNameRepository.getByName = jest.fn().mockResolvedValueOnce({
      ...getAlbumByIdMock()
    })

    const result = await sut.execute({
      name: 'any-name',
      userId: 'user-id'
    })

    expect(result).toEqual({
      ok: false,
      message: 'Album already exists'
    })
  })

  it('should pass along any unknown error', async () => {
    mockGetAlbumByNameRepository.getByName = jest.fn().mockRejectedValueOnce(new Error('any-error'))

    const result = sut.execute({
      name: 'any-name',
      userId: 'user-id'
    })

    await expect(result).rejects.toThrow('any-error')
  })
})
