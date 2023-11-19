export interface PasswordValidator {
  validate: (password: string, hashedPassword: string) => Promise<boolean>
}
