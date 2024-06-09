import { api } from "../lib/axios"

interface UploadFileParams {
  file: File
  albumId: string
}

export function uploadFile(params: UploadFileParams) {
  const formData = new FormData()
  
  formData.append('file', params.file)
  formData.append('albumId', params.albumId)

  return api.post('/files', formData)
}