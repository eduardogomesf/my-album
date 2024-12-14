import { type Response } from 'express'
import * as cookie from 'cookie'

import {
  type UserLoginUseCase,
  type CreateNewUserUseCase,
  type RefreshTokenUseCase,
  type GetUserInfoUseCase,
} from '@/application/use-case'
import { MissingFieldsHelper } from '../helper/missing-fields.helper'
import { Logger } from '@/shared'
import { ERROR_MESSAGES } from '@/application/constant'
import { type CustomRequest } from '../../interface/custom-request'

export class UserController {
  private readonly logger = new Logger(UserController.name)

  constructor(
    private readonly createNewUserUseCase: CreateNewUserUseCase,
    private readonly userLoginUseCase: UserLoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly getUserInfoUseCase: GetUserInfoUseCase,
  ) {}

  async create(request: CustomRequest, response: Response): Promise<Response> {
    const correlationId = request.tracking.correlationId
    try {
      this.logger.info('Create user request received', correlationId)

      const missingFieldsValidation = MissingFieldsHelper.hasMissingFields(
        ['firstName', 'lastName', 'email', 'password', 'cellphone'],
        request.body,
      )

      if (missingFieldsValidation.isMissing) {
        this.logger.warn(
          `Missing fields: ${missingFieldsValidation.missingFields.join(', ')}`,
          correlationId,
        )
        return response.status(400).json({
          message: `Missing fields: ${missingFieldsValidation.missingFields.join(
            ', ',
          )}`,
        })
      }

      const { firstName, lastName, email, password, cellphone } = request.body

      const createUserResult = await this.createNewUserUseCase.execute({
        firstName,
        lastName,
        email,
        password,
        cellphone,
      })

      if (!createUserResult.ok) {
        this.logger.warn(
          `User not created: ${createUserResult.message}`,
          correlationId,
        )

        if (
          createUserResult.message === ERROR_MESSAGES.USER.EMAIL_ALREADY_EXIST
        ) {
          return response.status(409).json({
            message: createUserResult.message,
          })
        }

        return response.status(400).json({
          message: createUserResult.message,
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

  async login(request: CustomRequest, response: Response): Promise<Response> {
    const correlationId = request.tracking.correlationId
    try {
      this.logger.info('Login request received', correlationId)

      const missingFieldsValidation = MissingFieldsHelper.hasMissingFields(
        ['email', 'password'],
        request.body,
      )

      if (missingFieldsValidation.isMissing) {
        this.logger.warn(
          `Missing fields: ${missingFieldsValidation.missingFields.join(', ')}`,
          correlationId,
        )
        return response.status(400).json({
          message: `Missing fields: ${missingFieldsValidation.missingFields.join(
            ', ',
          )}`,
        })
      }

      const { email, password } = request.body

      const loginResult = await this.userLoginUseCase.execute({
        email,
        password,
      })

      if (!loginResult.ok) {
        this.logger.warn(
          `User not logged in: ${loginResult.message}`,
          correlationId,
        )

        if (loginResult.message?.includes('given credentials')) {
          return response.status(401).json({
            message: loginResult.message,
          })
        }

        return response.status(400).json({
          message: loginResult.message,
        })
      }

      const responseBody = {
        accessToken: loginResult?.data?.accessToken ?? '',
        refreshToken: loginResult?.data?.refreshToken ?? '',
        userId: loginResult?.data?.userId ?? '',
      }

      this.setCookies(
        response,
        responseBody.accessToken,
        responseBody.refreshToken,
        responseBody.userId,
      )

      this.logger.info('User logged in successfully', correlationId)
      return response.status(200).json()
    } catch (error) {
      this.logger.error('Error creating user', correlationId)
      this.logger.error(error, correlationId)
      return response.status(500).send()
    }
  }

  async refresh(request: CustomRequest, response: Response): Promise<Response> {
    const correlationId = request.tracking.correlationId
    try {
      this.logger.info('Refresh token request received', correlationId)

      if (!request.headers.cookie) {
        this.logger.warn('Cookies not found', correlationId)
        return response.status(400).json({
          message: 'Cookies not found',
        })
      }

      const cookies = cookie.parse(request.headers.cookie)

      const missingFieldsValidation = MissingFieldsHelper.hasMissingFields(
        ['refreshToken', 'userId'],
        cookies,
      )

      if (missingFieldsValidation.isMissing) {
        this.logger.warn(
          `Missing cookies: ${missingFieldsValidation.missingFields.join(
            ', ',
          )}`,
          correlationId,
        )
        return response.status(400).json({
          message: 'Cookies not found',
        })
      }

      const { refreshToken, userId } = cookies

      const refreshResult = await this.refreshTokenUseCase.execute({
        refreshToken,
        userId,
      })

      if (!refreshResult.ok) {
        this.logger.warn(
          `Token not refreshed: ${refreshResult.message}`,
          correlationId,
        )
        if (refreshResult.message === ERROR_MESSAGES.USER.NOT_FOUND) {
          return response.status(404).json({
            message: refreshResult.message,
          })
        }

        return response.status(401).json({
          message: refreshResult.message,
        })
      }

      const responseBody = {
        accessToken: refreshResult?.data?.accessToken ?? '',
        refreshToken: refreshResult?.data?.refreshToken ?? '',
        userId: refreshResult?.data?.userId ?? '',
      }

      this.setCookies(
        response,
        responseBody.accessToken,
        responseBody.refreshToken,
        responseBody.userId,
      )

      this.logger.info('Token refreshed successfully', correlationId)
      return response.status(200).json()
    } catch (error) {
      this.logger.error('Error refreshing token')
      this.logger.error(error)
      return response.status(500).send()
    }
  }

  async getUserInfo(
    request: CustomRequest,
    response: Response,
  ): Promise<Response> {
    const correlationId = request.tracking.correlationId
    try {
      this.logger.info('Get user info request received', correlationId)

      const { userId } = request.auth

      const getUserInfoResult = await this.getUserInfoUseCase.execute({
        userId,
      })

      if (!getUserInfoResult.ok) {
        this.logger.warn(
          `User not found: ${getUserInfoResult.message}`,
          correlationId,
        )
        return response.status(404).json({
          message: getUserInfoResult.message,
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

  private setCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
    userId: string,
  ): void {
    response.setHeader('Set-Cookie', [
      cookie.serialize('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60, // 1 hour
      }),
      cookie.serialize('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 1, // 1 day
      }),
      cookie.serialize('userId', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 1, // 1 day
      }),
    ])
  }
}
