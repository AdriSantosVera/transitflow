import type { Request, Response } from 'express'
import {
  getAggregatedTransportById,
  getAggregatedTransports,
} from '../services/transportAggregator.service'

export async function getTransportsController(req: Request, res: Response) {
  const type = typeof req.query.type === 'string' ? req.query.type : undefined
  const transports = await getAggregatedTransports(type)
  return res.json(transports)
}

export async function getTransportByIdController(req: Request, res: Response) {
  const transport = await getAggregatedTransportById(req.params.id)

  if (!transport) {
    return res.status(404).json({
      message: 'Transport not found',
    })
  }

  return res.json(transport)
}
