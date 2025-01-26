import { api } from '../lib/axios'

interface RestoreAlbumParams {
  albumId: string
}

export function restoreAlbum(params: RestoreAlbumParams) {
  return api.patch(`/file-management/api/v1/albums/${params.albumId}/restore`)
}
