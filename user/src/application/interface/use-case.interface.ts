export interface UseCaseResponse<T = any> {
  ok: boolean
  message?: string
  data?: T
}

export interface UseCase<T = any> {
  execute: (...args: any[]) => Promise<UseCaseResponse<T>>
}
