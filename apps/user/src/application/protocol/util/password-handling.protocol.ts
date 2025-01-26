export interface HashPassword {
  hash: (password: string) => Promise<string>
}

export interface PasswordValidator {
  validate: (password: string, hashedPassword: string) => Promise<boolean>
}
