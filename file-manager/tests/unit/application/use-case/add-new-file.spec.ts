import { type AddNewFileParams, AddNewFileUseCase } from '@/application/use-case'
import { type GetCurrentStorageUsageRepository, type SaveFileStorageService, type SaveFileRepository } from '@/application/protocol/files'
import { type GetFolderByIdRepository } from '@/application/protocol'
import { getFolderByIdMock } from '../mock/folder.mock'

jest.mock('uuid', () => ({
  v4: () => 'any-id'
}))

describe('Add New File Use Case', () => {
  let sut: AddNewFileUseCase
  let mockGetCurrentStorageUsageRepository: GetCurrentStorageUsageRepository
  let mockGetFileStorageService: SaveFileStorageService
  let mockSaveFileRepository: SaveFileRepository
  let mockGetFolderByIdRepository: GetFolderByIdRepository

  let payload: AddNewFileParams = {} as any

  beforeEach(() => {
    mockGetCurrentStorageUsageRepository = { getUsage: jest.fn().mockResolvedValue({ usage: 0 }) }
    mockGetFileStorageService = { save: jest.fn().mockResolvedValue({ url: 'any-path' }) }
    mockSaveFileRepository = { save: jest.fn().mockResolvedValue(null) }
    mockGetFolderByIdRepository = { getById: jest.fn().mockResolvedValue(getFolderByIdMock()) }

    sut = new AddNewFileUseCase(
      mockGetCurrentStorageUsageRepository,
      mockGetFileStorageService,
      mockSaveFileRepository,
      mockGetFolderByIdRepository
    )

    payload = {
      name: 'my-test-file',
      size: 1000,
      type: 'text/plain',
      content: Buffer.from('any-content'),
      encoding: 'utf-8',
      extension: 'txt',
      userId: 'user-id',
      folderId: 'folder-id',
      mainFolderId: 'main-folder-id'
    }
  })

  it('should create a new file successfully', async () => {
    const result = await sut.add(payload)

    expect(result.ok).toBe(true)
    expect(result.data).toEqual({
      id: 'any-id',
      name: payload.name,
      size: payload.size,
      type: payload.type,
      encoding: payload.encoding,
      extension: payload.extension,
      userId: payload.userId,
      url: 'any-path',
      folderId: 'folder-id',
      mainFolderId: 'main-folder-id',
      isDeleted: false,
      createdAt: null,
      updatedAt: null
    })
  })

  it('should calls dependencies with correct input', async () => {
    const getFolderById = jest.spyOn(mockGetFolderByIdRepository, 'getById')
    const getUsageSpy = jest.spyOn(mockGetCurrentStorageUsageRepository, 'getUsage')
    const saveFileSpy = jest.spyOn(mockGetFileStorageService, 'save')
    const saveSpy = jest.spyOn(mockSaveFileRepository, 'save')

    await sut.add(payload)

    expect(getFolderById).toHaveBeenCalledTimes(2)
    expect(getUsageSpy).toHaveBeenCalledWith(payload.userId)
    expect(saveFileSpy).toHaveBeenCalledWith({
      name: payload.name,
      content: payload.content,
      encoding: payload.encoding,
      type: payload.type,
      userId: payload.userId
    })
    expect(saveSpy).toHaveBeenCalledWith({
      id: 'any-id',
      name: payload.name,
      size: payload.size,
      type: payload.type,
      encoding: payload.encoding,
      extension: payload.extension,
      folderId: 'folder-id',
      mainFolderId: 'main-folder-id',
      isDeleted: false,
      userId: payload.userId,
      url: 'any-path',
      createdAt: null,
      updatedAt: null
    })
  })

  it('should not add a file if folder does not exist', async () => {
    mockGetFolderByIdRepository.getById = jest.fn().mockResolvedValueOnce(getFolderByIdMock()).mockResolvedValueOnce(null)

    const result = await sut.add(payload)

    expect(result).toEqual({
      ok: false,
      message: 'Folder not found'
    })
  })

  it('should not add a file if folder is deleted', async () => {
    mockGetFolderByIdRepository.getById = jest.fn().mockResolvedValueOnce(getFolderByIdMock()).mockResolvedValueOnce({
      ...getFolderByIdMock(),
      isDeleted: true
    })

    const result = await sut.add(payload)

    expect(result).toEqual({
      ok: false,
      message: 'Folder not found'
    })
  })

  it('should not add a file if main folder does not exist', async () => {
    mockGetFolderByIdRepository.getById = jest.fn().mockResolvedValueOnce(null)

    const result = await sut.add(payload)

    expect(result).toEqual({
      ok: false,
      message: 'Main folder not found'
    })
  })

  it('should not add a file if main folder is deleted', async () => {
    mockGetFolderByIdRepository.getById = jest.fn().mockResolvedValueOnce({
      ...getFolderByIdMock(),
      isDeleted: true
    })

    const result = await sut.add(payload)

    expect(result).toEqual({
      ok: false,
      message: 'Main folder not found'
    })
  })

  it('should return nok if a domain error is thrown', async () => {
    const payload: any = {
      size: 1000,
      type: 'text/plain',
      content: Buffer.from('any-content'),
      encoding: 'utf-8',
      extension: 'txt',
      userId: 'user-id',
      folderId: 'folder-id',
      mainFolderId: 'main-folder-id'
    }

    const result = await sut.add(payload)

    expect(result.ok).toBe(false)
    expect(result.message).toBe('fields name can not be empty')
  })

  it('should return nok if an unsupported extension is provided', async () => {
    const payload: AddNewFileParams = {
      name: 'my-test-file',
      size: 1000,
      type: 'text/plain',
      content: Buffer.from('any-content'),
      encoding: 'utf-8',
      extension: 'js',
      userId: 'user-id',
      folderId: 'folder-id',
      mainFolderId: 'main-folder-id'
    }

    const result = await sut.add(payload)

    expect(result.ok).toBe(false)
    expect(result.message).toBe('Invalid extension')
  })

  it('should return nok if the file size is too large', async () => {
    const payload: AddNewFileParams = {
      name: 'my-test-file',
      size: 1000 * 1000 * 1000,
      type: 'text/plain',
      content: Buffer.from('any-content'),
      encoding: 'utf-8',
      extension: 'txt',
      userId: 'user-id',
      folderId: 'folder-id',
      mainFolderId: 'main-folder-id'
    }

    const result = await sut.add(payload)

    expect(result.ok).toBe(false)
    expect(result.message).toBe('The file is too large. Max 10MB')
  })

  it('should return nok if the size of the file is greater than the available storage space', async () => {
    mockGetCurrentStorageUsageRepository.getUsage = jest.fn().mockResolvedValueOnce({ usage: 1024 * 1024 * 49 })

    const payload: AddNewFileParams = {
      name: 'my-test-file',
      size: 1048577,
      type: 'text/plain',
      content: Buffer.from('any-content'),
      encoding: 'utf-8',
      extension: 'txt',
      userId: 'user-id',
      folderId: 'folder-id',
      mainFolderId: 'main-folder-id'
    }

    const result = await sut.add(payload)

    expect(result.ok).toBe(false)
    expect(result.message).toBe(`You don't have enough space. Free space: ${1048576} bytes`)
  })

  it('should pass along any unknown error', async () => {
    mockGetCurrentStorageUsageRepository.getUsage = jest.fn().mockRejectedValueOnce(new Error('any-error'))

    const payload: AddNewFileParams = {
      name: 'my-test-file',
      size: 1048577,
      type: 'text/plain',
      content: Buffer.from('any-content'),
      encoding: 'utf-8',
      extension: 'txt',
      userId: 'user-id',
      folderId: 'folder-id',
      mainFolderId: 'main-folder-id'
    }

    const result = sut.add(payload)

    await expect(result).rejects.toThrow('any-error')
  })
})
