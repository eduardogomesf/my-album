import { AlbumStatus } from '@/domain/enum'
import { type UseCase, type UseCaseResponse } from '../../interface'
import { type GetAlbumsByStatusRepository } from '../../protocol'

export class GetActiveAlbumsUseCase implements UseCase {
  constructor(
    private readonly getAlbumsByStatusRepository: GetAlbumsByStatusRepository
  ) {}

  async execute(userId: string): Promise<UseCaseResponse> {
    const albums = await this.getAlbumsByStatusRepository.getManyByStatus(userId, AlbumStatus.ACTIVE)

    const formattedAlbums = albums.map(album => ({
      id: album.id,
      name: album.name
    }))

    return {
      ok: true,
      data: formattedAlbums
    }
  }
}
