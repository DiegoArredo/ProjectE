import { ArrowUpRight, Clock3, MapPin, Plus, Check } from 'lucide-react'
import type { Event } from '../types'

interface EventCardProps {
  event: Event
  saved: boolean
  onSave: (event: Event) => void
  onOpen: (event: Event) => void
}

const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

export function EventCard({ event, saved, onSave, onOpen }: EventCardProps) {
  const date = new Date(`${event.date}T12:00:00`)
  return (
    <article className={`event-card accent-${event.accent}`}>
      <div className="event-card-top">
        <span className="date-tile"><strong>{date.getDate()}</strong><small>{months[date.getMonth()]}</small></span>
        <span className={`category-pill category-${event.category.toLowerCase()}`}>{event.category}</span>
        <button className={`save-button ${saved ? 'is-saved' : ''}`} onClick={() => onSave(event)} aria-label={saved ? 'Quitar de mi calendario' : 'Guardar en mi calendario'}>
          {saved ? <Check size={17} /> : <Plus size={18} />}
        </button>
      </div>
      <button className="card-title-button" onClick={() => onOpen(event)}><h3>{event.title}</h3><ArrowUpRight size={19} /></button>
      <p className="card-description">{event.description}</p>
      <div className="event-meta"><span><Clock3 size={15} /> {event.startTime} – {event.endTime}</span><span><MapPin size={15} /> {event.location}</span></div>
      <div className="event-card-footer"><span className="organizer">{event.organizerUnit}</span><button className="link-button" onClick={() => onOpen(event)}>Ver detalle <ArrowUpRight size={15} /></button></div>
    </article>
  )
}
