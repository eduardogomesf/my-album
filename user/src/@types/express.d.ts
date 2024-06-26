/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request } from 'express-serve-static-core'

declare module 'express-serve-static-core' {
  export interface Request {
    auth: {
      userId: string
    }
    tracking: {
      correlationId: string
    }
  }
}
