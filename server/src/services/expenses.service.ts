import { prisma } from '../lib/prisma'
import { assertNonEmptyString, assertPositiveNumber, assertValidExpenseType } from '../lib/validation'
import { ensureTripExists } from './trip-reference.service'
import type { Expense } from '../types/trip.type'

type CreateExpenseInput = Omit<Expense, 'id'>

export async function getExpenses(tripId?: string): Promise<Expense[]> {
  const expenses = await prisma.expense.findMany({
    where: tripId ? { tripId } : undefined,
    orderBy: {
      id: 'desc',
    },
  })

  return expenses.map((expense) => ({
    id: expense.id,
    tripId: expense.tripId,
    type: expense.type,
    amount: expense.amount,
  }))
}

export async function createExpense(input: Partial<CreateExpenseInput>): Promise<Expense> {
  const tripId = assertNonEmptyString(input.tripId, 'tripId')
  await ensureTripExists(tripId)

  const nextExpense: Expense = {
    id: `expense-${Date.now()}`,
    tripId,
    type: assertValidExpenseType(input.type),
    amount: assertPositiveNumber(input.amount, 'amount'),
  }

  await prisma.expense.create({
    data: nextExpense,
  })

  return nextExpense
}

export async function updateExpense(
  id: string,
  input: Partial<CreateExpenseInput>,
): Promise<Expense | undefined> {
  const existingExpense = await prisma.expense.findUnique({
    where: { id },
  })

  if (!existingExpense) {
    return undefined
  }

  const updatedExpense = await prisma.expense.update({
    where: { id },
    data: {
      type: input.type !== undefined ? assertValidExpenseType(input.type) : existingExpense.type,
      amount:
        input.amount !== undefined ? assertPositiveNumber(input.amount, 'amount') : existingExpense.amount,
    },
  })

  return {
    id: updatedExpense.id,
    tripId: updatedExpense.tripId,
    type: updatedExpense.type,
    amount: updatedExpense.amount,
  }
}

export async function deleteExpense(id: string): Promise<boolean> {
  const existingExpense = await prisma.expense.findUnique({
    where: { id },
    select: { id: true },
  })

  if (!existingExpense) {
    return false
  }

  await prisma.expense.delete({
    where: { id },
  })

  return true
}
