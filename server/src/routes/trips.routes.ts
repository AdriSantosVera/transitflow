import { Router } from 'express'
import {
  createTripController,
  deleteTripController,
  getTripByIdController,
  getTripsController,
  updateTripController,
} from '../controllers/trips.controller'

const tripsRouter = Router()

tripsRouter.get('/trips', getTripsController)
tripsRouter.get('/trips/:id', getTripByIdController)
tripsRouter.post('/trips', createTripController)
tripsRouter.put('/trips/:id', updateTripController)
tripsRouter.delete('/trips/:id', deleteTripController)

export default tripsRouter
