import { BcryptPasswordValidator } from '@/infra/util'

export function generateBcryptPasswordValidator() {
  return new BcryptPasswordValidator()
}
