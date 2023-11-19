import { JWTTokenGenerator } from '../../../infra/util'
import { ENVS } from '../../../shared'

export const generateJwtTokenGenerator = () => {
  return new JWTTokenGenerator(ENVS.ACCESS_TOKEN.SECRET_KEY)
}
