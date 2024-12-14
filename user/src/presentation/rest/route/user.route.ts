import { Router } from 'express'

import { type UseCases } from '../../interface/use-cases'
import { UserController } from '../controller/user.controller'
import { getAuthInfoFromHeaders } from '../middleware'

export function getUserRouter(useCases: UseCases): Router {
  const router = Router()

  const userController = new UserController(
    useCases.createNewUser,
    useCases.userLogin,
    useCases.refreshToken,
    useCases.getUserInfoUseCase,
  )

  router.post('/users', userController.create.bind(userController))
  router.post('/login', userController.login.bind(userController))
  router.post('/refresh-token', userController.refresh.bind(userController))
  router.get(
    '/users/profile',
    getAuthInfoFromHeaders as any,
    userController.getUserInfo.bind(userController),
  )

  return router
}
