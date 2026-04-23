import type { Request, Response } from 'express'
import { handleControllerError } from '../lib/http.js'
import {
  createTrip,
  deleteTrip,
  getTripById,
  getTrips,
  updateTrip,
} from '../services/trips.service.js'

export async function getTripsController(_req: Request, res: Response) {
  return res.json(await getTrips())
}

export async function getTripByIdController(req: Request, res: Response) {
  const trip = await getTripById(req.params.id)

  if (!trip) {
    return res.status(404).json({ message: 'Trip not found' })
  }

  return res.json(trip)
}

export async function createTripController(req: Request, res: Response) {
  try {
    return res.status(201).json(await createTrip(req.body))
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function updateTripController(req: Request, res: Response) {
  try {
    const trip = await updateTrip(req.params.id, req.body)

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' })
    }

    return res.json(trip)
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function deleteTripController(req: Request, res: Response) {
  const deleted = await deleteTrip(req.params.id)

  if (!deleted) {
    return res.status(404).json({ message: 'Trip not found' })
  }

  return res.status(204).send()
}
