import { AlbumStatus } from '@/domain/enum'
import { type GetActiveAlbumsUseCaseResponse, type UseCase, type UseCaseResponse } from '../../interface'
import { type GetAlbumsByStatusRepository } from '../../protocol'

export class GetActiveAlbumsUseCase implements UseCase {
  constructor(
    private readonly getAlbumsByStatusRepository: GetAlbumsByStatusRepository
  ) {}

  async execute(userId: string): Promise<UseCaseResponse<GetActiveAlbumsUseCaseResponse[]>> {
    const albums = await this.getAlbumsByStatusRepository.getManyByStatus(userId, AlbumStatus.ACTIVE)

    const formattedAlbums: GetActiveAlbumsUseCaseResponse[] = albums.map(album => ({
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
