import { verify } from 'jsonwebtoken'
import { ENVS, Logger } from '@/shared'
import { type NextFunction, type Request, type Response } from 'express'
import { HTTP_CODES } from '../constant'

export interface AuthInfo {
  userId: string
  email: string
  role: string
}

const logger = new Logger('getAuthInfoFromToken')

export function getAuthInfoFromToken(req: Request, res: Response, next: NextFunction): any {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(HTTP_CODES.UNAUTHORIZED.code).json({ message: HTTP_CODES.UNAUTHORIZED.message })
    }

    const dataFromToken = verify(token, ENVS.APP.TOKEN_SECRET)

    return dataFromToken
  } catch (error) {
    logger.error(error.message)
    return res.status(HTTP_CODES.UNAUTHORIZED.code).json({ message: HTTP_CODES.UNAUTHORIZED.message })
  }
}
