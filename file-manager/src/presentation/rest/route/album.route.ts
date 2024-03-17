import { Router } from 'express'
import { AlbumController } from '../controller'
import { type UseCases } from '../../interface/injections'
import { getAuthInfoFromHeaders } from '../middleware'

export function getAlbumRouter(useCases: UseCases): Router {
  const router = Router()

  const albumController = new AlbumController(
    useCases.addNewAlbumUseCase,
    useCases.getAlbumsUseCase,
    useCases.getFilesByAlbumIdUseCase
  )

  router.post('/albums', getAuthInfoFromHeaders, albumController.add.bind(albumController))
  router.get('/albums', getAuthInfoFromHeaders, albumController.getAll.bind(albumController))
  router.get(
    '/albums/:albumId/files',
    getAuthInfoFromHeaders,
    albumController.getFilesByAlbumId.bind(albumController)
  )

  return router
}
