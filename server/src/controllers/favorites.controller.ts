import type { Request, Response } from 'express'
import { handleControllerError } from '../lib/http'
import {
  addFavorite,
  getAllFavorites,
  removeFavorite,
} from '../services/favorites.service'

export async function getFavoritesController(_req: Request, res: Response) {
  res.json(await getAllFavorites())
}

export async function addFavoriteController(req: Request, res: Response) {
  const { id } = req.body as { id?: string }

  if (!id) {
    return res.status(400).json({ message: 'id is required' })
  }

  try {
    const favorites = await addFavorite(id)
    return res.status(201).json(favorites)
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function removeFavoriteController(req: Request, res: Response) {
  const favorites = await removeFavorite(req.params.id)
  return res.json(favorites)
}
