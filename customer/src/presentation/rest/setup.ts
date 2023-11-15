import * as express from 'express'
import * as cors from 'cors'

import { type UseCases } from '../interface/use-cases'
import { getCustomerRouter } from './route/customer.route'

function setupDefaultMiddlewares(app: express.Express) {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cors())
}

export function startExpressServer(useCases: UseCases) {
  const app = express()

  setupDefaultMiddlewares(app)

  app.get('/', (req, res) => {
    res.send('Up and running!')
  })

  const customerRouter = getCustomerRouter(useCases)
  app.use(customerRouter)

  const port = process.env.APP_PORT ?? 3000
  app.listen(port, () => {
    console.log(`App listening at port ${port}`)
  })
}
