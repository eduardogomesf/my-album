import * as express from 'express'
import * as cors from 'cors'

import { ENVS, Logger } from '@/shared'
import { type UseCases } from '@/presentation/interface/injections'

function setDefaultMiddlewares(app: express.Express) {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cors())
}

function setDefaultRoutes(app: express.Express) {
  app.get('/', (req, res) => {
    res.send('Up and running!')
  })
}

function setRoutes(app: express.Express, useCases: UseCases) {
}

export function bootstrapExpressServer(useCases: UseCases) {
  const logger = new Logger('bootstrapExpressServer')

  const app = express()

  setDefaultMiddlewares(app)
  setDefaultRoutes(app)
  setRoutes(app, useCases)

  const port = ENVS.APP.PORT

  app.listen(port, () => {
    logger.info(`App listening at port ${port}`)
  })
}
