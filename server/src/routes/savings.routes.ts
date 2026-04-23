import { Router } from 'express'
import {
  createSavingController,
  deleteSavingController,
  getSavingsController,
  updateSavingController,
} from '../controllers/savings.controller.js'

const savingsRouter = Router()

savingsRouter.get('/savings', getSavingsController)
savingsRouter.post('/savings', createSavingController)
savingsRouter.put('/savings/:id', updateSavingController)
savingsRouter.delete('/savings/:id', deleteSavingController)

export default savingsRouter
