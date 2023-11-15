import { BcryptHashPassword } from '../../../infra/cryptography/hash-password'

export function generateBcryptHashPassword() {
  return new BcryptHashPassword()
}
