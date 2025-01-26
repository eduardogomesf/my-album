import { api } from '../lib/axios'

type DownloadFilesParams = {
  albumId: string
  filesIds: string[]
}

export async function downloadFiles(payload: DownloadFilesParams) {
  const response = await api.post(
    '/file-management/api/v1/files/download',
    payload,
    {
      responseType: 'blob',
    },
  )
  return response.data
}
