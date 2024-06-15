import { DomainError, File } from '@/domain/entity'

describe('File Entity', () => {
  it('should create a new file', () => {
    const file = new File({
      name: 'file.png',
      size: 1024,
      extension: 'png',
      type: 'image',
      uploaded: false,
      mimeType: 'image/png',
      albumId: 'album-id',
      createdAt: '2021-01-01T00:00:00.000Z' as unknown as Date,
      updatedAt: '2021-01-01T00:00:00.000Z' as unknown as Date
    })

    expect(file.id).toBeDefined()
    expect(file.name).toBe('file.png')
    expect(file.size).toBe(1024)
    expect(file.extension).toBe('png')
    expect(file.type).toBe('image')
    expect(file.uploaded).toBe(false)
    expect(file.mimeType).toBe('image/png')
    expect(file.albumId).toBe('album-id')
    expect(file.createdAt).toBe('2021-01-01T00:00:00.000Z')
    expect(file.updatedAt).toBe('2021-01-01T00:00:00.000Z')
  })

  it('should not be able to create a new file with any missing params', () => {
    expect(() => {
      new File({
        createdAt: '2021-01-01T00:00:00.000Z',
        updatedAt: '2021-01-01T00:00:00.000Z'
      } as any)
    }).toThrow(new DomainError('fields name, size, extension, type, albumId, mimeType can not be empty'))
  })

  it('should not be able to create a new file with invalid size', () => {
    expect(() => {
      new File({
        name: 'file.png',
        size: 0,
        extension: 'png',
        type: 'image/png',
        mimeType: 'image/png',
        uploaded: false,
        albumId: 'album-id',
        createdAt: '2021-01-01T00:00:00.000Z' as unknown as Date,
        updatedAt: '2021-01-01T00:00:00.000Z' as unknown as Date
      })
    }).toThrow(new DomainError('Size should be greater than 0'))
  })
})
