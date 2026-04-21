import type { Request, Response } from 'express'
import {
  addFavorite,
  getAllFavorites,
  removeFavorite,
} from '../services/favorites.service'

export function getFavoritesController(_req: Request, res: Response) {
  res.json(getAllFavorites())
}

export function addFavoriteController(req: Request, res: Response) {
  const { id } = req.body as { id?: string }

  if (!id) {
    return res.status(400).json({ message: 'id is required' })
  }

  const favorites = addFavorite(id)
  return res.status(201).json(favorites)
}

export function removeFavoriteController(req: Request, res: Response) {
  const favorites = removeFavorite(req.params.id)
  return res.json(favorites)
}
