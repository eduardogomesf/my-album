import {
  type Request,
  type Response,
  type NextFunction
} from 'express'
import { v4 as uuid } from 'uuid'
import { Logger } from '@/shared'

export const appLogger = new Logger('LoggerMiddleware')

export function logger(req: Request, res: Response, next: NextFunction): any {
  const correlationId = req.headers['x-correlation-id'] as string ?? uuid()

  const logContent = {
    method: req.method,
    url: req.url,
    correlationId,
    hasBody: Object.keys(req.body).length > 0,
    hasCookies: req.headers.cookie !== undefined,
    hasQuery: Object.keys(req.query).length > 0
  }

  appLogger.info(`Request received: ${JSON.stringify(logContent)}`, correlationId)

  req.tracking = { correlationId }

  next()
}
