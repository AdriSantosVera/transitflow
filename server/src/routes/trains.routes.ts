import { Router } from 'express'
import { getTrainsController } from '../controllers/trains.controller'

const trainsRouter = Router()

trainsRouter.get('/trains', getTrainsController)

export default trainsRouter
