import axios from 'axios'
interface UploadFileParams {
  file: File
  url: string
  fields: Record<string, string>
}

export async function uploadFile(params: UploadFileParams) {
  const formData = new FormData()

  Object.entries(params.fields).forEach(([key, value]) => {
    formData.append(key, value)
  })
  formData.append('file', params.file)

  const response = await axios.post(
    params.url.replace('s3', 'localhost'),
    formData,
  )

  return response.data
}
