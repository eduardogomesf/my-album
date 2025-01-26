export interface UseCaseResponse<T = any> {
  ok: boolean
  message?: string
  data?: T
}

export interface UseCase {
  execute: (...args: any[]) => Promise<UseCaseResponse>
}
