import express from 'express'
import cors from 'cors'

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

  const customerRouter = getCustomerRouter(useCases)

  app.use(customerRouter)

  const port = process.env.APP_PORT ?? 3000
  app.listen(port, () => {
    console.log(`app listening at port ${port}`)
  })
}
