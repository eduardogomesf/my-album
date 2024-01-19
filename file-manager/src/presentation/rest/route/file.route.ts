import { Router } from 'express'
import * as multer from 'multer'

import { FileController } from '../controller/file.controller'
import { type UseCases } from '../../interface/injections'

const upload = multer({ dest: 'tmp/' })

export function getFileRouter(useCases: UseCases): Router {
  const router = Router()

  const fileController = new FileController(useCases.addNewFileUseCase)

  router.post('/files', upload.single('file'), fileController.add.bind(fileController))

  return router
}
