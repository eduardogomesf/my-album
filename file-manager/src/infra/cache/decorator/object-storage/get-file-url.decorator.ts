import { type GetFileUrlService } from '@/application/protocol'
import { type File } from '@/domain/entity'
import { ENVS, Logger } from '@/shared'
import { type CacheService } from '../../interface'

export class GetFileUrlCacheDecorator implements GetFileUrlService {
  private readonly logger = new Logger(GetFileUrlCacheDecorator.name)

  constructor(
    private readonly getFileUrlService: GetFileUrlService,
    private readonly cache: CacheService
  ) {}

  async getFileUrl(file: File, userId: string): Promise<string> {
    const cacheKey = `file-url:${file.id}:${userId}`
    const urlFromCache = await this.cache.get(cacheKey)

    let url = ''

    if (urlFromCache) {
      this.logger.info('File URL found in cache')
      url = urlFromCache
    } else {
      this.logger.info('Generating new temporary URL...')
      const urlExpirationInSecods = (60 * 60 * ENVS.S3.URL_EXPIRATION)
      const expirationTime = urlExpirationInSecods - (urlExpirationInSecods * 0.1)
      url = await this.getFileUrlService.getFileUrl(file, userId)
      await this.cache.set(cacheKey, url, { expirationInSeconds: expirationTime })
    }

    return url
  }
}
