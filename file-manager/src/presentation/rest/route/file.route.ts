import { Router } from 'express'
import * as multer from 'multer'

import { ENVS } from '@/shared'
import { FileController } from '../controller/file.controller'
import { type UseCases } from '../../interface/injections'
import { getFileExtension } from '../helper'
import { getAuthInfoFromHeaders } from '../middleware'

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'tmp/')
  },
  filename: function(req, file, cb) {
    const formattedName = file.originalname.replace('.', '-')
    const extension = getFileExtension(file.originalname)
    const filename = formattedName + '-' + Date.now() + '.' + extension
    cb(null, filename)
  }
})

const limits = {
  fileSize: 1024 * 1024 * ENVS.FILE_CONFIGS.MAX_FILE_SIZE_IN_MB
}

const upload = multer({ storage, limits })

export function getFileRouter(useCases: UseCases): Router {
  const router = Router()

  const fileController = new FileController(
    useCases.addNewFileUseCase,
    useCases.moveFilesToOtherAlbumUseCase,
    useCases.deleteFileUseCase
  )

  router.post(
    '/files',
    upload.single('file'),
    getAuthInfoFromHeaders,
    fileController.add.bind(fileController)
  )

  router.put(
    '/files/move',
    getAuthInfoFromHeaders,
    fileController.moveFiles.bind(fileController)
  )

  router.delete('/albums/:albumId/files/:fileId', getAuthInfoFromHeaders, fileController.delete.bind(fileController))

  return router
}
