import { Router } from 'express'
import {
  createPlaceController,
  deletePlaceController,
  getPlacesController,
  updatePlaceController,
} from '../controllers/places.controller.js'

const placesRouter = Router()

placesRouter.get('/places', getPlacesController)
placesRouter.post('/places', createPlaceController)
placesRouter.put('/places/:id', updatePlaceController)
placesRouter.delete('/places/:id', deletePlaceController)

export default placesRouter
