import * as express from 'express'
import * as cors from 'cors'

import { ENVS, Logger } from '@/shared'
import { type UseCases } from '@/presentation/interface/use-cases'
import { getCustomerRouter } from '@/presentation/rest/route'

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
  const customerRouter = getCustomerRouter(useCases)

  app.use(customerRouter)
}

export function bootstrapExpressServer(useCases: UseCases) {
  const app = express()

  setDefaultMiddlewares(app)
  setDefaultRoutes(app)
  setRoutes(app, useCases)

  const port = ENVS.APP.PORT

  app.listen(port, () => {
    Logger.info(`App listening at port ${port}`)
  })
}
