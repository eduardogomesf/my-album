import { JWTTokenGenerator } from '@/infra/util'
import { ENVS } from '@/shared'

export const generateJwtTokenGenerator = (
  secretKey: string = ENVS.ACCESS_TOKEN.SECRET_KEY,
  expirationTime: string = ENVS.ACCESS_TOKEN.EXPIRATION_TIME
) => {
  return new JWTTokenGenerator(secretKey, expirationTime)
}
