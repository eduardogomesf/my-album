export interface CacheSetOptions {
  expirationInSeconds: number
}

export interface NewCacheServiceParams {
  host: string
  port: number
  username: string
  password: string
  clientName: string
}

export interface CacheService {
  get: (key: string, shouldThrowError?: boolean) => Promise<string | null>
  set: (
    key: string,
    value: any,
    options?: CacheSetOptions,
    shouldThrowError?: boolean,
  ) => Promise<void>
}
