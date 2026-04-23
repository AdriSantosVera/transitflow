import { apiGet } from './client'
import type { Note } from '../types/note'

const NOTES_API_PATH = '/api/v1/notes'

export interface CreateNoteInput {
  tripId: string
  text: string
  createdAt: string
}

export function getNotes(tripId?: string) {
  const url = tripId ? `${NOTES_API_PATH}?tripId=${encodeURIComponent(tripId)}` : NOTES_API_PATH
  return apiGet<Note[]>(url)
}

export async function createNote(input: CreateNoteInput) {
  const response = await fetch(NOTES_API_PATH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return (await response.json()) as Note
}

export async function updateNote(id: string, input: Omit<CreateNoteInput, 'tripId'>) {
  const response = await fetch(`${NOTES_API_PATH}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return (await response.json()) as Note
}

export async function deleteNote(id: string) {
  const response = await fetch(`${NOTES_API_PATH}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
}
