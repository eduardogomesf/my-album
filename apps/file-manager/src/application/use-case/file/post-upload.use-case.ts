import { ERROR_MESSAGES } from '../../constant'
import {
  type PostUploadUseCaseParams,
  type UseCase,
  type UseCaseResponse,
} from '../../interface'
import {
  type GetFilesByIdsAndAlbumIdRepository,
  type MarkFilesAsUploadedRepository,
} from '../../protocol'

export class PostUploadUseCase implements UseCase {
  constructor(
    private readonly getFilesByIdsAndAlbumIdRepository: GetFilesByIdsAndAlbumIdRepository,
    private readonly markFilesAsUploadedRepository: MarkFilesAsUploadedRepository,
  ) {}

  async execute(
    params: PostUploadUseCaseParams,
  ): Promise<UseCaseResponse<any>> {
    const { filesIds, userId, albumId } = params

    const files =
      await this.getFilesByIdsAndAlbumIdRepository.getFilesByIdsAndAlbumId(
        filesIds,
        albumId,
        userId,
      )

    if (!files?.length) {
      return {
        ok: false,
        data: {
          message: ERROR_MESSAGES.FILE.MANY_NOT_FOUND,
        },
      }
    }

    await this.markFilesAsUploadedRepository.markAsUploaded(filesIds)

    return {
      ok: true,
    }
  }
}
