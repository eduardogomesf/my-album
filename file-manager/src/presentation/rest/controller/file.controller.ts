import { type Request, type Response } from 'express'
import { type AddNewFileUseCase } from '@/application/use-case'
import { Logger } from '@/shared'
import { getFileExtension } from '../helper'

const logger = new Logger('UserController')

export class FileController {
  constructor(
    private readonly addNewFileUseCase: AddNewFileUseCase
  ) {}

  async add(request: Request, response: Response): Promise<Response> {
    try {
      if (!request?.file) {
        return response.status(400).json({
          message: 'File not found'
        })
      }

      const { size, mimetype, encoding, originalname, buffer } = request?.file
      const { albumId } = request.body

      const extension = getFileExtension(originalname)

      const createUserResult = await this.addNewFileUseCase.add({
        size,
        encoding,
        type: mimetype,
        content: buffer,
        name: originalname,
        extension,
        userId: 'ec920c48-7705-4f32-a3ab-5b98e85ca151',
        albumId
      })

      if (!createUserResult.ok) {
        return response.status(400).json({
          message: createUserResult.message
        })
      }

      return response.status(201).send()
    } catch (error) {
      logger.error('Error uploading file')
      logger.error(error)
      logger.error(error.stack)
      return response.status(500).send()
    }
  }
}
