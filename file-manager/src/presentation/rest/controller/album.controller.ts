import { Logger } from '@/shared'
import { type Request, type Response } from 'express'
import { HTTP_CODES } from '../constant'
import { type GetAlbumsUseCase, type AddNewAlbumUseCase } from '@/application/use-case'

export class AlbumController {
  private readonly logger = new Logger(AlbumController.name)

  constructor(
    private readonly addNewAlbumUseCase: AddNewAlbumUseCase,
    private readonly getAlbumsRepository: GetAlbumsUseCase
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

      const getAlbumsResult = await this.getAlbumsRepository.execute(userId)

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
}
