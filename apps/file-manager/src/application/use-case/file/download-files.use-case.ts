import { ERROR_MESSAGES } from '../../constant'
import {
  type DownloadFilesUseCaseParams,
  type UseCase,
  type UseCaseResponse,
} from '../../interface'
import {
  type GetFileStreamFromStorageService,
  type GetAlbumByIdRepository,
  type GetFilesByIdsRepository,
} from '../../protocol'

export class DownloadFilesUseCase implements UseCase {
  constructor(
    private readonly getAlbumByIdRepository: GetAlbumByIdRepository,
    private readonly getFilesByIdsRepository: GetFilesByIdsRepository,
    private readonly getFileStreamFromStorageService: GetFileStreamFromStorageService,
  ) {}

  async execute(
    params: DownloadFilesUseCaseParams,
  ): Promise<UseCaseResponse<null>> {
    const album = await this.getAlbumByIdRepository.getById(
      params.albumId,
      params.userId,
    )

    if (!album) {
      return {
        ok: false,
        message: ERROR_MESSAGES.ALBUM.NOT_FOUND,
      }
    }

    const files = await this.getFilesByIdsRepository.getByIds(
      params.filesIds,
      params.userId,
    )

    if (files.some((file) => file.album.userId !== params.userId)) {
      return {
        ok: false,
        message: ERROR_MESSAGES.PERMISSION.NOT_ALLOWED,
      }
    }

    for (const file of files) {
      const fileStream =
        await this.getFileStreamFromStorageService.getFileStream(
          file,
          params.userId,
        )
      params.archiver.append(fileStream, { name: `${file.name}` })
    }

    return {
      ok: true,
      data: null,
    }
  }
}
