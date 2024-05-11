import { Logger } from '@/shared'
import { type Request, type Response } from 'express'
import { HTTP_CODES } from '../constant'
import {
  type AddNewAlbumUseCase,
  type GetFilesByAlbumIdUseCase,
  type GetActiveAlbumsUseCase,
  type GetDeletedAlbumsUseCase,
  type DeleteAlbumUseCase,
  type RestoreAlbumUseCase
} from '@/application/use-case'
import { ERROR_MESSAGES } from '@/application/constant'

export class AlbumController {
  private readonly logger = new Logger(AlbumController.name)

  constructor(
    private readonly addNewAlbumUseCase: AddNewAlbumUseCase,
    private readonly getActiveAlbumsUseCase: GetActiveAlbumsUseCase,
    private readonly getFilesByAlbumIdUseCase: GetFilesByAlbumIdUseCase,
    private readonly getDeletedAlbumsUseCase: GetDeletedAlbumsUseCase,
    private readonly deleteAlbumUseCase: DeleteAlbumUseCase,
    private readonly restoreAlbumUseCase: RestoreAlbumUseCase
  ) {}

  async add(request: Request, response: Response): Promise<Response> {
    const correlationId = request.tracking.correlationId

    this.logger.info('Add album request received', correlationId)

    try {
      const { name } = request.body
      const { userId } = request.auth

      const createAlbumResult = await this.addNewAlbumUseCase.execute({
        name,
        userId
      })

      if (!createAlbumResult.ok) {
        this.logger.warn(`Album not created: ${createAlbumResult.message}`, correlationId)
        return response.status(HTTP_CODES.BAD_REQUEST.code).json({
          message: createAlbumResult.message ?? HTTP_CODES.BAD_REQUEST.message
        })
      }

      this.logger.info('Album created successfully', correlationId)

      return response.status(HTTP_CODES.CREATED.code).send()
    } catch (error) {
      this.logger.error('Error creating new album', correlationId)
      this.logger.error(error, correlationId)
      this.logger.error(error.stack, correlationId)
      return response.status(HTTP_CODES.INTERNAL_SERVER_ERROR.code).json({
        message: HTTP_CODES.INTERNAL_SERVER_ERROR.message
      })
    }
  }

  async getAllActive(request: Request, response: Response): Promise<Response> {
    const correlationId = request.tracking.correlationId

    this.logger.info('Get all active albums request received', correlationId)

    try {
      const { userId } = request.auth

      const getAlbumsResult = await this.getActiveAlbumsUseCase.execute(userId)

      this.logger.info('Active albums retrieved successfully', correlationId)

      return response.status(HTTP_CODES.OK.code).json({
        albums: getAlbumsResult.data
      })
    } catch (error) {
      this.logger.error('Error retrieving active albums', correlationId)
      this.logger.error(error, correlationId)
      this.logger.error(error.stack, correlationId)
      return response.status(HTTP_CODES.INTERNAL_SERVER_ERROR.code).json({
        message: HTTP_CODES.INTERNAL_SERVER_ERROR.message
      })
    }
  }

  async getAllDeleted(request: Request, response: Response): Promise<Response> {
    const correlationId = request.tracking.correlationId

    this.logger.info('Get all deleted albums request received', correlationId)

    try {
      const { userId } = request.auth

      const getAlbumsResult = await this.getDeletedAlbumsUseCase.execute({
        userId
      })

      this.logger.info('Deleted albums retrieved successfully', correlationId)

      return response.status(HTTP_CODES.OK.code).json({
        albums: getAlbumsResult.data
      })
    } catch (error) {
      this.logger.error('Error retrieving deleted albums', correlationId)
      this.logger.error(error, correlationId)
      this.logger.error(error.stack, correlationId)
      return response.status(HTTP_CODES.INTERNAL_SERVER_ERROR.code).json({
        message: HTTP_CODES.INTERNAL_SERVER_ERROR.message
      })
    }
  }

  async getFilesByAlbumId(request: Request, response: Response): Promise<Response> {
    const correlationId = request.tracking.correlationId

    this.logger.info('Get files by album id request received', correlationId)

    try {
      const { userId } = request.auth
      const { albumId } = request.params
      const { page = 1, limit = 20 } = request.query

      const getFilesByAlbumIdResult = await this.getFilesByAlbumIdUseCase.execute({
        albumId,
        userId,
        filters: {
          page: Number(page),
          limit: Number(limit)
        }
      })

      if (!getFilesByAlbumIdResult.ok && getFilesByAlbumIdResult.message === ERROR_MESSAGES.ALBUM.NOT_FOUND) {
        this.logger.warn(`Album not found: ${getFilesByAlbumIdResult.message}`, correlationId)
        return response.status(HTTP_CODES.NOT_FOUND.code).json({
          message: getFilesByAlbumIdResult.message ?? HTTP_CODES.NOT_FOUND.message
        })
      }

      this.logger.info('Files retrieved successfully', correlationId)

      return response.status(HTTP_CODES.OK.code).json({
        files: getFilesByAlbumIdResult.data?.files,
        page: getFilesByAlbumIdResult.data?.page,
        limit: getFilesByAlbumIdResult.data?.limit,
        total: getFilesByAlbumIdResult.data?.total,
        totalOfPages: getFilesByAlbumIdResult.data?.totalPages
      })
    } catch (error) {
      this.logger.error('Error retrieving files by album id', correlationId)
      this.logger.error(error, correlationId)
      this.logger.error(error.stack, correlationId)
      return response.status(HTTP_CODES.INTERNAL_SERVER_ERROR.code).json({
        message: HTTP_CODES.INTERNAL_SERVER_ERROR.message
      })
    }
  }

  async deleteAlbum(request: Request, response: Response): Promise<Response> {
    const correlationId = request.tracking.correlationId

    this.logger.info('Delete album request received', correlationId)

    try {
      const { userId } = request.auth
      const { albumId } = request.params

      const deleteAlbumResult = await this.deleteAlbumUseCase.execute({
        albumId,
        userId
      })

      if (!deleteAlbumResult.ok) {
        this.logger.warn(`Album not deleted: ${deleteAlbumResult.message}`, correlationId)
        return response.status(HTTP_CODES.BAD_REQUEST.code).json({
          message: deleteAlbumResult.message ?? HTTP_CODES.BAD_REQUEST.message
        })
      }

      this.logger.info('Album deleted successfully', correlationId)

      return response.status(HTTP_CODES.OK.code).json()
    } catch (error) {
      this.logger.error('Error retrieving deleted albums', correlationId)
      this.logger.error(error, correlationId)
      this.logger.error(error.stack, correlationId)
      return response.status(HTTP_CODES.INTERNAL_SERVER_ERROR.code).json({
        message: HTTP_CODES.INTERNAL_SERVER_ERROR.message
      })
    }
  }

  async restore(request: Request, response: Response): Promise<Response> {
    const correlationId = request.tracking.correlationId

    this.logger.info('Restore album request received', correlationId)

    try {
      const { userId } = request.auth
      const { albumId } = request.params

      const restoreAlbumResult = await this.restoreAlbumUseCase.execute({
        albumId,
        userId
      })

      if (!restoreAlbumResult.ok) {
        this.logger.warn(`Album not restored: ${restoreAlbumResult.message}`, correlationId)
        return response.status(HTTP_CODES.BAD_REQUEST.code).json({
          message: restoreAlbumResult.message ?? HTTP_CODES.BAD_REQUEST.message
        })
      }

      this.logger.info('Album restored successfully', correlationId)

      return response.status(HTTP_CODES.OK.code).json()
    } catch (error) {
      this.logger.error('Error restoring album', correlationId)
      this.logger.error(error, correlationId)
      this.logger.error(error.stack, correlationId)
      return response.status(HTTP_CODES.INTERNAL_SERVER_ERROR.code).json({
        message: HTTP_CODES.INTERNAL_SERVER_ERROR.message
      })
    }
  }
}
