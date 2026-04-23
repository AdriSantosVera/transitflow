import { prisma } from '../lib/prisma.js'
import {
  assertNonEmptyString,
  assertPositiveNumber,
  assertValidDateString,
  ValidationError,
} from '../lib/validation.js'
import type { Trip, TripWithMetrics } from '../types/trip.type.js'

type CreateTripInput = Omit<Trip, 'id'>

function mapTripWithMetrics(
  trip: Trip,
  totalExpenses: number,
  totalSavings: number,
): TripWithMetrics {
  const progressPercentage =
    trip.budget > 0 ? Math.min(100, Math.round((totalSavings / Number(trip.budget)) * 100)) : 0

  return {
    ...trip,
    totalExpenses,
    totalSavings,
    progressPercentage,
  }
}

export async function getTrips(): Promise<TripWithMetrics[]> {
  const trips = await prisma.trip.findMany({
    include: {
      expenses: true,
      savings: true,
    },
    orderBy: {
      startDate: 'asc',
    },
  })

  return trips.map((trip) =>
    mapTripWithMetrics(
      {
        id: trip.id,
        name: trip.name,
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        budget: trip.budget,
        image: trip.image ?? undefined,
      },
      trip.expenses.reduce((total, expense) => total + expense.amount, 0),
      trip.savings.reduce((total, saving) => total + saving.amount, 0),
    ),
  )
}

export async function getTripById(id: string): Promise<TripWithMetrics | undefined> {
  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      expenses: true,
      savings: true,
    },
  })

  if (!trip) {
    return undefined
  }

  return mapTripWithMetrics(
    {
      id: trip.id,
      name: trip.name,
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      budget: trip.budget,
      image: trip.image ?? undefined,
    },
    trip.expenses.reduce((total, expense) => total + expense.amount, 0),
    trip.savings.reduce((total, saving) => total + saving.amount, 0),
  )
}

export async function createTrip(input: Partial<CreateTripInput>): Promise<Trip> {
  const startDate = assertValidDateString(input.startDate, 'startDate')
  const endDate = assertValidDateString(input.endDate, 'endDate')

  if (new Date(endDate) < new Date(startDate)) {
    throw new ValidationError('endDate cannot be earlier than startDate')
  }

  const nextTrip: Trip = {
    id: `trip-${Date.now()}`,
    name: assertNonEmptyString(input.name, 'name'),
    destination: assertNonEmptyString(input.destination, 'destination'),
    startDate,
    endDate,
    budget: assertPositiveNumber(input.budget, 'budget'),
    image: typeof input.image === 'string' && input.image.trim() ? input.image.trim() : undefined,
  }

  await prisma.trip.create({
    data: {
      id: nextTrip.id,
      name: nextTrip.name,
      destination: nextTrip.destination,
      startDate: nextTrip.startDate,
      endDate: nextTrip.endDate,
      budget: nextTrip.budget,
      image: nextTrip.image ?? null,
    },
  })

  return nextTrip
}

export async function updateTrip(
  id: string,
  input: Partial<CreateTripInput>,
): Promise<TripWithMetrics | undefined> {
  const existingTrip = await prisma.trip.findUnique({
    where: { id },
  })

  if (!existingTrip) {
    return undefined
  }

  const nextName =
    input.name !== undefined ? assertNonEmptyString(input.name, 'name') : existingTrip.name
  const nextDestination =
    input.destination !== undefined
      ? assertNonEmptyString(input.destination, 'destination')
      : existingTrip.destination
  const nextStartDate =
    input.startDate !== undefined
      ? assertValidDateString(input.startDate, 'startDate')
      : existingTrip.startDate
  const nextEndDate =
    input.endDate !== undefined ? assertValidDateString(input.endDate, 'endDate') : existingTrip.endDate
  const nextBudget =
    input.budget !== undefined ? assertPositiveNumber(input.budget, 'budget') : existingTrip.budget

  if (new Date(nextEndDate) < new Date(nextStartDate)) {
    throw new ValidationError('endDate cannot be earlier than startDate')
  }

  await prisma.trip.update({
    where: { id },
    data: {
      name: nextName,
      destination: nextDestination,
      startDate: nextStartDate,
      endDate: nextEndDate,
      budget: nextBudget,
      image: input.image !== undefined ? input.image?.trim() || null : existingTrip.image,
    },
  })

  return getTripById(id)
}

export async function deleteTrip(id: string): Promise<boolean> {
  const existingTrip = await prisma.trip.findUnique({
    where: { id },
    select: { id: true },
  })

  if (!existingTrip) {
    return false
  }

  await prisma.trip.delete({
    where: { id },
  })

  return true
}
