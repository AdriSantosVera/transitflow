import type { Request, Response } from 'express'
import { handleControllerError } from '../lib/http.js'
import {
  createPlace,
  deletePlace,
  getPlaces,
  updatePlace,
} from '../services/places.service.js'

export async function getPlacesController(req: Request, res: Response) {
  const tripId = typeof req.query.tripId === 'string' ? req.query.tripId : undefined
  return res.json(await getPlaces(tripId))
}

export async function createPlaceController(req: Request, res: Response) {
  try {
    return res.status(201).json(await createPlace(req.body))
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function updatePlaceController(req: Request, res: Response) {
  try {
    const place = await updatePlace(req.params.id, req.body)

    if (!place) {
      return res.status(404).json({ message: 'Place not found' })
    }

    return res.json(place)
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function deletePlaceController(req: Request, res: Response) {
  const deleted = await deletePlace(req.params.id)

  if (!deleted) {
    return res.status(404).json({ message: 'Place not found' })
  }

  return res.status(204).send()
}
