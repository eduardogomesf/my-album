import { api } from '../lib/axios'

type DownloadFilesParams = {
  albumId: string
  filesIds: string[]
}

export async function downloadFiles(payload: DownloadFilesParams) {
  const response = await api.post('/files/download', payload, {
    responseType: 'blob',
  })
  return response.data
}
