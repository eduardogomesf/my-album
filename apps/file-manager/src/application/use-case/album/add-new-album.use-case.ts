import { Album } from '@/domain/entity'
import { type UseCaseResponse, type UseCase } from '../../interface'
import {
  type SaveAlbumRepository,
  type GetAlbumByNameRepository,
  type GetUserByIdRepository,
} from '../../protocol'
import { Logger } from '@/shared'
import { ERROR_MESSAGES } from '../../constant'
import { AlbumStatus } from '@/domain/enum'

interface AddNewAlbumUseCaseParams {
  userId: string
  name: string
}

export class AddNewAlbumUseCase implements UseCase {
  private readonly logger = new Logger(AddNewAlbumUseCase.name)

  constructor(
    private readonly getUserByIdRepository: GetUserByIdRepository,
    private readonly getAlbumByNameRepository: GetAlbumByNameRepository,
    private readonly saveAlbumRepository: SaveAlbumRepository,
  ) {}

  async execute(
    params: AddNewAlbumUseCaseParams,
  ): Promise<UseCaseResponse<null>> {
    const user = await this.getUserByIdRepository.getById(params.userId)

    if (!user) {
      this.logger.verbose(`User not found with id: ${params.userId}`)
      return {
        ok: false,
        message: ERROR_MESSAGES.USER.NOT_FOUND,
      }
    }

    const albumByName = await this.getAlbumByNameRepository.getByName(
      params.name,
      params.userId,
    )

    if (albumByName && albumByName.status !== AlbumStatus.ACTIVE) {
      return {
        ok: false,
        message: ERROR_MESSAGES.ALBUM.DELETED_ALBUM_WITH_SAME_NAME,
      }
    } else if (albumByName) {
      return {
        ok: false,
        message: ERROR_MESSAGES.ALBUM.ALREADY_EXISTS,
      }
    }

    const album = new Album({
      name: params.name,
      userId: user.id,
      status: AlbumStatus.ACTIVE,
    })

    await this.saveAlbumRepository.save(album)

    return {
      ok: true,
    }
  }
}
