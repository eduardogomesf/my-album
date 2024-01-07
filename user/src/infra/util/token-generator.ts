import { sign } from 'jsonwebtoken'
import { type TokenGenerator } from '@/application/protocol'

export class JWTTokenGenerator implements TokenGenerator {
  constructor(
    private readonly secret: string
  ) {}

  async generate(payload: any) {
    return sign(payload, this.secret)
  }
}
