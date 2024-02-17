import { Router } from 'express'
import * as multer from 'multer'

import { FileController } from '../controller/file.controller'
import { type UseCases } from '../../interface/injections'
import { getFileExtension } from '../helper'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp/')
  },
  filename: function (req, file, cb) {
    const formattedName = file.originalname.replace('.', '-')
    const extension = getFileExtension(file.originalname)
    const filename = formattedName + '-' + Date.now() + '.' + extension
    cb(null, filename)
  }
})

const upload = multer({ storage })

export function getFileRouter(useCases: UseCases): Router {
  const router = Router()

  const fileController = new FileController(useCases.addNewFileUseCase)

  router.post('/files', upload.single('file'), fileController.add.bind(fileController))

  return router
}
