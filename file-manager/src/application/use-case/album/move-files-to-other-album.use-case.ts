import { AlbumStatus } from '../../../domain/enum'
import { ERROR_MESSAGES } from '../../constant'
import { type UseCaseResponse, type UseCase } from '../../interface'
import { type MoveFilesToAlbumByFilesIdsRepository, type GetAlbumByIdRepository } from '../../protocol'

interface MoveFilesToOtherAlbumParams {
  userId: string
  targetAlbumId: string
  filesIds: string[]
}

export class MoveFilesToOtherAlbum implements UseCase {
  constructor(
    private readonly getAlbumByIdRepository: GetAlbumByIdRepository,
    private readonly moveFilesToAlbumByFilesIdsRepository: MoveFilesToAlbumByFilesIdsRepository
  ) {}

  async execute (params: MoveFilesToOtherAlbumParams): Promise<UseCaseResponse<null>> {
    const album = await this.getAlbumByIdRepository.getById(params.targetAlbumId, params.userId)

    if (!album) {
      return {
        ok: false,
        message: ERROR_MESSAGES.ALBUM.NOT_FOUND
      }
    }

    if (album.status === AlbumStatus.DELETED) {
      return {
        ok: false,
        message: ERROR_MESSAGES.ALBUM.MOVE_TO_DELETED_ALBUM
      }
    }

    await this.moveFilesToAlbumByFilesIdsRepository.moveFiles({
      targetAlbumId: params.targetAlbumId,
      filesIds: params.filesIds,
      userId: params.userId
    })

    return {
      ok: true,
      data: null
    }
  }
}
