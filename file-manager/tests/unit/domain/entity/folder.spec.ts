import { DomainError, Folder } from '@/domain/entity'

describe('Folder Entity', () => {
  it('should create a new folder', () => {
    const file = new Folder({
      name: 'photos',
      parentId: 'folder-id',
      userId: 'user-id',
      isDeleted: true,
      createdAt: '2021-01-01T00:00:00.000Z',
      updatedAt: '2021-01-01T00:00:00.000Z'
    })

    expect(file.id).toBeDefined()
    expect(file.name).toBe('photos')
    expect(file.parentId).toBe('folder-id')
    expect(file.userId).toBe('user-id')
    expect(file.isDeleted).toBe(true)
    expect(file.createdAt).toBe('2021-01-01T00:00:00.000Z')
    expect(file.updatedAt).toBe('2021-01-01T00:00:00.000Z')
  })

  it('should not be able to create a new folder with any missing params', () => {
    expect(() => {
      new Folder({
        createdAt: '2021-01-01T00:00:00.000Z',
        updatedAt: '2021-01-01T00:00:00.000Z'
      } as any)
    }).toThrow(new DomainError('fields name, parentId, userId, isDeleted can not be empty'))
  })

  it('should not be able to create a folder with an invalid length name', () => {
    expect(() => {
      new Folder({
        name: 'AAA',
        parentId: 'folder-id',
        userId: 'user-id',
        isDeleted: true,
        createdAt: '2021-01-01T00:00:00.000Z',
        updatedAt: '2021-01-01T00:00:00.000Z'
      } as any)
    }).toThrow(new DomainError('Name must be between 5 and 50 characters'))
  })
})
