import { DomainError, Album } from '@/domain/entity'

describe('Album Entity', () => {
  it('should create a new album', () => {
    const album = new Album({
      name: 'photos',
      userId: 'user-id',
      createdAt: '2021-01-01T00:00:00.000Z' as unknown as Date,
      updatedAt: '2021-01-01T00:00:00.000Z' as unknown as Date
    })

    expect(album.id).toBeDefined()
    expect(album.name).toBe('photos')
    expect(album.userId).toBe('user-id')
    expect(album.createdAt).toBe('2021-01-01T00:00:00.000Z')
    expect(album.updatedAt).toBe('2021-01-01T00:00:00.000Z')
  })

  it('should not be able to create a new Album with any missing params', () => {
    expect(() => {
      new Album({
        createdAt: '2021-01-01T00:00:00.000Z',
        updatedAt: '2021-01-01T00:00:00.000Z'
      } as any)
    }).toThrow(new DomainError('fields name, userId can not be empty'))
  })

  it('should not be able to create a album with an invalid length name', () => {
    expect(() => {
      new Album({
        name: 'A',
        isMain: false,
        userId: 'user-id',
        isDeleted: true,
        createdAt: '2021-01-01T00:00:00.000Z',
        updatedAt: '2021-01-01T00:00:00.000Z'
      } as any)
    }).toThrow(new DomainError('Name must be between 2 and 50 characters'))
  })
})
