import bcrypt from 'bcrypt'

import { type HashPassword } from '../../application/protocol'

export class BcryptHashPassword implements HashPassword {
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
  }
}
