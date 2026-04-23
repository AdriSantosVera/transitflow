import { prisma } from '../lib/prisma.js'
import { assertNonEmptyString } from '../lib/validation.js'
import { ensureTripExists } from './trip-reference.service.js'

export async function getAllFavorites(): Promise<string[]> {
  const favorites = await prisma.favorite.findMany({
    orderBy: {
      tripId: 'asc',
    },
  })

  return favorites.map((favorite) => favorite.tripId)
}

export async function addFavorite(id: string): Promise<string[]> {
  const tripId = assertNonEmptyString(id, 'id')
  await ensureTripExists(tripId)

  await prisma.favorite.upsert({
    where: { tripId },
    update: {},
    create: {
      id: tripId,
      tripId,
    },
  })

  return getAllFavorites()
}

export async function removeFavorite(id: string): Promise<string[]> {
  await prisma.favorite.deleteMany({
    where: { tripId: id },
  })

  return getAllFavorites()
}
