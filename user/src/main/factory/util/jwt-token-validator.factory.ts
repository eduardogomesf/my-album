import { ENVS } from '@/shared'
import { JWTTokenValidator } from '@/infra/util'

export const generateJwtTokenValidator = (
  secretKey: string = ENVS.ACCESS_TOKEN.SECRET_KEY
) => {
  return new JWTTokenValidator(secretKey)
}
