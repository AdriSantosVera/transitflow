import { Router } from 'express'
import {
  getTransportByIdController,
  getTransportsController,
} from '../controllers/transports.controller'

const transportsRouter = Router()

transportsRouter.get('/transports', getTransportsController)
transportsRouter.get('/transports/:id', getTransportByIdController)

export default transportsRouter
