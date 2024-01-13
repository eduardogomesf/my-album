import { DomainError, File } from '@/domain/entity'

describe('File Entity', () => {
  it('should create a new file', () => {
    const file = new File({
      name: 'file.txt',
      directoryPath: 'directoryPath/to/file.txt',
      size: 1024,
      extension: 'txt',
      userId: 'user-id',
      encoding: 'utf-8',
      type: 'text/plain',
      createdAt: '2021-01-01T00:00:00.000Z',
      updatedAt: '2021-01-01T00:00:00.000Z'
    })

    expect(file.id).toBeDefined()
    expect(file.name).toBe('file.txt')
    expect(file.directoryPath).toBe('directoryPath/to/file.txt')
    expect(file.size).toBe(1024)
    expect(file.extension).toBe('txt')
    expect(file.userId).toBe('user-id')
    expect(file.createdAt).toBe('2021-01-01T00:00:00.000Z')
    expect(file.updatedAt).toBe('2021-01-01T00:00:00.000Z')
  })

  it('should not be able to create a new file with any missing params', () => {
    expect(() => {
      new File({
        createdAt: '2021-01-01T00:00:00.000Z',
        updatedAt: '2021-01-01T00:00:00.000Z'
      } as any)
    }).toThrow(new DomainError('fields name, directoryPath, size, extension, userId, type, encoding can not be empty'))
  })
})
