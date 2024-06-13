import { ENVS } from '@/shared'

export const isValidFileExtension = (extension: string): boolean => {
  const allowedExtensions = ENVS.FILE_CONFIGS.ALLOWED_EXTENSIONS

  return !!allowedExtensions.find(allowedExt => allowedExt.toLocaleLowerCase() === extension.toLocaleLowerCase())
}
