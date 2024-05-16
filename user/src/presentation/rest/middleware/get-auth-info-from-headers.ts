import { Logger } from '@/shared'
import { type NextFunction, type Request, type Response } from 'express'
import { generateJwtTokenValidator } from '@/main/factory/util'

export interface AuthInfo {
  userId: string
  email: string
  role: string
}

const logger = new Logger('getAuthInfoFromToken')

const tokenValidator = generateJwtTokenValidator()

export async function getAuthInfoFromHeaders(req: Request, res: Response, next: NextFunction): Promise<any> {
  if (!req.headers.authorization) {
    logger.error('Authorization header not found')
    return res.status(403).send('Authorization header not found')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, token] = req.headers.authorization?.split(' ')

  const { isValid, data, invalidationReason } = await tokenValidator.validate(token)

  if (!isValid) {
    logger.error('Auth token invalid or expired')
    const message = invalidationReason === 'EXPIRED' ? 'Token expired' : 'Token invalid'
    return res.status(403).send(message)
  }

  const { id: userId } = data

  if (!userId) {
    logger.error('User id not found in token')
    return res.status(403).send('User id not found in token')
  }

  req.auth = { userId }

  next()
}
