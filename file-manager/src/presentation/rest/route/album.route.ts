import { Router } from 'express'
import { AlbumController } from '../controller'
import { type UseCases } from '../../interface/injections'
import { getAuthInfoFromHeaders } from '../middleware'

export function getAlbumRouter(useCases: UseCases): Router {
  const router = Router()

  const albumController = new AlbumController(
    useCases.addNewAlbumUseCase,
    useCases.getActiveAlbumsUseCase,
    useCases.getFilesByAlbumIdUseCase,
    useCases.getDeletedAlbumsUseCase,
    useCases.deleteAlbumUseCase
  )

  router.post('/albums', getAuthInfoFromHeaders, albumController.add.bind(albumController))
  router.get('/albums/active', getAuthInfoFromHeaders, albumController.getAllActive.bind(albumController))
  router.get('/albums/deleted', getAuthInfoFromHeaders, albumController.getAllDeleted.bind(albumController))
  router.get(
    '/albums/:albumId/files',
    getAuthInfoFromHeaders,
    albumController.getFilesByAlbumId.bind(albumController)
  )
  router.delete('/albums/:albumId', getAuthInfoFromHeaders, albumController.deleteAlbum.bind(albumController))

  return router
}
