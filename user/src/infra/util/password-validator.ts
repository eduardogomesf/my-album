import { compare } from 'bcrypt'
import { type PasswordValidator } from '@/application/protocol'

export class BcryptPasswordValidator implements PasswordValidator {
  async validate(password: string, hashedPassword: string): Promise<boolean> {
    return await compare(password, hashedPassword)
  }
}
