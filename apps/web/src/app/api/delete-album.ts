import { api } from '../lib/axios'

interface DeleteAlbumParams {
  albumId: string
}

export function deleteAlbum(params: DeleteAlbumParams) {
  return api.delete(`/file-management/api/v1/albums/${params.albumId}`)
}
