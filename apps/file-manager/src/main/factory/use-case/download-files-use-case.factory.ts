import { DownloadFilesUseCase } from '@/application/use-case'
import {
  type GetAlbumByIdRepository,
  type GetFilesByIdsRepository,
  type GetFileStreamFromStorageService,
} from '@/application/protocol'

export const generateDownloadFilesUseCase = (
  getAlbumByIdRepository: GetAlbumByIdRepository,
  getFilesByIdsRepository: GetFilesByIdsRepository,
  getFileStreamFromStorageService: GetFileStreamFromStorageService,
) => {
  return new DownloadFilesUseCase(
    getAlbumByIdRepository,
    getFilesByIdsRepository,
    getFileStreamFromStorageService,
  )
}
