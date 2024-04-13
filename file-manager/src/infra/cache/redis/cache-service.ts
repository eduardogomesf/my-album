import { createClient, type RedisClientType } from 'redis'
import { Logger } from '@/shared'
import { type CacheSetOptions, type CacheService, type NewCacheServiceParams } from '../interface'

export class RedisCache implements CacheService {
  private readonly logger = new Logger(RedisCache.name)
  private readonly client: RedisClientType

  constructor(params: NewCacheServiceParams) {
    this.client = createClient({
      url: `redis://${params.password}@${params.host}:${params.port}`,
      name: params.clientName
    })

    this.connect()
      .then(() => {
        this.logger.info('Redis connected')
      }).catch((error) => {
        this.logger.error(`Redis connection error: ${error}`)
      })
  }

  public async set(key: string, value: any, options?: CacheSetOptions, shouldThrowError = false): Promise<void> {
    try {
      if (options?.expirationInSeconds) {
        await this.client.setEx(key, options.expirationInSeconds, JSON.stringify(value))
      } else {
        await this.client.set(key, JSON.stringify(value))
      }
    } catch (error) {
      this.logger.error(`Redis set error: ${error}`)
      if (shouldThrowError) {
        throw error
      }
    }
  }

  public async get(key: string, shouldThrowError = false): Promise<any> {
    try {
      const data = await this.client.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      this.logger.error(`Redis get error: ${error}`)
      if (shouldThrowError) {
        throw error
      }
      return null
    }
  }

  private async connect() {
    await this.client.connect()
  }
}
