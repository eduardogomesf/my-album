import * as cookie from 'cookie'
import { type NextFunction, type Request, type Response } from 'express'
import { Logger } from '@/shared'
import { generateJwtTokenValidator } from '@/main/factory/util'

export interface AuthInfo {
  userId: string
  email: string
  role: string
}

const logger = new Logger('getAuthInfoFromToken')

const tokenValidator = generateJwtTokenValidator()

export async function getAuthInfoFromHeaders(req: Request, res: Response, next: NextFunction): Promise<any> {
  if (!req.headers.cookie) {
    logger.error('Cookies not found')
    return res.status(401).send('Cookies not found')
  }

  const { accessToken } = cookie.parse(req.headers.cookie)

  if (!accessToken) {
    logger.error('Invalid cookie format')
    return res.status(401).send('Invalid cookie format')
  }

  const { isValid, data, invalidationReason } = await tokenValidator.validate(accessToken)

  if (!isValid) {
    logger.error('Auth token invalid or expired')
    const message = invalidationReason === 'EXPIRED' ? 'Token expired' : 'Token invalid'
    return res.status(401).send(message)
  }

  const { id: userId } = data

  if (!userId) {
    logger.error('User id not found in token')
    return res.status(401).send('User id not found in token')
  }

  req.auth = { userId }

  next()
}
