import { prisma } from '../lib/prisma'
import { assertNonEmptyString, assertValidDateString } from '../lib/validation'
import { ensureTripExists } from './trip-reference.service'
import type { Note } from '../types/trip.type'

type CreateNoteInput = Omit<Note, 'id'>

export async function getNotes(tripId?: string): Promise<Note[]> {
  const notes = await prisma.note.findMany({
    where: tripId ? { tripId } : undefined,
    orderBy: {
      createdAt: 'desc',
    },
  })

  return notes.map((note) => ({
    id: note.id,
    tripId: note.tripId,
    text: note.text,
    createdAt: note.createdAt,
  }))
}

export async function createNote(input: Partial<CreateNoteInput>): Promise<Note> {
  const tripId = assertNonEmptyString(input.tripId, 'tripId')
  await ensureTripExists(tripId)

  const nextNote: Note = {
    id: `note-${Date.now()}`,
    tripId,
    text: assertNonEmptyString(input.text, 'text'),
    createdAt: assertValidDateString(input.createdAt, 'createdAt'),
  }

  await prisma.note.create({
    data: nextNote,
  })

  return nextNote
}

export async function updateNote(
  id: string,
  input: Partial<CreateNoteInput>,
): Promise<Note | undefined> {
  const existingNote = await prisma.note.findUnique({
    where: { id },
  })

  if (!existingNote) {
    return undefined
  }

  const updatedNote = await prisma.note.update({
    where: { id },
    data: {
      text: input.text !== undefined ? assertNonEmptyString(input.text, 'text') : existingNote.text,
      createdAt:
        input.createdAt !== undefined
          ? assertValidDateString(input.createdAt, 'createdAt')
          : existingNote.createdAt,
    },
  })

  return {
    id: updatedNote.id,
    tripId: updatedNote.tripId,
    text: updatedNote.text,
    createdAt: updatedNote.createdAt,
  }
}

export async function deleteNote(id: string): Promise<boolean> {
  const existingNote = await prisma.note.findUnique({
    where: { id },
    select: { id: true },
  })

  if (!existingNote) {
    return false
  }

  await prisma.note.delete({
    where: { id },
  })

  return true
}
