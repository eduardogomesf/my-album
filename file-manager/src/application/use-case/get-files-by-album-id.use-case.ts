import { Logger } from '../../shared'
import { ERROR_MESSAGES } from '../constant'
import { hideUrl } from '../helper'
import { type UseCase, type UseCaseResponse } from '../interface'
import { type GetAlbumByIdRepository, type GetFilesByAlbumIdRepository } from '../protocol'

interface GetFilesByAlbumIdUseCaseParams {
  albumId: string
  userId: string
}

export class GetFilesByAlbumIdUseCase implements UseCase {
  private readonly logger = new Logger(GetFilesByAlbumIdUseCase.name)

  constructor(
    private readonly getFilesByAlbumIdRepository: GetFilesByAlbumIdRepository,
    private readonly getAlbumByIdRepository: GetAlbumByIdRepository
  ) {}

  async execute(params: GetFilesByAlbumIdUseCaseParams): Promise<UseCaseResponse> {
    this.logger.verbose(`Getting files by album id: ${params.albumId} and user id: ${params.userId}`)

    const albumById = await this.getAlbumByIdRepository.getById(params.albumId, params.userId)

    if (!albumById) {
      return {
        ok: false,
        message: ERROR_MESSAGES.ALBUM.NOT_FOUND
      }
    }

    const files = await this.getFilesByAlbumIdRepository.getManyById(params.albumId, params.userId)

    const filesWithHiddenURL = files.map((file) => hideUrl(file))

    return {
      ok: true,
      data: filesWithHiddenURL
    }
  }
}
