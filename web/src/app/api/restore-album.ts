import { api } from '../lib/axios'

interface RestoreAlbumParams {
  albumId: string
}

export function restoreAlbum(params: RestoreAlbumParams) {
  return api.patch(`/albums/${params.albumId}/restore`)
}
