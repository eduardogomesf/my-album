import { type UseCaseResponse } from '../interface'
import { type GetAlbumsRepository } from '../protocol'

export class GetAlbumsUseCase {
  constructor(
    private readonly getAlbumsRepository: GetAlbumsRepository
  ) {}

  async execute(userId: string): Promise<UseCaseResponse> {
    const albums = await this.getAlbumsRepository.getAll(userId)

    return {
      ok: true,
      data: albums
    }
  }
}
