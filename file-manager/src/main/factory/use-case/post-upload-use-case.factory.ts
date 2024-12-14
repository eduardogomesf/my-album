import { PostUploadUseCase } from '@/application/use-case'
import {
  type MarkFilesAsUploadedRepository,
  type GetFilesByIdsAndAlbumIdRepository,
} from '@/application/protocol'

export const generatePostUploadUseCase = (
  getFilesByIdsAndAlbumIdRepository: GetFilesByIdsAndAlbumIdRepository,
  markFilesAsUploadedRepository: MarkFilesAsUploadedRepository,
) => {
  return new PostUploadUseCase(
    getFilesByIdsAndAlbumIdRepository,
    markFilesAsUploadedRepository,
  )
}
