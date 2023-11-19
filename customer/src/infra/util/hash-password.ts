import { hash } from 'bcrypt'

import { type HashPassword } from '../../application/protocol'

export class BcryptHashPassword implements HashPassword {
  async hash(password: string): Promise<string> {
    return await hash(password, 10)
  }
}
