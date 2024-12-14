import { GetFileUrlCacheDecorator } from '@/infra/cache/decorator/object-storage'
import { type GetFileUrlService } from '@/application/protocol'
import { type CacheService } from '@/infra/cache/interface'

export const generateGetFileUrlDecorator = (
  getFileUrlService: GetFileUrlService,
  cache: CacheService,
) => {
  return new GetFileUrlCacheDecorator(getFileUrlService, cache)
}
