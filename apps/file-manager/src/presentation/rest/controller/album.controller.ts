import { Logger } from '@/shared'
import { type Response } from 'express'
import { HTTP_CODES } from '../constant'
import {
  type AddNewAlbumUseCase,
  type GetFilesByAlbumIdUseCase,
  type GetAlbumsUseCase,
  type DeleteAlbumUseCase,
  type RestoreAlbumUseCase,
} from '@/application/use-case'
import { ERROR_MESSAGES } from '@/application/constant'
import { convertErrorToHttpError } from '../helper'
import { type CustomRequest } from '../../interface/custom-request'

export class AlbumController {
  private readonly logger = new Logger(AlbumController.name)

  constructor(
    private readonly addNewAlbumUseCase: AddNewAlbumUseCase,
    private readonly getAlbumsUseCase: GetAlbumsUseCase,
    private readonly getFilesByAlbumIdUseCase: GetFilesByAlbumIdUseCase,
    private readonly deleteAlbumUseCase: DeleteAlbumUseCase,
    private readonly restoreAlbumUseCase: RestoreAlbumUseCase,
  ) {}

  async add(
    CustomRequest: CustomRequest,
    response: Response,
  ): Promise<Response> {
    const correlationId = CustomRequest.tracking.correlationId

    this.logger.info('Add album CustomRequest received', correlationId)

    try {
      const { name } = CustomRequest.body
      const { userId } = CustomRequest.auth

      const createAlbumResult = await this.addNewAlbumUseCase.execute({
        name,
        userId,
      })

      if (!createAlbumResult.ok) {
        this.logger.warn(
          `Album not created: ${createAlbumResult.message}`,
          correlationId,
        )

        const httpError = convertErrorToHttpError(
          [
            {
              message: ERROR_MESSAGES.USER.NOT_FOUND,
              httpCode: HTTP_CODES.NOT_FOUND.code,
            },
          ],
          createAlbumResult.message,
        )

        return response.status(httpError.httpCode).json({
          message: httpError.message,
        })
      }

      this.logger.info('Album created successfully', correlationId)

      return response.status(HTTP_CODES.CREATED.code).send()
    } catch (error) {
      this.logger.error('Error creating new album', correlationId)
      this.logger.error(error, correlationId)
      this.logger.error(error.stack, correlationId)
      return response.status(HTTP_CODES.INTERNAL_SERVER_ERROR.code).json({
        message: HTTP_CODES.INTERNAL_SERVER_ERROR.message,
      })
    }
  }

  async getManyByStatus(
    CustomRequest: CustomRequest,
    response: Response,
  ): Promise<Response> {
    const correlationId = CustomRequest.tracking.correlationId

    this.logger.info('Get albums CustomRequest received', correlationId)

    try {
      const { userId } = CustomRequest.auth
      const { deletedAlbumsOnly } = CustomRequest.query

      const getAlbumsResult = await this.getAlbumsUseCase.execute({
        userId,
        deletedAlbums: deletedAlbumsOnly === 'true',
      })

      this.logger.info('Albums retrieved successfully', correlationId)

      return response.status(HTTP_CODES.OK.code).json(getAlbumsResult.data)
    } catch (error) {
      this.logger.error('Error retrieving albums', correlationId)
      this.logger.error(error, correlationId)
      this.logger.error(error.stack, correlationId)
      return response.status(HTTP_CODES.INTERNAL_SERVER_ERROR.code).json({
        message: HTTP_CODES.INTERNAL_SERVER_ERROR.message,
      })
    }
  }

  async getFilesByAlbumId(
    CustomRequest: CustomRequest,
    response: Response,
  ): Promise<Response> {
    const correlationId = CustomRequest.tracking.correlationId

    this.logger.info(
      'Get files by album id CustomRequest received',
      correlationId,
    )

    try {
      const { userId } = CustomRequest.auth
      const { albumId } = CustomRequest.params
      const { page = 1, limit = 20 } = CustomRequest.query

      const getFilesByAlbumIdResult =
        await this.getFilesByAlbumIdUseCase.execute({
          albumId,
          userId,
          filters: {
            page: Number(page),
            limit: Number(limit),
          },
        })

      if (!getFilesByAlbumIdResult.ok) {
        this.logger.warn(
          `Album not found: ${getFilesByAlbumIdResult.message}`,
          correlationId,
        )

        const httpError = convertErrorToHttpError(
          [
            {
              message: ERROR_MESSAGES.ALBUM.NOT_FOUND,
              httpCode: HTTP_CODES.NOT_FOUND.code,
            },
          ],
          getFilesByAlbumIdResult.message,
        )

        return response.status(httpError.httpCode).json({
          message: httpError.message,
        })
      }

      this.logger.info('Files retrieved successfully', correlationId)

      return response.status(HTTP_CODES.OK.code).json({
        files: getFilesByAlbumIdResult.data?.files,
        page: getFilesByAlbumIdResult.data?.page,
        limit: getFilesByAlbumIdResult.data?.limit,
        total: getFilesByAlbumIdResult.data?.total,
        totalOfPages: getFilesByAlbumIdResult.data?.totalPages,
        album: {
          id: getFilesByAlbumIdResult.data?.album.id,
          name: getFilesByAlbumIdResult.data?.album.name,
        },
      })
    } catch (error) {
      this.logger.error('Error retrieving files by album id', correlationId)
      this.logger.error(error, correlationId)
      this.logger.error(error.stack, correlationId)
      return response.status(HTTP_CODES.INTERNAL_SERVER_ERROR.code).json({
        message: HTTP_CODES.INTERNAL_SERVER_ERROR.message,
      })
    }
  }

  async deleteAlbum(
    CustomRequest: CustomRequest,
    response: Response,
  ): Promise<Response> {
    const correlationId = CustomRequest.tracking.correlationId

    this.logger.info('Delete album CustomRequest received', correlationId)

    try {
      const { userId } = CustomRequest.auth
      const { albumId } = CustomRequest.params

      const deleteAlbumResult = await this.deleteAlbumUseCase.execute({
        albumId,
        userId,
      })

      if (!deleteAlbumResult.ok) {
        this.logger.warn(
          `Album not deleted: ${deleteAlbumResult.message}`,
          correlationId,
        )

        const httpError = convertErrorToHttpError(
          [
            {
              message: ERROR_MESSAGES.ALBUM.NOT_FOUND,
              httpCode: HTTP_CODES.NOT_FOUND.code,
            },
          ],
          deleteAlbumResult.message,
        )

        return response.status(httpError.httpCode).json({
          message: httpError.message,
        })
      }

      this.logger.info('Album deleted successfully', correlationId)

      return response.status(HTTP_CODES.OK.code).json()
    } catch (error) {
      this.logger.error('Error retrieving deleted albums', correlationId)
      this.logger.error(error, correlationId)
      this.logger.error(error.stack, correlationId)
      return response.status(HTTP_CODES.INTERNAL_SERVER_ERROR.code).json({
        message: HTTP_CODES.INTERNAL_SERVER_ERROR.message,
      })
    }
  }

  async restore(
    CustomRequest: CustomRequest,
    response: Response,
  ): Promise<Response> {
    const correlationId = CustomRequest.tracking.correlationId

    this.logger.info('Restore album CustomRequest received', correlationId)

    try {
      const { userId } = CustomRequest.auth
      const { albumId } = CustomRequest.params

      const restoreAlbumResult = await this.restoreAlbumUseCase.execute({
        albumId,
        userId,
      })

      if (!restoreAlbumResult.ok) {
        this.logger.warn(
          `Album not restored: ${restoreAlbumResult.message}`,
          correlationId,
        )

        const httpError = convertErrorToHttpError(
          [
            {
              message: ERROR_MESSAGES.ALBUM.NOT_FOUND,
              httpCode: HTTP_CODES.NOT_FOUND.code,
            },
          ],
          restoreAlbumResult.message,
        )

        return response.status(httpError.httpCode).json({
          message: httpError.message,
        })
      }

      this.logger.info('Album restored successfully', correlationId)

      return response.status(HTTP_CODES.OK.code).json()
    } catch (error) {
      this.logger.error('Error restoring album', correlationId)
      this.logger.error(error, correlationId)
      this.logger.error(error.stack, correlationId)
      return response.status(HTTP_CODES.INTERNAL_SERVER_ERROR.code).json({
        message: HTTP_CODES.INTERNAL_SERVER_ERROR.message,
      })
    }
  }
}
