import { AlbumStatus } from '@/domain/enum'
import { ERROR_MESSAGES } from '../../constant'
import {
  type UseCaseResponse,
  type UseCase,
  type DeleteAlbumUseCaseParams,
} from '../../interface'
import {
  type GetAlbumByIdWithFilesCountRepository,
  type DeleteAlbumRepository,
  type UpdateAlbumRepository,
} from '../../protocol'

export class DeleteAlbumUseCase implements UseCase {
  constructor(
    private readonly getAlbumByIdWithFilesCountRepository: GetAlbumByIdWithFilesCountRepository,
    private readonly updateAlbumRepository: UpdateAlbumRepository,
    private readonly deleteAlbumRepository: DeleteAlbumRepository,
  ) {}

  async execute(
    params: DeleteAlbumUseCaseParams,
  ): Promise<UseCaseResponse<void>> {
    const album =
      await this.getAlbumByIdWithFilesCountRepository.getByIdWithFilesCount(
        params.albumId,
        params.userId,
      )

    if (!album) {
      return {
        ok: false,
        message: ERROR_MESSAGES.ALBUM.NOT_FOUND,
      }
    }

    if (album.status === AlbumStatus.ACTIVE && album.numberOfFiles > 0) {
      album.status = AlbumStatus.DELETED
      await this.updateAlbumRepository.update(album)
    } else {
      await this.deleteAlbumRepository.delete(params.albumId, params.userId)
    }

    return {
      ok: true,
    }
  }
}
