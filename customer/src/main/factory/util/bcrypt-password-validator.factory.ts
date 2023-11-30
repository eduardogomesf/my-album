import { BcryptPasswordValidator } from '@/infra/util'

export function generateBcrypPasswordValidator() {
  return new BcryptPasswordValidator()
}
