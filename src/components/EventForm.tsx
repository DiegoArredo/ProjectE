import { useState } from 'react'
import type { EventDraft } from '../types'
import { categories, units } from '../data'

interface EventFormProps {
  onSubmit: (draft: EventDraft, status: 'draft' | 'published') => Promise<void>
}

const emptyDraft: EventDraft = { title: '', description: '', category: 'Académico', organizerUnit: units[0], date: '', startTime: '', endTime: '', location: '', modality: 'Presencial', registrationUrl: '' }

export function EventForm({ onSubmit }: EventFormProps) {
  const [draft, setDraft] = useState<EventDraft>(emptyDraft)
  const [error, setError] = useState('')
  const update = (field: keyof EventDraft, value: string) => setDraft((current) => ({ ...current, [field]: value }))
  const submit = async (status: 'draft' | 'published') => {
    if (status === 'published' && (!draft.title || !draft.description || !draft.date || !draft.startTime || !draft.endTime || !draft.location)) {
      setError('Completa los campos obligatorios antes de publicar.')
      return
    }
    if (draft.startTime && draft.endTime && draft.endTime <= draft.startTime) {
      setError('La hora de término debe ser posterior a la hora de inicio.')
      return
    }
    setError('')
    await onSubmit(draft, status)
    if (status === 'published') setDraft(emptyDraft)
  }
  return (
    <div className="form-card">
      <div className="form-heading"><div><span className="eyebrow">Nuevo evento</span><h2>Comparte una actividad con la comunidad</h2></div><span className="step-badge">1 de 1</span></div>
      {error && <div className="form-error">{error}</div>}
      <div className="form-grid">
        <label className="field field-wide"><span>Nombre del evento <i>*</i></span><input value={draft.title} onChange={(e) => update('title', e.target.value)} placeholder="Ej. Seminario de inteligencia artificial" /></label>
        <label className="field field-wide"><span>Descripción <i>*</i></span><textarea value={draft.description} onChange={(e) => update('description', e.target.value)} placeholder="Cuenta brevemente de qué se trata..." rows={4} /></label>
        <label className="field"><span>Categoría <i>*</i></span><select value={draft.category} onChange={(e) => update('category', e.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
        <label className="field"><span>Unidad organizadora <i>*</i></span><select value={draft.organizerUnit} onChange={(e) => update('organizerUnit', e.target.value)}>{units.map((unit) => <option key={unit}>{unit}</option>)}</select></label>
        <label className="field"><span>Fecha <i>*</i></span><input type="date" value={draft.date} onChange={(e) => update('date', e.target.value)} /></label>
        <label className="field"><span>Modalidad</span><select value={draft.modality} onChange={(e) => update('modality', e.target.value)}><option>Presencial</option><option>Online</option><option>Híbrido</option></select></label>
        <label className="field"><span>Hora de inicio <i>*</i></span><input type="time" value={draft.startTime} onChange={(e) => update('startTime', e.target.value)} /></label>
        <label className="field"><span>Hora de término <i>*</i></span><input type="time" value={draft.endTime} onChange={(e) => update('endTime', e.target.value)} /></label>
        <label className="field field-wide"><span>Ubicación <i>*</i></span><input value={draft.location} onChange={(e) => update('location', e.target.value)} placeholder="Ej. Auditorio Enrique d’Etigny" /></label>
        <label className="field field-wide"><span>Enlace de inscripción</span><input type="url" value={draft.registrationUrl} onChange={(e) => update('registrationUrl', e.target.value)} placeholder="https://..." /></label>
      </div>
      <div className="form-actions"><button className="button button-outline" onClick={() => submit('draft')}>Guardar borrador</button><button className="button button-primary" onClick={() => submit('published')}>Publicar evento</button></div>
    </div>
  )
}
