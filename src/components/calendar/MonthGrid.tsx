import React, { useMemo } from 'react';
import { DayCell, EmptyCell } from './DayCell';
import { getDaysInMonth, getFirstWeekdayOfMonth, isSameDay, isToday } from '../../utils/dateUtils';
import type { FestivalInfo, TithiInfo } from '../../engine/types';

interface MonthGridProps {
  year: number;
  month: number;
  selectedDate: Date;
  daysData?: Record<number, { tithi: TithiInfo; festivals: FestivalInfo[] }>;
  onDayPress: (date: Date) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function MonthGrid({
  year,
  month,
  selectedDate,
  daysData = {},
  onDayPress,
}: MonthGridProps) {
  const { weeks } = useMemo(() => {
    const totalDays = getDaysInMonth(year, month);
    const startDay = getFirstWeekdayOfMonth(year, month);

    const rows: (number | null)[][] = [];
    let currentRow: (number | null)[] = [];

    // Leading empty cells
    for (let i = 0; i < startDay; i++) {
      currentRow.push(null);
    }

    // Day cells
    for (let day = 1; day <= totalDays; day++) {
      currentRow.push(day);
      if (currentRow.length === 7) {
        rows.push(currentRow);
        currentRow = [];
      }
    }

    // Trailing empty cells
    if (currentRow.length > 0) {
      while (currentRow.length < 7) {
        currentRow.push(null);
      }
      rows.push(currentRow);
    }

    return { weeks: rows };
  }, [year, month]);

  return (
    <div className="w-full flex flex-col mt-4">
      {/* Weekday Headers */}
      <div className="flex flex-row border-b border-white/10 pb-2 mb-2">
        {WEEKDAYS.map((day, i) => (
          <div key={i} className="flex-1 text-center">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                i === 0 ? 'text-[#D97080]' : i === 6 ? 'text-[#7BBBD0]' : 'text-[var(--text-tertiary)]'
              }`}
            >
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* Day Grid */}
      <div className="flex flex-col gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-row w-full">
            {week.map((day, dayIndex) => {
              if (day === null) {
                return <EmptyCell key={`empty-${weekIndex}-${dayIndex}`} />;
              }
              const date = new Date(Date.UTC(year, month, day, 6, 0, 0));
              const dayData = daysData[day];
              return (
                <DayCell
                  key={day}
                  day={day}
                  isToday={isToday(date)}
                  isSelected={isSameDay(date, selectedDate)}
                  isCurrentMonth={true}
                  tithi={dayData?.tithi}
                  festivals={dayData?.festivals || []}
                  onPress={() => onDayPress(date)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
