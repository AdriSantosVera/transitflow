import type { Request, Response } from 'express'
import { handleControllerError } from '../lib/http'
import {
  createSaving,
  deleteSaving,
  getSavings,
  updateSaving,
} from '../services/savings.service'

export async function getSavingsController(req: Request, res: Response) {
  const tripId = typeof req.query.tripId === 'string' ? req.query.tripId : undefined
  return res.json(await getSavings(tripId))
}

export async function createSavingController(req: Request, res: Response) {
  try {
    return res.status(201).json(await createSaving(req.body))
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function updateSavingController(req: Request, res: Response) {
  try {
    const saving = await updateSaving(req.params.id, req.body)

    if (!saving) {
      return res.status(404).json({ message: 'Saving not found' })
    }

    return res.json(saving)
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function deleteSavingController(req: Request, res: Response) {
  const deleted = await deleteSaving(req.params.id)

  if (!deleted) {
    return res.status(404).json({ message: 'Saving not found' })
  }

  return res.status(204).send()
}
