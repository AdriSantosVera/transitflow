import type { Request, Response } from 'express'
import { getTrains } from '../services/trains.service'

export async function getTrainsController(_req: Request, res: Response) {
  const trains = await getTrains()
  return res.json(trains)
}
