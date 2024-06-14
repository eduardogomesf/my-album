import { Router } from 'express'

import { FileController } from '../controller/file.controller'
import { type UseCases } from '../../interface/injections'
import { getAuthInfoFromHeaders } from '../middleware'

export function getFileRouter(useCases: UseCases): Router {
  const router = Router()

  const fileController = new FileController(
    useCases.preUploadAnalysisUseCase,
    useCases.moveFilesToOtherAlbumUseCase,
    useCases.deleteFileUseCase,
    useCases.getAvailableStorageUseCase,
    useCases.postUploadUseCase
  )

  router.post(
    '/files/pre-upload',
    getAuthInfoFromHeaders,
    fileController.preUpload.bind(fileController)
  )

  router.post(
    '/files/post-upload',
    getAuthInfoFromHeaders,
    fileController.postUpload.bind(fileController)
  )

  router.put(
    '/files/move',
    getAuthInfoFromHeaders,
    fileController.moveFiles.bind(fileController)
  )

  router.post('/files/delete', getAuthInfoFromHeaders, fileController.delete.bind(fileController))

  router.get('/storage', getAuthInfoFromHeaders, fileController.getAvailableStorage.bind(fileController))

  return router
}
