import { AlbumStatus } from '@/domain/enum'
import {
  type GetAlbumsUseCaseParams,
  type GetAlbumsUseCaseResponse,
  type UseCase,
  type UseCaseResponse,
} from '../../interface'
import {
  type GetFileUrlService,
  type GetLastPhotoByAlbumIdRepository,
  type GetAlbumsByStatusRepository,
} from '../../protocol'

export class GetAlbumsUseCase implements UseCase {
  constructor(
    private readonly getAlbumsByStatusRepository: GetAlbumsByStatusRepository,
    private readonly getLastPhotoByAlbumIdRepository: GetLastPhotoByAlbumIdRepository,
    private readonly getFileUrlService: GetFileUrlService,
  ) {}

  async execute(
    params: GetAlbumsUseCaseParams,
  ): Promise<UseCaseResponse<GetAlbumsUseCaseResponse[]>> {
    const status = params.deletedAlbums
      ? AlbumStatus.DELETED
      : AlbumStatus.ACTIVE

    const albums = await this.getAlbumsByStatusRepository.getManyByStatus(
      params.userId,
      status,
    )

    const formattedAlbums: GetAlbumsUseCaseResponse[] = albums.map((album) => ({
      id: album.id,
      name: album.name,
      updatedAt: album.updatedAt ? new Date(album.updatedAt).toISOString() : '',
      numberOfPhotos: album.numberOfPhotos,
      numberOfVideos: album.numberOfVideos,
      coverUrl: '',
    }))

    for (const formattedAlbum of formattedAlbums) {
      if (formattedAlbum.numberOfPhotos > 0) {
        const lastPhoto =
          await this.getLastPhotoByAlbumIdRepository.getLastPhotoByAlbumId(
            formattedAlbum.id,
          )

        if (lastPhoto) {
          const url = await this.getFileUrlService.getFileUrl(
            lastPhoto,
            params.userId,
          )

          if (url) {
            formattedAlbum.coverUrl = url
          }
        }
      }
    }

    return {
      ok: true,
      data: formattedAlbums,
    }
  }
}
