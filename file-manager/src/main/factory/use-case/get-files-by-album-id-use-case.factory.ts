import { type GetFilesByAlbumIdRepository, type GetAlbumByIdRepository, type GetFileUrlService } from '@/application/protocol'
import { GetFilesByAlbumIdUseCase } from '@/application/use-case'

export const generateGetFilesByAlbumIdUseCase = (
  getFilesByAlbumIdRepository: GetFilesByAlbumIdRepository,
  getAlbumByIdRepository: GetAlbumByIdRepository,
  getFileUrlService: GetFileUrlService
) => {
  return new GetFilesByAlbumIdUseCase(
    getFilesByAlbumIdRepository,
    getAlbumByIdRepository,
    getFileUrlService
  )
}
