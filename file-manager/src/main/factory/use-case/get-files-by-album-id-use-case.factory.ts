import { type GetFilesByAlbumIdRepository, type GetAlbumByIdRepository, type GetFilesUrlsService } from '@/application/protocol'
import { GetFilesByAlbumIdUseCase } from '@/application/use-case'

export const generateGetFilesByAlbumIdUseCase = (
  getFilesByAlbumIdRepository: GetFilesByAlbumIdRepository,
  getAlbumByIdRepository: GetAlbumByIdRepository,
  getFilesUrlsService: GetFilesUrlsService
) => {
  return new GetFilesByAlbumIdUseCase(
    getFilesByAlbumIdRepository,
    getAlbumByIdRepository,
    getFilesUrlsService
  )
}
