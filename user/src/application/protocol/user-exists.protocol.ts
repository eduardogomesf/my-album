export interface UserExistsRepository {
  exists: (userId: string) => Promise<boolean>
}
