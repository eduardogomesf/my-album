import { api } from '../lib/axios'

interface MoveFilesToAlbumParams {
  targetAlbumId: string
  filesIds: string[]
}

export async function moveFilesToAlbum(params: MoveFilesToAlbumParams) {
  const response = await api.put(`/file-management/api/v1/files/move`, {
    targetAlbumId: params.targetAlbumId,
    filesIds: params.filesIds,
  })

  return response.data
}
