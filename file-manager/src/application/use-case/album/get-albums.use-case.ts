import { type UseCase, type UseCaseResponse } from '../../interface'
import { type GetAlbumsRepository } from '../../protocol'

export class GetAlbumsUseCase implements UseCase {
  constructor(
    private readonly getAlbumsRepository: GetAlbumsRepository
  ) {}

  async execute(userId: string): Promise<UseCaseResponse> {
    const albums = await this.getAlbumsRepository.getAll(userId)

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
