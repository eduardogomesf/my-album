import { type Request, type Response } from 'express'
import * as fs from 'node:fs/promises'
import { type GetFilesByAlbumIdUseCase, type AddNewFileUseCase } from '@/application/use-case'
import { Logger } from '@/shared'
import { getFileExtension } from '../helper'
import { HTTP_CODES } from '../constant'
import { ERROR_MESSAGES } from '@/application/constant'

export class FileController {
  private readonly logger = new Logger('FileController')

  constructor(
    private readonly addNewFileUseCase: AddNewFileUseCase,
    private readonly getFilesByAlbumIdUseCase: GetFilesByAlbumIdUseCase
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

      const createUserResult = await this.addNewFileUseCase.add({
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

  async getFilesByAlbumId(request: Request, response: Response): Promise<Response> {
    try {
      const { userId } = request.auth
      const { albumId } = request.params

      const getFilesByAlbumIdResult = await this.getFilesByAlbumIdUseCase.execute({
        albumId,
        userId
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
