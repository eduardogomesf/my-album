import { type Request } from 'express'

export type CustomRequest = Request & {
  auth: {
    userId: string
  }
  tracking: {
    correlationId: string
  }
}
