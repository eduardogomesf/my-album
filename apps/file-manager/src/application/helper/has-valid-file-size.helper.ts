import { ENVS } from '@/shared'
import { megaBytesToBytes } from './mb-to-bytes.helper'

export const hasValidFileSize = (size: number): boolean => {
  const allowedSize = megaBytesToBytes(ENVS.FILE_CONFIGS.MAX_FILE_SIZE_IN_MB)

  return size <= allowedSize
}
