export interface CreateUserRepository {
  create: (user: any) => Promise<void>
}
