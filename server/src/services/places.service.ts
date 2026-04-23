import { prisma } from '../lib/prisma'
import { assertNonEmptyString } from '../lib/validation'
import { ensureTripExists } from './trip-reference.service'
import type { Place } from '../types/trip.type'

type CreatePlaceInput = Omit<Place, 'id'>

export async function getPlaces(tripId?: string): Promise<Place[]> {
  const places = await prisma.place.findMany({
    where: tripId ? { tripId } : undefined,
    orderBy: {
      name: 'asc',
    },
  })

  return places.map((place) => ({
    id: place.id,
    tripId: place.tripId,
    name: place.name,
    category: place.category,
    notes: place.notes,
  }))
}

export async function createPlace(input: Partial<CreatePlaceInput>): Promise<Place> {
  const tripId = assertNonEmptyString(input.tripId, 'tripId')
  await ensureTripExists(tripId)

  const nextPlace: Place = {
    id: `place-${Date.now()}`,
    tripId,
    name: assertNonEmptyString(input.name, 'name'),
    category: assertNonEmptyString(input.category, 'category'),
    notes: input.notes?.trim() || '',
  }

  await prisma.place.create({
    data: nextPlace,
  })

  return nextPlace
}

export async function updatePlace(
  id: string,
  input: Partial<CreatePlaceInput>,
): Promise<Place | undefined> {
  const existingPlace = await prisma.place.findUnique({
    where: { id },
  })

  if (!existingPlace) {
    return undefined
  }

  const updatedPlace = await prisma.place.update({
    where: { id },
    data: {
      name: input.name !== undefined ? assertNonEmptyString(input.name, 'name') : existingPlace.name,
      category:
        input.category !== undefined
          ? assertNonEmptyString(input.category, 'category')
          : existingPlace.category,
      notes: input.notes !== undefined ? input.notes.trim() : existingPlace.notes,
    },
  })

  return {
    id: updatedPlace.id,
    tripId: updatedPlace.tripId,
    name: updatedPlace.name,
    category: updatedPlace.category,
    notes: updatedPlace.notes,
  }
}

export async function deletePlace(id: string): Promise<boolean> {
  const existingPlace = await prisma.place.findUnique({
    where: { id },
    select: { id: true },
  })

  if (!existingPlace) {
    return false
  }

  await prisma.place.delete({
    where: { id },
  })

  return true
}
