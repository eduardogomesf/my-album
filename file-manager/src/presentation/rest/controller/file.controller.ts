import { type Request, type Response } from 'express'
import * as fs from 'node:fs/promises'
import { type MoveFilesToOtherAlbumUseCase, type AddNewFileUseCase } from '@/application/use-case'
import { Logger } from '@/shared'
import { MissingFieldsHelper, getFileExtension } from '../helper'
import { HTTP_CODES } from '../constant'

export class FileController {
  private readonly logger = new Logger('FileController')

  constructor(
    private readonly addNewFileUseCase: AddNewFileUseCase,
    private readonly moveFilesUseCase: MoveFilesToOtherAlbumUseCase
  ) {}

  async add(request: Request, response: Response): Promise<Response> {
    const correlationId = request.tracking.correlationId

    let fullPath = ''

    this.logger.info('Add file request received', correlationId)

    try {
      if (!request?.file) {
        this.logger.warn('File not found', correlationId)
        return response.status(400).json({
          message: 'File not found'
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
        return response.status(400).json({
          message: createUserResult.message
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
        return response.status(HTTP_CODES.BAD_REQUEST.code).json({
          message: result.message ?? HTTP_CODES.BAD_REQUEST.message
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
}
