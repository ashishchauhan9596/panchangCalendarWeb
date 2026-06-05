import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { computePanchang } from '../engine/astronomicalEngine'
import { formatDateLong, formatTime12h } from '../utils/dateUtils'
import { Sun, Moon } from 'lucide-react'

export const Route = createFileRoute('/panchang/$year/$month/$day')({
  component: PanchangDailyRoute,
})

function PanchangDailyRoute() {
  const { year, month, day } = Route.useParams()

  // Parse strings to numbers. 
  // TanStack Router params are strings.
  // Note: month from URL is typically 1-indexed (e.g. /panchang/2026/06/04 -> 6)
  // JavaScript Date expects 0-indexed months (0-11).
  const y = parseInt(year, 10)
  const m = parseInt(month, 10) - 1 
  const d = parseInt(day, 10)

  // Use UTC 6:00 AM initialization to perfectly match mobile app logic
  const selectedDate = useMemo(() => {
    return new Date(Date.UTC(y, m, d, 6, 0, 0))
  }, [y, m, d])

  const selectedPanchang = useMemo(() => {
    // 23.0225, 72.5714 are the default Ahmedabad coordinates
    return computePanchang(selectedDate, 23.0225, 72.5714, 'amant')
  }, [selectedDate])

  const activeFasts = selectedPanchang.festivals?.filter(
    (f: any) => f.category === 'fast' || f.category === 'swaminarayan' || f.importance === 'critical'
  ) || [];
  const hasFast = activeFasts.length > 0;

  return (
    <div className="min-h-screen bg-[#0D1B25] text-white p-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Panchang Calendar</h1>
          <p className="text-[var(--text-secondary)]">Daily Astronomical Data</p>
        </div>

        {/* Read-Only Today Summary Widget */}
        <div className="bento-card p-6 bg-[#132533] rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-4 relative z-10">
            Selected Date
          </h2>
          <div className="text-3xl font-bold text-gold mb-2 relative z-10">
            {formatDateLong(selectedDate)}
          </div>
          <div className="text-xl mb-6 relative z-10">
            {selectedPanchang.tithi?.name}
          </div>
          
          <div className="flex items-center justify-between text-base py-3 border-t border-[var(--border-card)] relative z-10">
            <div className="flex items-center gap-2"><Sun className="w-5 h-5 text-gold" /> Sunrise</div>
            <span className="font-medium">{formatTime12h(selectedPanchang.sunrise)}</span>
          </div>
          <div className="flex items-center justify-between text-base py-3 border-t border-[var(--border-card)] relative z-10">
            <div className="flex items-center gap-2"><Moon className="w-5 h-5 text-[#7BBBD0]" /> Sunset</div>
            <span className="font-medium">{formatTime12h(selectedPanchang.sunset)}</span>
          </div>

          {/* Rahu Kaal Warning Banner */}
          <div className="flex items-center justify-center gap-2 bg-[#FF4B4B]/10 border border-[#FF4B4B]/20 rounded-lg py-3 px-4 mt-6 relative z-10">
            <span className="text-sm">⚠️</span>
            <span className="text-[#D97080] text-sm font-bold">
              Rahu Kaal: {formatTime12h(selectedPanchang.rahuKaal.start)} - {formatTime12h(selectedPanchang.rahuKaal.end)}
            </span>
          </div>

          {/* Fast / Festival Banner */}
          {hasFast && (
            <div className="flex items-center bg-[#FF8E3C]/10 border border-[#FF8E3C]/25 rounded-lg py-3 px-4 mt-3 relative z-10">
              <span className="text-xl mr-3">🕉️</span>
              <span className="text-[#FF8E3C] text-base font-bold flex-1 truncate" title={activeFasts.map((f: any) => f.name).join(', ')}>
                {activeFasts.map((f: any) => f.name).join(', ')}
              </span>
            </div>
          )}
        </div>
        
        <div className="text-center mt-8">
          <a href="/" className="text-sm text-gold hover:underline">
            &larr; Back to Full Calendar
          </a>
        </div>
      </div>
    </div>
  )
}
