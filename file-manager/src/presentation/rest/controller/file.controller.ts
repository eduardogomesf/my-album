import { type Request, type Response } from 'express'
import { type AddNewFileUseCase } from '@/application/use-case'
import { Logger } from '@/shared'

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
      const { directoryPath } = request.body

      const extension = this.getFileExtension(originalname)

      console.log({
        size,
        mimetype,
        encoding,
        originalname,
        buffer,
        directoryPath,
        extension
      })

      // const createUserResult = await this.addNewFileUseCase.add({
      //   size,
      //   encoding,
      //   type: mimetype,
      //   content: buffer,
      //   directoryPath

      // })

      // if (!createUserResult.ok) {
      //   return response.status(400).json({
      //     message: createUserResult.message
      //   })
      // }

      return response.status(201).send()
    } catch (error) {
      logger.error('Error uploading file')
      logger.error(error)
      return response.status(500).send()
    }
  }

  private getFileExtension(filename: string): string | null {
    const regex = /\.([0-9a-z]+)(?:[?#]|$)/i
    const matches = filename.match(regex)
    return matches ? matches[1] : null
  }
}
