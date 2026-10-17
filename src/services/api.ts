import { initialEvents } from '../data'
import type { Event, EventDraft } from '../types'

// Si no existe VITE_API_URL, la demo usa localStorage y no necesita backend.
const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '')
const EVENTS_KEY = 'agenda-fcfm-events'

const wait = (ms = 180) => new Promise((resolve) => window.setTimeout(resolve, ms))

function readLocalEvents(): Event[] {
  const stored = localStorage.getItem(EVENTS_KEY)
  if (!stored) {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(initialEvents))
    return initialEvents
  }
  try {
    return JSON.parse(stored) as Event[]
  } catch {
    throw new Error('Los eventos guardados localmente están dañados')
  }
}

function saveLocalEvents(events: Event[]) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    credentials: 'include',
    ...options,
  })
  if (!response.ok) throw new Error(`La API respondió con ${response.status}`)
  return response.json() as Promise<T>
}

export const eventsApi = {
  async list(): Promise<Event[]> {
    if (API_URL) return request<Event[]>('/events/')
    await wait()
    return readLocalEvents()
  },
  async create(draft: EventDraft, status: Event['status']): Promise<Event> {
    if (API_URL) return request<Event>('/events/', { method: 'POST', body: JSON.stringify({ ...draft, status }) })
    await wait()
    const event: Event = { ...draft, id: crypto.randomUUID(), status, accent: 'teal' }
    const events = readLocalEvents()
    saveLocalEvents([event, ...events])
    return event
  },
  async delete(id: string): Promise<void> {
    if (API_URL) {
      await request<void>(`/events/${id}/`, { method: 'DELETE' })
      return
    }
    await wait()
    saveLocalEvents(readLocalEvents().filter((event) => event.id !== id))
  },
}
