import { type SaveAlbumRepository, type GetUserByIdRepository, type GetAlbumByNameRepository } from '@/application/protocol'
import { AddNewAlbumUseCase } from '@/application/use-case'

export const generateAddNewAlbumUseCase = (
  getUserByIdRepository: GetUserByIdRepository,
  getAlbumByAlbumRepository: GetAlbumByNameRepository,
  saveAlbumRepository: SaveAlbumRepository
) => {
  return new AddNewAlbumUseCase(getUserByIdRepository, getAlbumByAlbumRepository, saveAlbumRepository)
}
