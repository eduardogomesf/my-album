import { AlbumStatus } from '@/domain/enum'
import { type UseCase, type UseCaseResponse } from '../../interface'
import { type GetAlbumsByStatusRepository } from '../../protocol'

interface GetDeletedAlbumsUseCaseParams {
  userId: string
}

export class GetDeletedAlbumsUseCase implements UseCase {
  constructor(
    private readonly getAlbumsByStatusRepository: GetAlbumsByStatusRepository
  ) {}

  async execute (params: GetDeletedAlbumsUseCaseParams): Promise<UseCaseResponse> {
    const albums = await this.getAlbumsByStatusRepository.getManyByStatus(
      params.userId,
      AlbumStatus.DELETED
    )

    const formattedAlbums = albums.map(album => ({
      id: album.id,
      name: album.name,
      updatedAt: album.updatedAt
    }))

    return {
      ok: true,
      data: formattedAlbums
    }
  }
}
