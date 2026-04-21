import type { Request, Response } from 'express'
import { getMadridBuses } from '../services/buses.service'

export async function getBusesController(_req: Request, res: Response) {
  try {
    const buses = await getMadridBuses()
    return res.json(buses)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error while loading buses'

    return res.status(502).json({
      message: 'Failed to load EMT Madrid buses',
      detail: message,
    })
  }
}
