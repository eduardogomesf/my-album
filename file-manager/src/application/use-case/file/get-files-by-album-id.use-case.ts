import { Logger } from '@/shared'
import { ERROR_MESSAGES } from '../../constant'
import { type UseCase, type UseCaseResponse } from '../../interface'
import { type GetFilesUrlsService, type GetAlbumByIdRepository, type GetFilesByAlbumIdRepository } from '../../protocol'

export interface GetFilesFilters {
  page: number
  limit: number
}
interface GetFilesByAlbumIdUseCaseParams {
  albumId: string
  userId: string
  filters: GetFilesFilters
}

export class GetFilesByAlbumIdUseCase implements UseCase {
  private readonly logger = new Logger(GetFilesByAlbumIdUseCase.name)

  constructor(
    private readonly getFilesByAlbumIdRepository: GetFilesByAlbumIdRepository,
    private readonly getAlbumByIdRepository: GetAlbumByIdRepository,
    private readonly getFilesUrlsService: GetFilesUrlsService
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

    const filters = this.handleFilters(params.filters)

    const files = await this.getFilesByAlbumIdRepository.getManyWithFilters(
      params.albumId,
      filters
    )

    const filesWithUrls = await this.getFilesUrlsService.getFilesUrls(files, params.userId)

    return {
      ok: true,
      data: filesWithUrls
    }
  }

  private handleFilters(rawFilters: GetFilesFilters): GetFilesFilters {
    return {
      limit: rawFilters?.limit ? rawFilters?.limit : 20,
      page: rawFilters?.page ? rawFilters?.page : 1
    }
  }
}
