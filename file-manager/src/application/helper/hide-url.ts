import { type File } from '@/domain/entity'
import { ENVS } from '../../shared'

export const hideUrl = (file: File) => {
  return {
    ...file,
    url: `${ENVS.APP.URL}/albums/${file.albumId}/files/${file.id}`
  }
}
