import { Router } from 'express'
import {
  createNoteController,
  deleteNoteController,
  getNotesController,
  updateNoteController,
} from '../controllers/notes.controller'

const notesRouter = Router()

notesRouter.get('/notes', getNotesController)
notesRouter.post('/notes', createNoteController)
notesRouter.put('/notes/:id', updateNoteController)
notesRouter.delete('/notes/:id', deleteNoteController)

export default notesRouter
