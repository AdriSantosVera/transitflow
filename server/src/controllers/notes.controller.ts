import type { Request, Response } from 'express'
import { handleControllerError } from '../lib/http.js'
import { createNote, deleteNote, getNotes, updateNote } from '../services/notes.service.js'

export async function getNotesController(req: Request, res: Response) {
  const tripId = typeof req.query.tripId === 'string' ? req.query.tripId : undefined
  return res.json(await getNotes(tripId))
}

export async function createNoteController(req: Request, res: Response) {
  try {
    return res.status(201).json(await createNote(req.body))
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function updateNoteController(req: Request, res: Response) {
  try {
    const note = await updateNote(req.params.id, req.body)

    if (!note) {
      return res.status(404).json({ message: 'Note not found' })
    }

    return res.json(note)
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function deleteNoteController(req: Request, res: Response) {
  const deleted = await deleteNote(req.params.id)

  if (!deleted) {
    return res.status(404).json({ message: 'Note not found' })
  }

  return res.status(204).send()
}
