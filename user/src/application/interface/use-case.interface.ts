export interface UseCaseResponse {
  ok: boolean
  message?: string
  data?: any
}

export interface UseCase {
  execute: (...args: any[]) => Promise<UseCaseResponse>
}
