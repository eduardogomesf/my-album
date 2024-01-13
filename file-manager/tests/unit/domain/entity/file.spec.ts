import { File } from '@/domain/entity'

describe('File Entity', () => {
  it('should create a new file', () => {
    const file = new File({
      name: 'file.txt',
      path: 'path/to/file.txt',
      size: 1024,
      extension: 'txt',
      userId: 'user-id',
      createdAt: '2021-01-01T00:00:00.000Z',
      updatedAt: '2021-01-01T00:00:00.000Z'
    })

    expect(file.id).toBeDefined()
    expect(file.name).toBe('file.txt')
    expect(file.path).toBe('path/to/file.txt')
    expect(file.size).toBe(1024)
    expect(file.extension).toBe('txt')
    expect(file.userId).toBe('user-id')
    expect(file.createdAt).toBe('2021-01-01T00:00:00.000Z')
    expect(file.updatedAt).toBe('2021-01-01T00:00:00.000Z')
  })

  it('should not be able to create a new file without a name', () => {
    expect(() => {
      new File({
        path: 'path/to/file.txt',
        size: 1024,
        extension: 'txt',
        userId: 'user-id',
        createdAt: '2021-01-01T00:00:00.000Z',
        updatedAt: '2021-01-01T00:00:00.000Z'
      } as any)
    }).toThrow('Name should not be empty')
  })

  it('should not be able to create a new file without a path', () => {
    expect(() => {
      new File({
        name: 'file.txt',
        size: 1024,
        extension: 'txt',
        userId: 'user-id',
        createdAt: '2021-01-01T00:00:00.000Z',
        updatedAt: '2021-01-01T00:00:00.000Z'
      } as any)
    }).toThrow('Path should not be empty')
  })

  it('should not be able to create a new file without a size', () => {
    expect(() => {
      new File({
        name: 'file.txt',
        path: 'path/to/file.txt',
        extension: 'txt',
        userId: 'user-id',
        createdAt: '2021-01-01T00:00:00.000Z',
        updatedAt: '2021-01-01T00:00:00.000Z'
      } as any)
    }).toThrow('Size should not be empty')
  })

  it('should not be able to create a new file without an extension', () => {
    expect(() => {
      new File({
        name: 'file.txt',
        path: 'path/to/file.txt',
        size: 1024,
        userId: 'user-id',
        createdAt: '2021-01-01T00:00:00.000Z',
        updatedAt: '2021-01-01T00:00:00.000Z'
      } as any)
    }).toThrow('Extension should not be empty')
  })

  it('should not be able to create a new file without a user ID', () => {
    expect(() => {
      new File({
        name: 'file.txt',
        path: 'path/to/file.txt',
        size: 1024,
        extension: 'txt',
        createdAt: '2021-01-01T00:00:00.000Z',
        updatedAt: '2021-01-01T00:00:00.000Z'
      } as any)
    }).toThrow('User ID should not be empty')
  })

  it('should not be able to create a new file with a size less than or equal to 0', () => {
    expect(() => {
      new File({
        name: 'file.txt',
        path: 'path/to/file.txt',
        size: -1,
        extension: 'txt',
        userId: 'user-id',
        createdAt: '2021-01-01T00:00:00.000Z',
        updatedAt: '2021-01-01T00:00:00.000Z'
      } as any)
    }).toThrow('Size should be greater than 0')
  })
})
