import { favoritesData } from '../data/favorites.data'

export function getAllFavorites(): string[] {
  return [...favoritesData]
}

export function addFavorite(id: string): string[] {
  if (!favoritesData.includes(id)) {
    favoritesData.push(id)
  }

  return [...favoritesData]
}

export function removeFavorite(id: string): string[] {
  const index = favoritesData.indexOf(id)

  if (index !== -1) {
    favoritesData.splice(index, 1)
  }

  return [...favoritesData]
}
