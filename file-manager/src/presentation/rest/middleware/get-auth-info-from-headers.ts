import { Logger } from '@/shared'
import { type NextFunction, type Request, type Response } from 'express'
import { HTTP_CODES } from '../constant'

export interface AuthInfo {
  userId: string
  email: string
  role: string
}

const logger = new Logger('getAuthInfoFromToken')

export function getAuthInfoFromHeaders(req: Request, res: Response, next: NextFunction): any {
  const userId = req.headers['x-user-id'] as string

  if (!userId) {
    logger.error('User id not found in headers')
    return res.status(HTTP_CODES.UNAUTHORIZED.code).send(HTTP_CODES.UNAUTHORIZED.message)
  }

  req.auth = { userId }

  next()
}
