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
      console.log(request.file)
      console.log(request.body)
      // const { size, mimetype, encoding, originalname, buffer } = request?.file
      // const { directoryPath } = request.body

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
}
