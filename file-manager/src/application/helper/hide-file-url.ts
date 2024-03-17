import { ENVS } from '@/shared'

interface HideFileUrlParams {
  url: string
  fileId: string
  albumId: string
}

export const hideFileUrl = (params: HideFileUrlParams) => {
  return `${ENVS.APP.URL}/albums/${params.albumId}/files/${params.fileId}`
}
