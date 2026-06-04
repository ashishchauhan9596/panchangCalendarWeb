import React, { useMemo } from 'react';
import { computePanchang } from '../engine/astronomicalEngine';
import { MonthGrid } from './calendar/MonthGrid';

interface BigCalendarProps {
  viewYear: number;
  viewMonth: number;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

// Default coordinates (Ahmedabad) to match mobile app for Panchang calculation parity
const DEFAULT_LAT = 23.0225;
const DEFAULT_LNG = 72.5714;
const SYS: 'amant' | 'purnimant' = 'amant';

export function BigCalendar({ viewYear, viewMonth, selectedDate, onDateSelect }: BigCalendarProps) {
  
  // Compute panchang data for the entire month
  const daysData = useMemo(() => {
    const data: Record<number, any> = {};
    const totalDays = getDaysInMonth(viewYear, viewMonth);
    
    for (let day = 1; day <= totalDays; day++) {
      // Use exact UTC offset that mobile app uses for Panchang engine compatibility
      const date = new Date(Date.UTC(viewYear, viewMonth, day, 6, 0, 0));
      try {
        const panchang = computePanchang(date, DEFAULT_LAT, DEFAULT_LNG, SYS);
        data[day] = {
          tithi: panchang.tithi,
          festivals: panchang.festivals || [],
        };
      } catch (err) {
        data[day] = { tithi: null, festivals: [] };
      }
    }
    return data;
  }, [viewYear, viewMonth]);

  return (
    <div className="flex flex-col h-full w-full bg-[var(--bg-surface)]">
      <MonthGrid
        year={viewYear}
        month={viewMonth}
        selectedDate={selectedDate}
        daysData={daysData}
        onDayPress={onDateSelect}
      />
    </div>
  );
}
