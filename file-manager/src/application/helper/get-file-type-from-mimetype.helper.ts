import { FileType } from '../enum'

export function getFileTypeFromMimeType(mimeType: string): FileType {
  return mimeType.includes('image') ? FileType.IMAGE : FileType.VIDEO
}
