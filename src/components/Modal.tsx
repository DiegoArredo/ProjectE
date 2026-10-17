import { X, CalendarDays, Clock3, MapPin, ExternalLink, Check } from 'lucide-react'
import type { Event } from '../types'

interface ModalProps {
  event: Event
  saved: boolean
  onClose: () => void
  onSave: (event: Event) => void
}

export function EventModal({ event, saved, onClose, onSave }: ModalProps) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(click) => click.stopPropagation()}>
        <div className={`modal-banner accent-${event.accent}`}><span className="category-pill">{event.category}</span><button className="close-button" onClick={onClose}><X size={20} /></button></div>
        <div className="modal-content">
          <div className="eyebrow">{event.organizerUnit}</div>
          <h2>{event.title}</h2>
          <p className="modal-description">{event.description}</p>
          <div className="detail-grid">
            <div><CalendarDays size={18} /><span><strong>Fecha</strong>{new Date(`${event.date}T12:00:00`).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}</span></div>
            <div><Clock3 size={18} /><span><strong>Horario</strong>{event.startTime} – {event.endTime}</span></div>
            <div><MapPin size={18} /><span><strong>Ubicación</strong>{event.location} · {event.modality}</span></div>
          </div>
          <div className="modal-actions"><button className={`button ${saved ? 'button-soft' : 'button-primary'}`} onClick={() => onSave(event)}>{saved ? <><Check size={17} /> Guardado en mi calendario</> : <><CalendarDays size={17} /> Guardar en mi calendario</>}</button><a className="button button-outline" href={event.registrationUrl} target="_blank" rel="noreferrer">Inscribirme <ExternalLink size={16} /></a></div>
        </div>
      </div>
    </div>
  )
}
