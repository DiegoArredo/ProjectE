export type Role = 'member' | 'organizer' | 'admin'
export type EventStatus = 'published' | 'draft'
export type Category = 'Académico' | 'Cultura' | 'Comunidad' | 'Innovación'

export interface Event {
  id: string
  title: string
  description: string
  category: Category
  organizerUnit: string
  date: string
  startTime: string
  endTime: string
  location: string
  modality: 'Presencial' | 'Online' | 'Híbrido'
  registrationUrl: string
  status: EventStatus
  accent: string
}

export interface EventDraft {
  title: string
  description: string
  category: Category
  organizerUnit: string
  date: string
  startTime: string
  endTime: string
  location: string
  modality: Event['modality']
  registrationUrl: string
}

export interface EventFilters {
  search: string
  category: Category | 'Todas'
  modality: Event['modality'] | 'Todas'
}
