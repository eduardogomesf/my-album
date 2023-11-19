import { BcryptHashPassword } from '../../../infra/util/hash-password'

export function generateBcryptHashPassword() {
  return new BcryptHashPassword()
}
