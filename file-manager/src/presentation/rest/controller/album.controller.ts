import { Logger } from '@/shared'
import { type Request, type Response } from 'express'
import { HTTP_CODES } from '../constant'
import { type GetAlbumsUseCase, type AddNewAlbumUseCase, type GetFilesByAlbumIdUseCase } from '@/application/use-case'
import { ERROR_MESSAGES } from '@/application/constant'

export class AlbumController {
  private readonly logger = new Logger(AlbumController.name)

  constructor(
    private readonly addNewAlbumUseCase: AddNewAlbumUseCase,
    private readonly getAlbumsUseCase: GetAlbumsUseCase,
    private readonly getFilesByAlbumIdUseCase: GetFilesByAlbumIdUseCase

  ) {}

  async add(request: Request, response: Response): Promise<Response> {
    try {
      const { name } = request.body
      const { userId } = request.auth

      const createAlbumResult = await this.addNewAlbumUseCase.execute({
        name,
        userId
      })

      if (!createAlbumResult.ok) {
        return response.status(HTTP_CODES.BAD_REQUEST.code).json({
          message: createAlbumResult.message ?? HTTP_CODES.BAD_REQUEST.message
        })
      }

      return response.status(HTTP_CODES.CREATED.code).send()
    } catch (error) {
      this.logger.error('Error creating new album')
      this.logger.error(error)
      this.logger.error(error.stack)
      return response.status(HTTP_CODES.INTERNAL_SERVER_ERROR.code).json({
        message: HTTP_CODES.INTERNAL_SERVER_ERROR.message
      })
    }
  }

  async getAll(request: Request, response: Response): Promise<Response> {
    try {
      const { userId } = request.auth

      const getAlbumsResult = await this.getAlbumsUseCase.execute(userId)

      return response.status(HTTP_CODES.OK.code).json({
        albums: getAlbumsResult.data
      })
    } catch (error) {
      this.logger.error('Error retrieving albums')
      this.logger.error(error)
      this.logger.error(error.stack)
      return response.status(HTTP_CODES.INTERNAL_SERVER_ERROR.code).json({
        message: HTTP_CODES.INTERNAL_SERVER_ERROR.message
      })
    }
  }

  async getFilesByAlbumId(request: Request, response: Response): Promise<Response> {
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
        return response.status(HTTP_CODES.NOT_FOUND.code).json({
          message: getFilesByAlbumIdResult.message ?? HTTP_CODES.NOT_FOUND.message
        })
      }

      return response.status(HTTP_CODES.OK.code).json({
        files: getFilesByAlbumIdResult.data
      })
    } catch (error) {
      this.logger.error('Error retrieving files by album id')
      this.logger.error(error)
      this.logger.error(error.stack)
      return response.status(HTTP_CODES.INTERNAL_SERVER_ERROR.code).json({
        message: HTTP_CODES.INTERNAL_SERVER_ERROR.message
      })
    }
  }
}
