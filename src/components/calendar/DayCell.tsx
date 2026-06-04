import React from 'react';
import type { TithiInfo, FestivalInfo } from '../../engine/types';
import { formatTithiShort } from '../../utils/formatUtils';

interface DayCellProps {
  day: number;
  isToday: boolean;
  isSelected: boolean;
  isCurrentMonth: boolean;
  tithi?: TithiInfo;
  festivals?: FestivalInfo[];
  onPress: () => void;
}

const DOT_COLORS: Record<string, string> = {
  major_festival: '#FFD700',
  fast: '#FF6B35',
  auspicious: '#4CAF50',
  national: '#2196F3',
  swaminarayan: '#E91E63',
};

export function DayCell({
  day,
  isToday,
  isSelected,
  isCurrentMonth,
  tithi,
  festivals = [],
  onPress,
}: DayCellProps) {
  const isEkadashi = tithi?.pakshaNumber === 11;
  const isPoonamAmas = tithi?.pakshaNumber === 15;
  const hasMajorFest = festivals.some(
    (f) => f.category === 'swaminarayan' || f.importance === 'critical'
  );
  const isSpecialDay = isEkadashi || isPoonamAmas || hasMajorFest;

  // Determine outer container styling based on state
  let containerClasses = "w-full h-[80px] rounded-xl flex flex-col justify-between items-center py-1 px-1 transition-all cursor-pointer border ";
  
  if (!isCurrentMonth) {
    containerClasses += "opacity-30 bg-white/5 border-white/10 ";
  } else if (isToday) {
    containerClasses += "bg-[#FF6B35] border-[#FF6B35]/60 shadow-[0_4px_10px_rgba(255,107,53,0.6)] ";
  } else if (isSelected) {
    containerClasses += "bg-[#00D2FF]/10 border-[#00D2FF] border-2 shadow-[0_0_6px_rgba(0,210,255,0.25)] ";
  } else if (isSpecialDay) {
    containerClasses += "bg-[#FFD700]/5 border-y-white/10 border-r-white/10 border-l-[3px] border-l-[#FFD700] ";
  } else {
    containerClasses += "bg-white/5 border-white/10 hover:bg-white/10 ";
  }

  // Determine day number text styling
  let dayTextClasses = "text-lg font-bold leading-tight ";
  if (isToday) {
    dayTextClasses += "text-white text-xl ";
  } else if (isSelected) {
    dayTextClasses += "text-[#00D2FF] ";
  } else if (isSpecialDay && isCurrentMonth) {
    dayTextClasses += "text-[#FFD700] font-extrabold ";
  } else if (!isCurrentMonth) {
    dayTextClasses += "text-[var(--text-tertiary)] ";
  } else {
    dayTextClasses += "text-white ";
  }

  // Determine Tithi subtext styling
  let tithiTextClasses = "text-[10px] font-medium text-center px-1 truncate w-full ";
  if (isToday) {
    tithiTextClasses += "text-white/90 font-bold ";
  } else if (isSelected) {
    tithiTextClasses += "text-[#00D2FF] font-bold ";
  } else if (isSpecialDay && isCurrentMonth) {
    tithiTextClasses += "text-[#FFD700] font-bold ";
  } else {
    tithiTextClasses += "text-[var(--text-tertiary)] ";
  }

  return (
    <div className="flex-1 px-1 py-1" onClick={onPress}>
      <div className={containerClasses}>
        <span className={dayTextClasses}>{day}</span>
        
        {tithi && (
          <span className={tithiTextClasses} title={tithi.name}>
            {formatTithiShort(tithi)}
          </span>
        )}

        <div className="flex flex-row justify-center items-center gap-[2px] h-2 w-full mt-1">
          {festivals.slice(0, 3).map((f, i) => (
            <div
              key={f.id || i}
              className="w-[6px] h-[6px] rounded-full"
              style={{ backgroundColor: DOT_COLORS[f.category] ?? '#9C27B0' }}
              title={f.name}
            />
          ))}
          {festivals.length > 3 && (
            <span className="text-[var(--text-tertiary)] text-[8px] font-bold leading-none ml-[2px]">
              +{festivals.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function EmptyCell() {
  return <div className="flex-1 px-1 py-1"></div>;
}
