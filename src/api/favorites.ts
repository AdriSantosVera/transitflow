import { apiGet } from './client'

const FAVORITES_API_PATH = '/api/v1/favorites'

export function getFavorites() {
  return apiGet<string[]>(FAVORITES_API_PATH)
}

export async function addFavorite(id: string) {
  const response = await fetch(FAVORITES_API_PATH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return (await response.json()) as string[]
}

export async function removeFavorite(id: string) {
  const response = await fetch(`${FAVORITES_API_PATH}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return (await response.json()) as string[]
}
