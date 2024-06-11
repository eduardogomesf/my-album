import { type Request, type Response } from 'express'
import * as fs from 'node:fs/promises'
import {
  type MoveFilesToOtherAlbumUseCase,
  type AddNewFileUseCase,
  type DeleteFilesUseCase,
  type GetAvailableStorageUseCase
} from '@/application/use-case'
import { Logger } from '@/shared'
import { MissingFieldsHelper, convertErrorToHttpError, getFileExtension } from '../helper'
import { HTTP_CODES } from '../constant'
import { ERROR_MESSAGES } from '@/application/constant'

export class FileController {
  private readonly logger = new Logger('FileController')

  constructor(
    private readonly addNewFileUseCase: AddNewFileUseCase,
    private readonly moveFilesUseCase: MoveFilesToOtherAlbumUseCase,
    private readonly deleteFileUseCase: DeleteFilesUseCase,
    private readonly getAvailableStorageUseCase: GetAvailableStorageUseCase
  ) {}

  async add(request: Request, response: Response): Promise<Response> {
    const correlationId = request.tracking.correlationId

    let fullPath = ''

    this.logger.info('Add file request received', correlationId)

    try {
      if (!request?.file) {
        this.logger.warn('File not found in the request', correlationId)
        return response.status(HTTP_CODES.BAD_REQUEST.code).json({
          message: 'File not found in the request'
        })
      }

      const { size, mimetype, encoding, originalname, path } = request?.file
      const { albumId } = request.body
      const { userId } = request.auth

      fullPath = path

      const extension = getFileExtension(originalname)

      const file = await fs.readFile(path)

      const createUserResult = await this.addNewFileUseCase.execute({
        size,
        encoding,
        type: mimetype,
        content: file,
        name: originalname,
        extension,
        userId,
        albumId
      })

      if (!createUserResult.ok) {
        this.logger.warn(`File not created: ${createUserResult.message}`, correlationId)

        const httpError = convertErrorToHttpError(
          [{
            message: ERROR_MESSAGES.ALBUM.NOT_FOUND,
            httpCode: HTTP_CODES.NOT_FOUND.code
          }],
          createUserResult.message ?? HTTP_CODES.BAD_REQUEST.message
        )

        return response.status(httpError.httpCode).json({
          message: httpError.message
        })
      }

      await fs.rm(fullPath, { force: true }).catch(() => { this.logger.error('Error removing file') })

      this.logger.info('File created successfully', correlationId)

      return response.status(201).send()
    } catch (error) {
      await fs.rm(fullPath, { force: true }).catch(() => { this.logger.error('Error removing file') })
      this.logger.error('Error uploading file', correlationId)
      this.logger.error(error, correlationId)
      this.logger.error(error.stack, correlationId)
      return response.status(500).send()
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
}
