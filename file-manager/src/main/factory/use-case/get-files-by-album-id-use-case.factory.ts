import {
  type GetFilesByAlbumIdRepository,
  type GetAlbumByIdRepository,
  type GetFileUrlService,
  type CountFilesByAlbumIdRepository,
} from '@/application/protocol'
import { GetFilesByAlbumIdUseCase } from '@/application/use-case'

export const generateGetFilesByAlbumIdUseCase = (
  getFilesByAlbumIdRepository: GetFilesByAlbumIdRepository,
  getAlbumByIdRepository: GetAlbumByIdRepository,
  getFileUrlService: GetFileUrlService,
  countFilesByAlbumIdRepository: CountFilesByAlbumIdRepository,
) => {
  return new GetFilesByAlbumIdUseCase(
    getFilesByAlbumIdRepository,
    getAlbumByIdRepository,
    getFileUrlService,
    countFilesByAlbumIdRepository,
  )
}
