import type { Response } from 'express'
import { NotFoundError, ValidationError } from './validation'

export function handleControllerError(res: Response, error: unknown) {
  if (error instanceof ValidationError) {
    return res.status(400).json({ message: error.message })
  }

  if (error instanceof NotFoundError) {
    return res.status(404).json({ message: error.message })
  }

  const message = error instanceof Error ? error.message : 'Internal server error'
  return res.status(500).json({ message })
}
