import { type Request, type Response } from 'express'
import {
  type UserLoginUseCase,
  type CreateNewUserUseCase,
  type RefreshTokenUseCase,
  type GetUserInfoUseCase
} from '@/application/use-case'
import { MissingFieldsHelper } from '../helper/missing-fields.helper'
import { Logger } from '@/shared'

export class UserController {
  private readonly logger = new Logger(UserController.name)

  constructor(
    private readonly createNewUserUseCase: CreateNewUserUseCase,
    private readonly userLoginUseCase: UserLoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly getUserInfoUseCase: GetUserInfoUseCase
  ) {}

  async create(request: Request, response: Response): Promise<Response> {
    const correlationId = request.tracking.correlationId
    try {
      this.logger.info('Create user request received', correlationId)

      const missingFieldsValidation = MissingFieldsHelper.hasMissingFields(
        ['firstName', 'lastName', 'email', 'password', 'cellphone'],
        request.body
      )

      if (missingFieldsValidation.isMissing) {
        this.logger.warn(`Missing fields: ${missingFieldsValidation.missingFields.join(', ')}`, correlationId)
        return response.status(400).json({
          message: `Missing fields: ${missingFieldsValidation.missingFields.join(', ')}`
        })
      }

      const { firstName, lastName, email, password, cellphone } = request.body

      const createUserResult = await this.createNewUserUseCase.execute({
        firstName, lastName, email, password, cellphone
      })

      if (!createUserResult.ok) {
        this.logger.warn(`User not created: ${createUserResult.message}`, correlationId)
        return response.status(400).json({
          message: createUserResult.message
        })
      }

      this.logger.info('User created successfully', correlationId)
      return response.status(201).send()
    } catch (error) {
      this.logger.error('Error creating user', correlationId)
      this.logger.error(error, correlationId)
      return response.status(500).send()
    }
  }

  async login(request: Request, response: Response): Promise<Response> {
    const correlationId = request.tracking.correlationId
    try {
      this.logger.info('Login request received', correlationId)

      const missingFieldsValidation = MissingFieldsHelper.hasMissingFields(
        ['email', 'password'],
        request.body
      )

      if (missingFieldsValidation.isMissing) {
        this.logger.warn(`Missing fields: ${missingFieldsValidation.missingFields.join(', ')}`, correlationId)
        return response.status(400).json({
          message: `Missing fields: ${missingFieldsValidation.missingFields.join(', ')}`
        })
      }

      const { email, password } = request.body

      const loginResult = await this.userLoginUseCase.execute({
        email, password
      })

      if (!loginResult.ok) {
        this.logger.warn(`User not logged in: ${loginResult.message}`, correlationId)

        if (loginResult.message?.includes('given credentials')) {
          return response.status(401).json({
            message: loginResult.message
          })
        }

        return response.status(400).json({
          message: loginResult.message
        })
      }

      const responseBody = {
        accessToken: loginResult?.data?.accessToken,
        refreshToken: loginResult?.data?.refreshToken,
        userId: loginResult?.data?.userId
      }

      this.logger.info('User logged in successfully', correlationId)
      return response.status(200).json(responseBody)
    } catch (error) {
      this.logger.error('Error creating user', correlationId)
      this.logger.error(error, correlationId)
      return response.status(500).send()
    }
  }

  async refresh(request: Request, response: Response): Promise<Response> {
    const correlationId = request.tracking.correlationId
    try {
      this.logger.info('Refresh token request received', correlationId)

      const missingFieldsValidation = MissingFieldsHelper.hasMissingFields(
        ['refreshToken', 'userId'],
        request.body
      )

      if (missingFieldsValidation.isMissing) {
        this.logger.warn(`Missing fields: ${missingFieldsValidation.missingFields.join(', ')}`, correlationId)
        return response.status(400).json({
          message: `Missing fields: ${missingFieldsValidation.missingFields.join(', ')}`
        })
      }

      const { refreshToken, userId } = request.body

      const refreshResult = await this.refreshTokenUseCase.execute({
        refreshToken,
        userId
      })

      if (!refreshResult.ok) {
        this.logger.warn(`Token not refreshed: ${refreshResult.message}`, correlationId)
        return response.status(400).json({
          message: refreshResult.message
        })
      }

      this.logger.info('Token refreshed successfully', correlationId)
      return response.status(200).json({
        accessToken: refreshResult.data?.accessToken,
        refreshToken: refreshResult.data?.refreshToken,
        userId: refreshResult.data?.userId
      })
    } catch (error) {
      this.logger.error('Error refreshing token')
      this.logger.error(error)
      return response.status(500).send()
    }
  }

  async getUserInfo(request: Request, response: Response): Promise<Response> {
    const correlationId = request.tracking.correlationId
    try {
      this.logger.info('Get user info request received', correlationId)

      const { userId } = request.auth

      const getUserInfoResult = await this.getUserInfoUseCase.execute({
        userId
      })

      if (!getUserInfoResult.ok) {
        this.logger.warn(`User not found: ${getUserInfoResult.message}`, correlationId)
        return response.status(404).json({
          message: getUserInfoResult.message
        })
      }

      this.logger.info('User info retrieved successfully', correlationId)
      return response.status(200).json(getUserInfoResult.data)
    } catch (error) {
      this.logger.error('Error getting user info', correlationId)
      this.logger.error(error, correlationId)
      return response.status(500).send()
    }
  }
}
