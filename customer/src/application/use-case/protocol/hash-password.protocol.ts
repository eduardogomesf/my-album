export interface HashPassword {
  hash: (password: string) => Promise<string>
}
