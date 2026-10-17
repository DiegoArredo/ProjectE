import { useEffect, useMemo, useState } from 'react'
import { Bell, CalendarDays, ChevronRight, CircleUserRound, LayoutDashboard, ListFilter, Menu, Search, Settings2, Sparkles, UsersRound, X } from 'lucide-react'
import { Logo } from './components/Logo'
import { EventCard } from './components/EventCard'
import { EventForm } from './components/EventForm'
import { EventModal } from './components/Modal'
import { eventsApi } from './services/api'
import { categories } from './data'
import type { Event, EventDraft, EventFilters, Role } from './types'
import './styles.css'

type View = 'home' | 'calendar' | 'create' | 'admin' | 'preferences'
const roleLabels: Record<Role, string> = { member: 'Miembro FCFM', organizer: 'Organizador', admin: 'Administrador' }

function App() {
  const [events, setEvents] = useState<Event[]>([])
  const [savedIds, setSavedIds] = useState<string[]>(() => JSON.parse(localStorage.getItem('agenda-fcfm-saved') ?? '[]') as string[])
  const [view, setView] = useState<View>('home')
  const [role, setRole] = useState<Role>('member')
  const [filters, setFilters] = useState<EventFilters>({ search: '', category: 'Todas', modality: 'Todas' })
  const [selected, setSelected] = useState<Event | null>(null)
  const [toast, setToast] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    eventsApi.list()
      .then(setEvents)
      .catch(() => setToast('No se pudieron cargar los eventos'))
      .finally(() => setLoading(false))
  }, [])
  useEffect(() => { localStorage.setItem('agenda-fcfm-saved', JSON.stringify(savedIds)) }, [savedIds])
  useEffect(() => { if (toast) { const id = window.setTimeout(() => setToast(''), 2800); return () => window.clearTimeout(id) } }, [toast])

  const published = events.filter((event) => event.status === 'published')
  const filtered = useMemo(() => published.filter((event) => {
    const term = filters.search.toLowerCase()
    return (!term || `${event.title} ${event.description} ${event.organizerUnit}`.toLowerCase().includes(term)) &&
      (filters.category === 'Todas' || event.category === filters.category) &&
      (filters.modality === 'Todas' || event.modality === filters.modality)
  }), [published, filters])
  const savedEvents = published.filter((event) => savedIds.includes(event.id))

  const saveEvent = (event: Event) => {
    const wasSaved = savedIds.includes(event.id)
    setSavedIds((ids) => wasSaved ? ids.filter((id) => id !== event.id) : [...ids, event.id])
    setToast(wasSaved ? 'Evento quitado de tu calendario' : 'Evento guardado en tu calendario')
  }
  const createEvent = async (draft: EventDraft, status: 'draft' | 'published') => {
    const event = await eventsApi.create(draft, status)
    setEvents((current) => [event, ...current])
    setToast(status === 'published' ? 'Evento publicado correctamente' : 'Borrador guardado')
    if (status === 'published') setView('home')
  }

  const navigate = (nextView: View) => { setView(nextView); setMobileOpen(false) }
  return (
    <div className="app-shell">
      <header className="topbar"><div className="topbar-inner"><button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X /> : <Menu />}</button><Logo /><nav className={mobileOpen ? 'nav-links mobile-visible' : 'nav-links'}><button className={view === 'home' ? 'active' : ''} onClick={() => navigate('home')}>Explorar</button><button className={view === 'calendar' ? 'active' : ''} onClick={() => navigate('calendar')}>Mi calendario <span className="nav-count">{savedIds.length}</span></button><button className={view === 'create' ? 'active' : ''} onClick={() => navigate('create')}>Crear evento</button></nav><div className="top-actions"><button className="icon-button notification-button"><Bell size={19} /><i /></button><div className="role-switcher"><CircleUserRound size={18} /><select value={role} onChange={(e) => setRole(e.target.value as Role)}><option value="member">Miembro FCFM</option><option value="organizer">Organizador</option><option value="admin">Administrador</option></select></div></div></div></header>
      <main className="main-content">
        {view === 'home' && <><section className="hero"><div className="hero-copy"><div className="eyebrow hero-eyebrow"><span className="live-dot" /> Agenda de la comunidad FCFM</div><h1>Todo lo que pasa<br /><em>en Beauchef.</em></h1><p>Descubre actividades, seminarios y encuentros de la facultad. Guarda los que te interesan y arma tu propia agenda.</p><div className="hero-actions"><button className="button button-primary" onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}>Explorar eventos <ChevronRight size={17} /></button><button className="text-button" onClick={() => navigate('create')}>¿Organizas una actividad? <span>Publícala aquí</span></button></div></div><div className="hero-calendar"><div className="calendar-decoration"><div className="decoration-head"><span>OCTUBRE 2026</span><CalendarDays size={20} /></div><div className="decoration-week">{['L','M','M','J','V','S','D'].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div><div className="decoration-days">{Array.from({ length: 21 }, (_, index) => <span className={index === 16 ? 'selected-day' : index === 20 ? 'highlight-day' : ''} key={index}>{index + 1}</span>)}</div></div><div className="floating-event"><span className="floating-icon"><Sparkles size={16} /></span><span><strong>3 eventos</strong><small>en tu calendario</small></span></div></div></section><section className="stats-strip"><div><strong>{published.length}</strong><span>Eventos publicados</span></div><div><strong>4</strong><span>Categorías activas</span></div><div><strong>100%</strong><span>Comunidad FCFM</span></div><div className="stats-message"><Sparkles size={17} /> <span>Encuentra algo que te inspire hoy</span></div></section><section className="events-section" id="events"><div className="section-heading"><div><div className="eyebrow">Cartelera abierta</div><h2>Próximos eventos</h2></div><button className="view-all-button" onClick={() => setFilters((current) => ({ ...current, search: '', category: 'Todas', modality: 'Todas' }))}>Ver todos <ChevronRight size={17} /></button></div><div className="filters-bar"><div className="search-box"><Search size={18} /><input value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="Busca por nombre, tema o unidad..." /></div><div className="select-filter"><ListFilter size={17} /><select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value as EventFilters['category'] })}><option value="Todas">Todas las categorías</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></div><div className="select-filter"><select value={filters.modality} onChange={(e) => setFilters({ ...filters, modality: e.target.value as EventFilters['modality'] })}><option value="Todas">Todas las modalidades</option><option value="Presencial">Presencial</option><option value="Online">Online</option><option value="Híbrido">Híbrido</option></select></div></div>{loading ? <div className="empty-state">Cargando eventos...</div> : filtered.length ? <div className="events-grid">{filtered.map((event) => <EventCard key={event.id} event={event} saved={savedIds.includes(event.id)} onSave={saveEvent} onOpen={setSelected} />)}</div> : <div className="empty-state"><Search size={30} /><h3>No encontramos eventos</h3><p>Prueba con otra búsqueda o limpia los filtros.</p></div>}</section></>}
        {view === 'calendar' && <section className="page-section"><div className="section-heading"><div><div className="eyebrow">Tu espacio personal</div><h1>Mi calendario</h1><p className="page-subtitle">Tus actividades guardadas, en un solo lugar.</p></div><span className="calendar-count">{savedEvents.length} guardados</span></div>{savedEvents.length ? <div className="events-grid">{savedEvents.map((event) => <EventCard key={event.id} event={event} saved onSave={saveEvent} onOpen={setSelected} />)}</div> : <div className="empty-state large"><CalendarDays size={38} /><h3>Aún no tienes eventos guardados</h3><p>Explora la cartelera y guarda las actividades que no te quieres perder.</p><button className="button button-primary" onClick={() => navigate('home')}>Explorar eventos</button></div>}</section>}
        {view === 'create' && <section className="page-section narrow"><div className="section-heading"><div><div className="eyebrow">Panel de {roleLabels.organizer.toLowerCase()}</div><h1>Publicar un evento</h1><p className="page-subtitle">Llega a toda la comunidad FCFM en menos de 3 pasos.</p></div></div><EventForm onSubmit={createEvent} /></section>}
        {view === 'preferences' && <section className="page-section narrow"><div className="section-heading"><div><div className="eyebrow">Personaliza tu experiencia</div><h1>Tus intereses</h1></div></div><div className="preferences-card"><p>Selecciona los temas que te interesan para recibir mejores recomendaciones.</p>{categories.map((category) => <button className="preference-option" key={category}><span className={`preference-dot category-${category.toLowerCase()}`} />{category}<span>+</span></button>)}</div></section>}
        {view === 'admin' && <section className="page-section"><div className="section-heading"><div><div className="eyebrow">Vista institucional</div><h1>Panel de administración</h1><p className="page-subtitle">Una mirada rápida al estado de la agenda FCFM.</p></div></div><div className="admin-grid"><div className="admin-stat"><UsersRound /><strong>5.000</strong><span>Usuarios registrados</span></div><div className="admin-stat"><CalendarDays /><strong>{published.length}</strong><span>Eventos publicados</span></div><div className="admin-stat"><LayoutDashboard /><strong>4</strong><span>Unidades activas</span></div></div><div className="admin-table"><h3>Últimos eventos publicados</h3>{published.slice(0, 4).map((event) => <div className="admin-row" key={event.id}><span className={`status-dot status-${event.status}`} /><strong>{event.title}</strong><span>{event.organizerUnit}</span><small>Publicado</small></div>)}</div></section>}
      </main>
      <footer><Logo /><span>Calendario Digital Único de Eventos · FCFM</span><button onClick={() => navigate('preferences')}><Settings2 size={15} /> Preferencias</button><button onClick={() => navigate('admin')}><LayoutDashboard size={15} /> Admin demo</button></footer>
      {selected && <EventModal event={selected} saved={savedIds.includes(selected.id)} onClose={() => setSelected(null)} onSave={saveEvent} />}
      {toast && <div className="toast"><span className="toast-check">✓</span>{toast}</div>}
    </div>
  )
}

export default App
