import { type NewCacheServiceParams } from '@/infra/cache/interface'
import { RedisCache } from '@/infra/cache/redis'

export const generateCache = (params: NewCacheServiceParams) => {
  return new RedisCache(params)
}
