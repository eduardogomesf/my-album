import { type Request, type Response } from 'express'
import {
  type MoveFilesToOtherAlbumUseCase,
  type DeleteFilesUseCase,
  type GetAvailableStorageUseCase,
  type PreUploadAnalysisUseCase,
  type PostUploadUseCase
} from '@/application/use-case'
import { Logger } from '@/shared'
import { MissingFieldsHelper, convertErrorToHttpError } from '../helper'
import { HTTP_CODES } from '../constant'
import { ERROR_MESSAGES } from '@/application/constant'
import { type FileMetadata } from '@/application/interface'

export class FileController {
  private readonly logger = new Logger('FileController')

  constructor(
    private readonly preUploadAnalysisUseCase: PreUploadAnalysisUseCase,
    private readonly moveFilesUseCase: MoveFilesToOtherAlbumUseCase,
    private readonly deleteFileUseCase: DeleteFilesUseCase,
    private readonly getAvailableStorageUseCase: GetAvailableStorageUseCase,
    private readonly postUploadUseCase: PostUploadUseCase
  ) {}

  async preUpload(request: Request, response: Response): Promise<void> {
    const correlationId = request.tracking.correlationId

    this.logger.info('Pre upload analysis request received', correlationId)

    try {
      const {
        files = [] as FileMetadata[],
        albumId
      } = request.body

      if (files?.length === 0) {
        this.logger.warn('Files not found in the request', correlationId)
        response.status(HTTP_CODES.BAD_REQUEST.code).json({
          message: 'Files not found in the request'
        })
        return
      }

      const { userId } = request.auth

      const preUploadAnalysisResult = await this.preUploadAnalysisUseCase.execute({
        files,
        albumId,
        userId
      })

      if (!preUploadAnalysisResult.ok) {
        this.logger.warn(`Files pre upload analysis not finished: ${preUploadAnalysisResult.message}`, correlationId)

        const httpError = convertErrorToHttpError(
          [{
            message: ERROR_MESSAGES.ALBUM.NOT_FOUND,
            httpCode: HTTP_CODES.NOT_FOUND.code
          }],
          preUploadAnalysisResult.message ?? HTTP_CODES.BAD_REQUEST.message
        )

        response.status(httpError.httpCode).json({
          message: httpError.message
        })
        return
      }

      this.logger.info('Files pre upload analysis finished successfully', correlationId)

      response.status(200).json(preUploadAnalysisResult.data)
    } catch (error) {
      this.logger.error('Error performing pre upload analysis', correlationId)
      this.logger.error(error, correlationId)
      this.logger.error(error.stack, correlationId)
      response.status(500).send()
    }
  }

  async moveFiles(request: Request, response: Response): Promise<Response> {
    const correlationId = request.tracking.correlationId

    this.logger.info('Move files request received', correlationId)

    try {
      const { targetAlbumId, filesIds } = request.body
      const { userId } = request.auth

      const missingFieldsResult = MissingFieldsHelper.hasMissingFields(['targetAlbumId', 'filesIds'], request.body)

      if (missingFieldsResult.isMissing) {
        this.logger.warn(missingFieldsResult.missingFieldsMessage, correlationId)
        return response.status(HTTP_CODES.BAD_REQUEST.code).json({
          message: missingFieldsResult.missingFieldsMessage
        })
      }

      if (!Array.isArray(filesIds) || filesIds.length === 0) {
        this.logger.warn('Files must be an array with at least one file id', correlationId)
        return response.status(HTTP_CODES.BAD_REQUEST.code).json({
          message: 'Files must be an array with at least one file id'
        })
      }

      const result = await this.moveFilesUseCase.execute({
        userId,
        targetAlbumId,
        filesIds
      })

      if (!result.ok) {
        this.logger.warn(result.message ?? HTTP_CODES.BAD_REQUEST.message, correlationId)

        const httpError = convertErrorToHttpError(
          [
            {
              message: ERROR_MESSAGES.ALBUM.NOT_FOUND,
              httpCode: HTTP_CODES.NOT_FOUND.code
            },
            {
              message: ERROR_MESSAGES.PERMISSION.NOT_ALLOWED,
              httpCode: HTTP_CODES.FORBIDDEN.code
            }

          ],
          result.message ?? HTTP_CODES.BAD_REQUEST.message
        )

        return response.status(httpError.httpCode).json({
          message: httpError.message
        })
      }

      this.logger.info('Files moved successfully', correlationId)
      return response.status(204).send()
    } catch (error) {
      this.logger.error('Error moving files', correlationId)
      this.logger.error(error, correlationId)
      this.logger.error(error.stack, correlationId)
      return response.status(500).send()
    }
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const correlationId = request.tracking.correlationId
    try {
      const { filesIds = [], albumId } = request.body
      const { userId } = request.auth

      if (!filesIds.length) {
        this.logger.warn('Files ids not found', correlationId)
        return response.status(HTTP_CODES.BAD_REQUEST.code).json({
          message: 'filesIds property is empty'
        })
      }

      const result = await this.deleteFileUseCase.execute({
        filesIds,
        userId,
        albumId
      })

      if (!result.ok) {
        this.logger.warn(result.message ?? HTTP_CODES.BAD_REQUEST.message, correlationId)

        const httpError = convertErrorToHttpError(
          [
            {
              message: ERROR_MESSAGES.FILE.NOT_FOUND,
              httpCode: HTTP_CODES.NOT_FOUND.code
            }
          ],
          result.message ?? HTTP_CODES.BAD_REQUEST.message
        )

        return response.status(httpError.httpCode).json({
          message: httpError.message
        })
      }

      this.logger.info('Files deleted successfully', correlationId)
      return response.status(204).send()
    } catch (error) {
      this.logger.error('Error deleting files', correlationId)
      this.logger.error(error, correlationId)
      this.logger.error(error.stack, correlationId)
      return response.status(500).send()
    }
  }

  async getAvailableStorage(request: Request, response: Response): Promise<Response> {
    const correlationId = request.tracking.correlationId

    this.logger.info('Get available storage request received', correlationId)

    try {
      const { userId } = request.auth

      const result = await this.getAvailableStorageUseCase.execute({
        userId
      })

      this.logger.info('Available storage retrieved successfully', correlationId)
      return response.status(HTTP_CODES.OK.code).json(result.data)
    } catch (error) {
      this.logger.error('Error getting available storage', correlationId)
      this.logger.error(error, correlationId)
      this.logger.error(error.stack, correlationId)
      return response.status(500).send()
    }
  }

  async postUpload(request: Request, response: Response): Promise<void> {
    const correlationId = request.tracking.correlationId

    this.logger.info('Post upload request received', correlationId)

    try {
      const {
        filesIds = [] as string[],
        albumId
      } = request.body

      if (filesIds?.length === 0) {
        this.logger.warn('Files ids not found in the request', correlationId)
        response.status(HTTP_CODES.BAD_REQUEST.code).json({
          message: 'Files ids not found in the request'
        })
        return
      }

      const { userId } = request.auth

      const postUploadResult = await this.postUploadUseCase.execute({
        filesIds,
        albumId,
        userId
      })

      if (!postUploadResult.ok) {
        this.logger.warn(`Post uploaded not finished: ${postUploadResult.message}`, correlationId)

        const httpError = convertErrorToHttpError(
          [{
            message: ERROR_MESSAGES.FILE.MANY_NOT_FOUND,
            httpCode: HTTP_CODES.NOT_FOUND.code
          }],
          postUploadResult.message ?? HTTP_CODES.BAD_REQUEST.message
        )

        response.status(httpError.httpCode).json({
          message: httpError.message
        })
        return
      }

      this.logger.info('Post upload finished successfully', correlationId)

      response.status(200).send()
    } catch (error) {
      this.logger.error('Error performing pre upload analysis', correlationId)
      this.logger.error(error, correlationId)
      this.logger.error(error.stack, correlationId)
      response.status(500).send()
    }
  }
}
