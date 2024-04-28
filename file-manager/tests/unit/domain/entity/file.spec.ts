import { DomainError, File } from '@/domain/entity'

describe('File Entity', () => {
  it('should create a new file', () => {
    const file = new File({
      name: 'file.txt',
      status: 'ACTIVE' as any,
      size: 1024,
      extension: 'txt',
      encoding: 'utf-8',
      type: 'text/plain',
      albumId: 'album-id',
      createdAt: '2021-01-01T00:00:00.000Z' as unknown as Date,
      updatedAt: '2021-01-01T00:00:00.000Z' as unknown as Date
    })

    expect(file.id).toBeDefined()
    expect(file.status).toBe('ACTIVE')
    expect(file.name).toBe('file.txt')
    expect(file.albumId).toBe('album-id')
    expect(file.size).toBe(1024)
    expect(file.extension).toBe('txt')
    expect(file.createdAt).toBe('2021-01-01T00:00:00.000Z')
    expect(file.updatedAt).toBe('2021-01-01T00:00:00.000Z')
  })

  it('should not be able to create a new file with any missing params', () => {
    expect(() => {
      new File({
        createdAt: '2021-01-01T00:00:00.000Z',
        updatedAt: '2021-01-01T00:00:00.000Z'
      } as any)
    }).toThrow(new DomainError('fields name, size, extension, type, encoding, albumId can not be empty'))
  })
})
