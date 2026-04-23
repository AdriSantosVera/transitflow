import { Router } from 'express'
import {
  createExpenseController,
  deleteExpenseController,
  getExpensesController,
  updateExpenseController,
} from '../controllers/expenses.controller'

const expensesRouter = Router()

expensesRouter.get('/expenses', getExpensesController)
expensesRouter.post('/expenses', createExpenseController)
expensesRouter.put('/expenses/:id', updateExpenseController)
expensesRouter.delete('/expenses/:id', deleteExpenseController)

export default expensesRouter
