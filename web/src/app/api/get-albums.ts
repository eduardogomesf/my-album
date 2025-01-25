import { api } from '../lib/axios'

export interface Album {
  id: string
  name: string
  numberOfPhotos: number
  numberOfVideos: number
  updatedAt: string
  coverUrl?: string
}

export async function getAlbums(onlyDeleted = false): Promise<Album[]> {
  const response = await api.get('/file-management/api/v1/albums', {
    params: {
      deletedAlbumsOnly: onlyDeleted,
    },
  })

  return response.data
}
