import { type Request, type Response } from 'express'
import { type UserLoginUseCase, type CreateNewUserUseCase } from '@/application/use-case'
import { MissingFieldsHelper } from '../helper/missing-fields.helper'
import { Logger } from '@/shared'

const logger = new Logger('UserController')

export class UserController {
  constructor(
    private readonly createNewUserUseCase: CreateNewUserUseCase,
    private readonly userLoginUseCase: UserLoginUseCase
  ) {}

  async create(request: Request, response: Response): Promise<Response> {
    try {
      const missingFieldsValidation = MissingFieldsHelper.hasMissingFields(
        ['firstName', 'lastName', 'email', 'password', 'cellphone'],
        request.body
      )

      if (missingFieldsValidation.isMissing) {
        return response.status(400).json({
          message: `Missing fields: ${missingFieldsValidation.missingFields.join(', ')}`
        })
      }

      const { firstName, lastName, email, password, cellphone } = request.body

      const createUserResult = await this.createNewUserUseCase.create({
        firstName, lastName, email, password, cellphone
      })

      if (!createUserResult.ok) {
        return response.status(400).json({
          message: createUserResult.message
        })
      }

      return response.status(201).send()
    } catch (error) {
      logger.error('Error creating user')
      logger.error(error)
      return response.status(500).send()
    }
  }

  async login(request: Request, response: Response): Promise<Response> {
    try {
      const missingFieldsValidation = MissingFieldsHelper.hasMissingFields(
        ['email', 'password'],
        request.body
      )

      if (missingFieldsValidation.isMissing) {
        return response.status(400).json({
          message: `Missing fields: ${missingFieldsValidation.missingFields.join(', ')}`
        })
      }

      const { email, password } = request.body

      const loginResult = await this.userLoginUseCase.login({
        email, password
      })

      if (!loginResult.ok) {
        if (loginResult.message && loginResult.message.includes('given credentials')) {
          return response.status(401).json({
            message: loginResult.message
          })
        }

        return response.status(400).json({
          message: loginResult.message
        })
      }

      const responseBody = {
        token: loginResult?.data.token
      }

      return response.status(200).json(responseBody)
    } catch (error) {
      logger.error('Error creating user')
      logger.error(error)
      return response.status(500).send()
    }
  }
}
