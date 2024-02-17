import { bootstrapExpressServer } from './config/express'
import { Logger } from '@/shared'
import { getApplicationUseCases } from './config/use-cases'

const logger = new Logger('bootstrap')

export async function bootstrap() {
  logger.info('Bootstrapping application...')

  const useCases = await getApplicationUseCases()

  // await startConsumers()

  bootstrapExpressServer(useCases)
}

bootstrap().catch(error => {
  logger.fatal('Error bootstrapping application')
  logger.fatal(error)
  process.exit(1)
})
