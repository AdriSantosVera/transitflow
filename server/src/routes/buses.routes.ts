import { Router } from 'express'
import { getBusesController } from '../controllers/buses.controller'

const busesRouter = Router()

busesRouter.get('/buses', getBusesController)

export default busesRouter
