import { Router } from 'express'
import {
  addFavoriteController,
  getFavoritesController,
  removeFavoriteController,
} from '../controllers/favorites.controller.js'

const favoritesRouter = Router()

favoritesRouter.get('/favorites', getFavoritesController)
favoritesRouter.post('/favorites', addFavoriteController)
favoritesRouter.delete('/favorites/:id', removeFavoriteController)

export default favoritesRouter
