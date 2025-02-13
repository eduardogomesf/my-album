import { verify, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken'
import {
  type TokenValidatorResponse,
  type TokenValidator,
} from '@/application/protocol'

export class JWTTokenValidator implements TokenValidator {
  constructor(private readonly secret: string) {}

  validate(token: string): TokenValidatorResponse {
    try {
      const decoded = verify(token, this.secret)
      return {
        isValid: true,
        data: decoded,
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return {
          isValid: false,
          invalidationReason: 'EXPIRED',
        }
      } else if (error instanceof JsonWebTokenError) {
        return {
          isValid: false,
          invalidationReason: 'INVALID',
        }
      }

      throw error
    }
  }
}
