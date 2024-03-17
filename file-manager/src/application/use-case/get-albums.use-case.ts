import { type UseCaseResponse } from '../interface'
import { type GetAlbumsRepository } from '../protocol'

export class GetAlbumsUseCase {
  constructor(
    private readonly getAlbumsRepository: GetAlbumsRepository
  ) {}

  async execute(userId: string): Promise<UseCaseResponse> {
    const albums = await this.getAlbumsRepository.getAll(userId)

    const formattedAlbums = albums.map(album => ({
      id: album.id,
      name: album.name,
      isMain: album.isMain
    }))

    return {
      ok: true,
      data: formattedAlbums
    }
  }
}
