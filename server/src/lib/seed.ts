import { Prisma } from '@prisma/client'
import { expensesData, notesData, placesData, savingsData, tripsData } from '../data/trips.data.js'
import { prisma } from './prisma.js'

let seedPromise: Promise<void> | null = null

export async function ensureDatabaseSeeded() {
  if (!seedPromise) {
    seedPromise = seedDatabase()
  }

  await seedPromise
}

async function seedDatabase() {
  const appState = await prisma.appState.findUnique({
    where: { id: 'default' },
  })

  if (appState) {
    return
  }

  const existingTrips = await prisma.trip.count()

  if (existingTrips > 0) {
    await prisma.appState.create({
      data: {
        id: 'default',
        seededAt: new Date().toISOString(),
      },
    })

    return
  }

  await prisma.$transaction([
    prisma.appState.create({
      data: {
        id: 'default',
        seededAt: new Date().toISOString(),
      },
    }),
    prisma.trip.createMany({
      data: tripsData.map((trip) => ({
        id: trip.id,
        name: trip.name,
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        budget: trip.budget,
        image: trip.image ?? null,
      })),
    }),
    prisma.place.createMany({
      data: placesData.map((place) => ({
        id: place.id,
        tripId: place.tripId,
        name: place.name,
        category: place.category,
        notes: place.notes,
      })),
    }),
    prisma.expense.createMany({
      data: expensesData.map((expense) => ({
        id: expense.id,
        tripId: expense.tripId,
        type: expense.type as Prisma.ExpenseType,
        amount: expense.amount,
      })),
    }),
    prisma.saving.createMany({
      data: savingsData.map((saving) => ({
        id: saving.id,
        tripId: saving.tripId,
        amount: saving.amount,
        date: saving.date,
      })),
    }),
    prisma.note.createMany({
      data: notesData.map((note) => ({
        id: note.id,
        tripId: note.tripId,
        text: note.text,
        createdAt: note.createdAt,
      })),
    }),
  ])
}
