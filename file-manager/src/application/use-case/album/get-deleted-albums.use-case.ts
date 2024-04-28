import { AlbumStatus } from '@/domain/enum'
import { type GetDeletedAlbumsUseCaseResponse, type UseCase, type UseCaseResponse } from '../../interface'
import { type GetAlbumsByStatusRepository } from '../../protocol'

interface GetDeletedAlbumsUseCaseParams {
  userId: string
}

export class GetDeletedAlbumsUseCase implements UseCase {
  constructor(
    private readonly getAlbumsByStatusRepository: GetAlbumsByStatusRepository
  ) {}

  async execute (params: GetDeletedAlbumsUseCaseParams): Promise<UseCaseResponse<GetDeletedAlbumsUseCaseResponse[]>> {
    const albums = await this.getAlbumsByStatusRepository.getManyByStatus(
      params.userId,
      AlbumStatus.DELETED
    )

    const formattedAlbums: GetDeletedAlbumsUseCaseResponse[] = albums.map(album => ({
      id: album.id,
      name: album.name,
      updatedAt: album.updatedAt ? new Date(album.updatedAt).toISOString() : ''
    }))

    return {
      ok: true,
      data: formattedAlbums
    }
  }
}
