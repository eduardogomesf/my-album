import { 
  type GetFileUrlService, 
  type GetLastPhotoByAlbumIdRepository, 
  type GetAlbumsByStatusRepository
} from '@/application/protocol'
import { GetAlbumsUseCase } from '@/application/use-case'

export const generateGetAlbumsUseCase = (
  getAlbumsByStatusRepository: GetAlbumsByStatusRepository,
  getLastPhotoByAlbumIdRepository: GetLastPhotoByAlbumIdRepository,
  getFileUrlService: GetFileUrlService
) => {
  return new GetAlbumsUseCase(getAlbumsByStatusRepository, getLastPhotoByAlbumIdRepository, getFileUrlService)
}
