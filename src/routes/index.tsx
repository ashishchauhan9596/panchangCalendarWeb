import { createFileRoute } from '@tanstack/react-router'
import { Download, Calendar as CalendarIcon, Clock, Sun, Moon } from 'lucide-react'
import { useState, useMemo } from 'react'
import { BigCalendar } from '../components/BigCalendar'
import { QRCodeSVG } from 'qrcode.react'
import { computePanchang } from '../engine/astronomicalEngine'
import { formatTime12h, formatDateLong } from '../utils/dateUtils'

export const Route = createFileRoute('/')({ component: Dashboard })

function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0));
  })
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth())
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear())

  // Compute selected day panchang (Ahmedabad coordinates to match mobile default)
  const selectedPanchang = useMemo(() => {
    return computePanchang(selectedDate, 23.0225, 72.5714, 'amant')
  }, [selectedDate])

  const activeFasts = selectedPanchang.festivals?.filter(
    (f: any) => f.category === 'fast' || f.category === 'swaminarayan' || f.importance === 'critical'
  ) || [];
  const hasFast = activeFasts.length > 0;

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(y => y - 1)
    } else {
      setViewMonth(m => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(y => y + 1)
    } else {
      setViewMonth(m => m + 1)
    }
  }

  // Pre-generate years and months for dropdowns
  const years = useMemo(() => Array.from({ length: 201 }, (_, i) => 1900 + i), []);
  const months = useMemo(() => [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ], []);

  const handleToday = () => {
    const today = new Date()
    setSelectedDate(today)
    setViewMonth(today.getMonth())
    setViewYear(today.getFullYear())
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 max-w-[1600px] mx-auto">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-full lg:w-72 flex flex-col gap-6 flex-shrink-0">
        <div className="flex items-center gap-4 pl-2">
          <img src="/logo.png" alt="Swarupa Panchang Logo" className="w-12 h-12 rounded-full shadow-lg" />
          <h1 className="text-xl font-bold tracking-wide">
            Swarupa<br /><span className="text-gold">Panchang</span>
          </h1>
        </div>

        {/* APK Download Banner */}
        <a 
          href="https://expo.dev/accounts/ashishchauhan9596/projects/swarupa-panchang/builds/dfc99c0e-f561-4141-8948-f4e876d734de"
          className="bento-card p-5 flex flex-col items-center justify-center text-center gap-4 transition-transform hover:scale-[1.02] active:scale-95 bg-[#182B38]"
        >
          <div className="bg-white p-2 rounded-lg">
            <QRCodeSVG 
              value="https://expo.dev/accounts/ashishchauhan9596/projects/swarupa-panchang/builds/dfc99c0e-f561-4141-8948-f4e876d734de" 
              size={120} 
              level="M"
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white flex items-center justify-center gap-2">
              <Download className="w-4 h-4 text-gold" />
              Download Android App
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Scan QR or click to get the native .apk for offline notifications</p>
          </div>
        </a>

        {/* Today Summary Widget */}
        <div className="bento-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-4">Selected Date</h2>
          <div className="text-2xl font-bold text-gold mb-1">{formatDateLong(selectedDate)}</div>
          <div className="text-lg mb-4">{selectedPanchang.tithi?.name}</div>
          
          <div className="flex items-center justify-between text-sm py-2 border-t border-[var(--border-card)]">
            <div className="flex items-center gap-2"><Sun className="w-4 h-4 text-gold" /> Sunrise</div>
            <span>{formatTime12h(selectedPanchang.sunrise)}</span>
          </div>
          <div className="flex items-center justify-between text-sm py-2 border-t border-[var(--border-card)]">
            <div className="flex items-center gap-2"><Moon className="w-4 h-4 text-[#7BBBD0]" /> Sunset</div>
            <span>{formatTime12h(selectedPanchang.sunset)}</span>
          </div>

          {/* Rahu Kaal Warning Banner */}
          <div className="flex items-center justify-center gap-2 bg-[#FF4B4B]/10 border border-[#FF4B4B]/20 rounded-md py-2 px-3 mt-4">
            <span className="text-xs">⚠️</span>
            <span className="text-[#D97080] text-xs font-bold">
              Rahu Kaal: {formatTime12h(selectedPanchang.rahuKaal.start)} - {formatTime12h(selectedPanchang.rahuKaal.end)}
            </span>
          </div>

          {/* Fast / Festival Banner */}
          {hasFast && (
            <div className="flex items-center bg-[#FF8E3C]/10 border border-[#FF8E3C]/25 rounded-md py-2 px-3 mt-2">
              <span className="text-base mr-2">🕉️</span>
              <span className="text-[#FF8E3C] text-sm font-bold flex-1 truncate" title={activeFasts.map((f: any) => f.name).join(', ')}>
                {activeFasts.map((f: any) => f.name).join(', ')}
              </span>
            </div>
          )}
        </div>
      </aside>

      {/* CENTER CANVAS - BIG CALENDAR */}
      <main className="flex-grow flex flex-col gap-6">
        <div className="bento-card p-6 h-full min-h-[600px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-gold" />
              <div className="flex gap-2">
                <select 
                  value={viewMonth}
                  onChange={(e) => setViewMonth(Number(e.target.value))}
                  className="bg-[#182B38] border border-[var(--border-card)] text-white text-lg font-bold rounded-lg px-3 py-1 outline-none focus:border-gold transition-colors cursor-pointer"
                >
                  {months.map((month, idx) => (
                    <option key={idx} value={idx}>{month}</option>
                  ))}
                </select>
                <select
                  value={viewYear}
                  onChange={(e) => setViewYear(Number(e.target.value))}
                  className="bg-[#182B38] border border-[var(--border-card)] text-white text-lg font-bold rounded-lg px-3 py-1 outline-none focus:border-gold transition-colors cursor-pointer"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handlePrevMonth} className="px-4 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-card)] hover:bg-[var(--border-card)] transition-colors cursor-pointer">Prev Month</button>
              <button onClick={handleToday} className="px-4 py-2 rounded-lg bg-gold text-[#0D1B25] font-semibold hover:bg-opacity-90 transition-colors cursor-pointer">Today</button>
              <button onClick={handleNextMonth} className="px-4 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-card)] hover:bg-[var(--border-card)] transition-colors cursor-pointer">Next Month</button>
            </div>
          </div>
          
          {/* Calendar Grid */}
          <div className="flex-grow rounded-xl overflow-hidden flex items-stretch justify-stretch">
            <BigCalendar 
              viewYear={viewYear} 
              viewMonth={viewMonth} 
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>
        </div>
      </main>

      {/* RIGHT PANEL - DEEP DIVE */}
      <aside className="w-full lg:w-80 flex flex-col gap-6 flex-shrink-0">
        <div className="bento-card p-6 h-full">
          <h2 className="text-lg font-bold border-b border-[var(--border-card)] pb-4 mb-4">Deep Dive Details</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">Select a date on the calendar to view full mathematical calculations.</p>
          
          <div className="space-y-4">
            <div className="p-3 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-card)]">
              <div className="text-xs text-[var(--text-secondary)] mb-1">Nakshatra</div>
              <div className="font-semibold text-white">{selectedPanchang.nakshatra?.name}</div>
            </div>
            <div className="p-3 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-card)]">
              <div className="text-xs text-[var(--text-secondary)] mb-1">Yoga</div>
              <div className="font-semibold text-white">{selectedPanchang.yoga?.name}</div>
            </div>
            <div className="p-3 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-card)]">
              <div className="text-xs text-[var(--text-secondary)] mb-1">Karana</div>
              <div className="font-semibold text-white">{selectedPanchang.karana?.name}</div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FF9B51]" /> Muhurats
              </h3>
              <div className="text-sm flex justify-between py-2 border-b border-[var(--border-card)]">
                <span className="text-[var(--text-secondary)]">Abhijit</span>
                <span>{formatTime12h(selectedPanchang.abhijitMuhurat.start)} - {formatTime12h(selectedPanchang.abhijitMuhurat.end)}</span>
              </div>
              <div className="text-sm flex justify-between py-2 border-b border-[var(--border-card)]">
                <span className="text-[var(--text-secondary)]">Rahu Kaal</span>
                <span className="text-[#FF9B51]">{formatTime12h(selectedPanchang.rahuKaal.start)} - {formatTime12h(selectedPanchang.rahuKaal.end)}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

    </div>
  )
}
