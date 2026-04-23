import type { Expense, Note, Place, Saving, Trip } from '../types/trip.type.js'

export const tripsData: Trip[] = [
  {
    id: 'trip-001',
    name: 'Verano en Ibiza',
    destination: 'Ibiza, Espana',
    startDate: '2026-07-10',
    endDate: '2026-07-16',
    budget: 1200,
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'trip-002',
    name: 'Escapada a Paris',
    destination: 'Paris, Francia',
    startDate: '2026-09-03',
    endDate: '2026-09-08',
    budget: 1700,
    image:
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=900&q=80',
  },
]

export const placesData: Place[] = [
  {
    id: 'place-001',
    tripId: 'trip-001',
    name: 'Cala Comte',
    category: 'playa',
    notes: 'Ideal para ver el atardecer el primer dia.',
  },
  {
    id: 'place-002',
    tripId: 'trip-001',
    name: 'Sa Capella',
    category: 'restaurante',
    notes: 'Reservar cena una semana antes.',
  },
  {
    id: 'place-003',
    tripId: 'trip-002',
    name: 'Museo del Louvre',
    category: 'cultura',
    notes: 'Comprar entradas anticipadas.',
  },
  {
    id: 'place-004',
    tripId: 'trip-002',
    name: 'Le Marais',
    category: 'barrio',
    notes: 'Buena zona para comer y pasear por la tarde.',
  },
]

export const expensesData: Expense[] = [
  {
    id: 'expense-001',
    tripId: 'trip-001',
    type: 'alojamiento',
    amount: 420,
  },
  {
    id: 'expense-002',
    tripId: 'trip-001',
    type: 'ocio',
    amount: 180,
  },
  {
    id: 'expense-003',
    tripId: 'trip-002',
    type: 'transporte',
    amount: 260,
  },
  {
    id: 'expense-004',
    tripId: 'trip-002',
    type: 'comida',
    amount: 140,
  },
]

export const savingsData: Saving[] = [
  {
    id: 'saving-001',
    tripId: 'trip-001',
    amount: 250,
    date: '2026-04-10',
  },
  {
    id: 'saving-002',
    tripId: 'trip-001',
    amount: 300,
    date: '2026-04-18',
  },
  {
    id: 'saving-003',
    tripId: 'trip-002',
    amount: 500,
    date: '2026-04-07',
  },
  {
    id: 'saving-004',
    tripId: 'trip-002',
    amount: 350,
    date: '2026-04-20',
  },
]

export const notesData: Note[] = [
  {
    id: 'note-001',
    tripId: 'trip-001',
    text: 'Reservar coche pequeno para movernos entre calas.',
    createdAt: '2026-04-12',
  },
  {
    id: 'note-002',
    tripId: 'trip-002',
    text: 'Priorizar Louvre y paseo por Sena el segundo dia.',
    createdAt: '2026-04-15',
  },
]
