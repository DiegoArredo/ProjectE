import { CalendarDays } from 'lucide-react'

export function Logo() {
  return (
    <div className="brand">
      <span className="brand-mark"><CalendarDays size={22} strokeWidth={2.2} /></span>
      <span>agenda<span className="brand-light">FCFM</span></span>
    </div>
  )
}
