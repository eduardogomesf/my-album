import { AlbumStatus } from '@/domain/enum'
import { ERROR_MESSAGES } from '../../constant'
import {
  type GetFilesByAlbumIdUseCaseResponse,
  type GetFilesByAlbumIdUseCaseParams,
  type UseCase,
  type UseCaseResponse,
  type GetFilesByAlbumIdFilters,
  type GetFilesByAlbumIdFile
} from '../../interface'
import {
  type GetFileUrlService,
  type GetAlbumByIdRepository,
  type GetFilesByAlbumIdRepository,
  type CountFilesByAlbumIdRepository
} from '../../protocol'

export class GetFilesByAlbumIdUseCase implements UseCase {
  constructor(
    private readonly getFilesByAlbumIdRepository: GetFilesByAlbumIdRepository,
    private readonly getAlbumByIdRepository: GetAlbumByIdRepository,
    private readonly getFileUrlService: GetFileUrlService,
    private readonly countFilesByAlbumIdRepository: CountFilesByAlbumIdRepository
  ) {}

  async execute(params: GetFilesByAlbumIdUseCaseParams): Promise<UseCaseResponse<GetFilesByAlbumIdUseCaseResponse>> {
    const albumById = await this.getAlbumByIdRepository.getById(params.albumId, params.userId)

    if (!albumById) {
      return {
        ok: false,
        message: ERROR_MESSAGES.ALBUM.NOT_FOUND
      }
    }

    const filters = this.handleFilters(params.filters, albumById.status === AlbumStatus.ACTIVE)

    const [files, totalCountOfFiles] = await Promise.all([
      this.getFilesByAlbumIdRepository.getManyWithFilters(
        params.albumId,
        filters
      ),
      this.countFilesByAlbumIdRepository.countWithFilters(params.albumId)
    ])

    const filesWithUrls: GetFilesByAlbumIdFile[] = await Promise.all(files.map(async (file) => {
      const url = await this.getFileUrlService.getFileUrl(file, params.userId)

      return {
        id: file.id,
        name: file.name,
        size: file.size,
        encoding: file.encoding,
        type: file.type,
        extension: file.extension,
        albumId: file.albumId,
        url,
        updatedAt: file.updatedAt ? new Date(file.updatedAt).toISOString() : ''
      }
    }))

    return {
      ok: true,
      data: {
        files: filesWithUrls,
        limit: filters.limit,
        page: filters.page,
        total: totalCountOfFiles,
        totalPages: Math.ceil(totalCountOfFiles / filters.limit)
      }
    }
  }

  private handleFilters(rawFilters: GetFilesByAlbumIdFilters, isAlbumActive = true) {
    return {
      limit: rawFilters?.limit ? rawFilters?.limit : 20,
      page: rawFilters?.page ? rawFilters?.page : 1
    }
  }
}
