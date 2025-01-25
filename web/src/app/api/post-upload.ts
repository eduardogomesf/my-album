import { api } from '../lib/axios'

export interface PostUploadUseCaseParams {
  filesIds: string[]
  albumId: string
}

export async function postUpload(params: PostUploadUseCaseParams) {
  const response = await api.post(
    '/file-management/api/v1/files/post-upload',
    params,
  )

  return response.data
}
