import { type GetFilesByAlbumIdRepository, type GetAlbumByIdRepository } from '@/application/protocol'
import { GetFilesByAlbumIdUseCase } from '@/application/use-case'

export const generateGetFilesByAlbumIdUseCase = (
  getFilesByAlbumIdRepository: GetFilesByAlbumIdRepository,
  getAlbumByIdRepository: GetAlbumByIdRepository
) => {
  return new GetFilesByAlbumIdUseCase(
    getFilesByAlbumIdRepository,
    getAlbumByIdRepository
  )
}
