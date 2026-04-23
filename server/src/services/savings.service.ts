import { prisma } from '../lib/prisma.js'
import { assertNonEmptyString, assertPositiveNumber, assertValidDateString } from '../lib/validation.js'
import { ensureTripExists } from './trip-reference.service.js'
import type { Saving } from '../types/trip.type.js'

type CreateSavingInput = Omit<Saving, 'id'>

export async function getSavings(tripId?: string): Promise<Saving[]> {
  const savings = await prisma.saving.findMany({
    where: tripId ? { tripId } : undefined,
    orderBy: {
      date: 'desc',
    },
  })

  return savings.map((saving) => ({
    id: saving.id,
    tripId: saving.tripId,
    amount: saving.amount,
    date: saving.date,
  }))
}

export async function createSaving(input: Partial<CreateSavingInput>): Promise<Saving> {
  const tripId = assertNonEmptyString(input.tripId, 'tripId')
  await ensureTripExists(tripId)

  const nextSaving: Saving = {
    id: `saving-${Date.now()}`,
    tripId,
    amount: assertPositiveNumber(input.amount, 'amount'),
    date: assertValidDateString(input.date, 'date'),
  }

  await prisma.saving.create({
    data: nextSaving,
  })

  return nextSaving
}

export async function updateSaving(
  id: string,
  input: Partial<CreateSavingInput>,
): Promise<Saving | undefined> {
  const existingSaving = await prisma.saving.findUnique({
    where: { id },
  })

  if (!existingSaving) {
    return undefined
  }

  const updatedSaving = await prisma.saving.update({
    where: { id },
    data: {
      amount:
        input.amount !== undefined ? assertPositiveNumber(input.amount, 'amount') : existingSaving.amount,
      date: input.date !== undefined ? assertValidDateString(input.date, 'date') : existingSaving.date,
    },
  })

  return {
    id: updatedSaving.id,
    tripId: updatedSaving.tripId,
    amount: updatedSaving.amount,
    date: updatedSaving.date,
  }
}

export async function deleteSaving(id: string): Promise<boolean> {
  const existingSaving = await prisma.saving.findUnique({
    where: { id },
    select: { id: true },
  })

  if (!existingSaving) {
    return false
  }

  await prisma.saving.delete({
    where: { id },
  })

  return true
}
