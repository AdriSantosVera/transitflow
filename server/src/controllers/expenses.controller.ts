import type { Request, Response } from 'express'
import { handleControllerError } from '../lib/http'
import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from '../services/expenses.service'

export async function getExpensesController(req: Request, res: Response) {
  const tripId = typeof req.query.tripId === 'string' ? req.query.tripId : undefined
  return res.json(await getExpenses(tripId))
}

export async function createExpenseController(req: Request, res: Response) {
  try {
    return res.status(201).json(await createExpense(req.body))
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function updateExpenseController(req: Request, res: Response) {
  try {
    const expense = await updateExpense(req.params.id, req.body)

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' })
    }

    return res.json(expense)
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function deleteExpenseController(req: Request, res: Response) {
  const deleted = await deleteExpense(req.params.id)

  if (!deleted) {
    return res.status(404).json({ message: 'Expense not found' })
  }

  return res.status(204).send()
}
