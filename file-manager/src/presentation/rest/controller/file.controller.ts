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
    let fullPath = ''

    try {
      if (!request?.file) {
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
        return response.status(400).json({
          message: createUserResult.message
        })
      }

      await fs.rm(fullPath, { force: true }).catch(() => { this.logger.error('Error removing file') })

      return response.status(201).send()
    } catch (error) {
      await fs.rm(fullPath, { force: true }).catch(() => { this.logger.error('Error removing file') })
      this.logger.error('Error uploading file')
      this.logger.error(error)
      this.logger.error(error.stack)
      return response.status(500).send()
    }
  }

  async moveFiles(request: Request, response: Response): Promise<Response> {
    try {
      const { targetAlbumId, filesIds } = request.body
      const { userId } = request.auth

      const missingFieldsResult = MissingFieldsHelper.hasMissingFields(['targetAlbumId', 'filesIds'], request.body)

      if (missingFieldsResult.isMissing) {
        return response.status(HTTP_CODES.BAD_REQUEST.code).json({
          message: missingFieldsResult.missingFieldsMessage
        })
      }

      if (!Array.isArray(filesIds) || filesIds.length === 0) {
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
        return response.status(HTTP_CODES.BAD_REQUEST.code).json({
          message: result.message ?? HTTP_CODES.BAD_REQUEST.message
        })
      }

      return response.status(204).send()
    } catch (error) {
      this.logger.error('Error moving files')
      this.logger.error(error)
      this.logger.error(error.stack)
      return response.status(500).send()
    }
  }
}
