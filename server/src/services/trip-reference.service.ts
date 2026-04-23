import { prisma } from '../lib/prisma.js'
import { NotFoundError } from '../lib/validation.js'

export async function ensureTripExists(tripId: string) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { id: true },
  })

  if (!trip) {
    throw new NotFoundError('Trip not found')
  }
}
