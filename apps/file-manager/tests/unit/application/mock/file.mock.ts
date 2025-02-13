export const getFileMock = () => ({
  id: 'any-id',
  name: 'any-file',
  size: 1000,
  type: 'image/jpeg',
  extension: 'jpeg',
  albumId: 'any-album-id',
  url: 'www.any-url.com',
  status: 'ACTIVE',
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
})

export const getFileWithAlbumMock = () => ({
  id: 'any-id',
  name: 'any-file',
  size: 1000,
  type: 'image/jpeg',
  extension: 'jpeg',
  albumId: 'any-album-id',
  url: 'www.any-url.com',
  status: 'ACTIVE',
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
  album: {
    id: 'any-id',
    name: 'any-name',
    isMain: true,
    isDeleted: false,
    status: 'ACTIVE',
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
    userId: 'user-id',
  },
})
