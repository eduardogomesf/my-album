import { AlbumStatus } from '../../../domain/enum'
import { ERROR_MESSAGES } from '../../constant'
import {
  type UseCaseResponse,
  type UseCase,
  type RestoreAlbumUseCaseParams
} from '../../interface'
import {
  type UpdateAlbumRepository,
  type GetAlbumByIdRepository
} from '../../protocol'

export class RestoreAlbumUseCase implements UseCase {
  constructor(
    private readonly getAlbumByIdRepository: GetAlbumByIdRepository,
    private readonly updateAlbumRepository: UpdateAlbumRepository
  ) {}

  async execute(params: RestoreAlbumUseCaseParams): Promise<UseCaseResponse<void>> {
    const album = await this.getAlbumByIdRepository.getById(params.albumId, params.userId)

    if (!album) {
      return {
        ok: false,
        message: ERROR_MESSAGES.ALBUM.NOT_FOUND
      }
    }

    if (album.status === AlbumStatus.ACTIVE) {
      return {
        ok: false,
        message: ERROR_MESSAGES.ALBUM.NOT_DELETED
      }
    }

    album.status = AlbumStatus.ACTIVE

    await this.updateAlbumRepository.update(album)

    return {
      ok: true
    }
  }
}
