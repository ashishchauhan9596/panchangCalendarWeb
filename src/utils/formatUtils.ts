/**
 * Formatting Utilities for Panchang Display
 *
 * Specialized formatters for Hindu calendar data presentation.
 */

import type { TithiInfo, NakshatraInfo, PanchangData, TimePeriod } from '../engine/types';
import { formatTime12h, formatTimeRange } from './dateUtils';

/**
 * Format tithi as "Shukla Dwitiya" or "Krishna Ekadashi"
 */
export function formatTithi(tithi: TithiInfo): string {
  return tithi.name;
}

/**
 * Format tithi with short paksha prefix: "S. Dwitiya" or "K. Ekadashi"
 */
export function formatTithiShort(tithi: TithiInfo): string {
  const prefix = tithi.paksha === 'shukla' ? 'S.' : 'K.';
  let shortName = tithi.name.replace(/^(Shukla|Krishna)\s+/i, '');
  return `${prefix} ${shortName}`;
}

/**
 * Format elapsed percentage as "72% elapsed"
 */
export function formatElapsed(elapsed: number): string {
  return `${Math.round(elapsed * 100)}% elapsed`;
}

/**
 * Format a progress value (0-1) as a visual bar
 */
export function formatProgressBar(elapsed: number, width: number = 10): string {
  const filled = Math.round(elapsed * width);
  const empty = width - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

/**
 * Format Hindu date as "Jyeshtha Shukla Dwitiya"
 * (Month Paksha Tithi)
 */
export function formatHinduDate(panchangData: PanchangData): string {
  const month = panchangData.hinduMonth?.name ?? '';
  const tithi = formatTithi(panchangData.tithi);
  return month ? `${month} ${tithi}` : tithi;
}

/**
 * Format a compact one-line panchang summary
 * e.g., "Dwitiya | Rohini | Vishkumbha"
 */
export function formatPanchangSummary(data: PanchangData): string {
  return `${data.tithi.name} | ${data.nakshatra.name} | ${data.yoga.name}`;
}

/**
 * Format sunrise notification body text
 */
export function formatSunriseNotification(data: PanchangData): string {
  const sunriseTime = formatTime12h(data.sunrise);
  const tithiStr = formatTithi(data.tithi);
  const festivalStr =
    data.festivals.length > 0 ? ` 🎉 ${data.festivals[0].name}` : '';
  return `🌅 Sunrise at ${sunriseTime} | ${tithiStr} | ${data.nakshatra.name}${festivalStr}`;
}

/**
 * Format degrees to a readable longitude string
 * e.g., "72° 34' 12\""
 */
export function formatDegrees(degrees: number): string {
  const d = Math.floor(degrees);
  const mFloat = (degrees - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.round((mFloat - m) * 60);
  return `${d}° ${m}' ${s}"`;
}

/**
 * Get the zodiac sign name for a given sidereal longitude
 */
export function getZodiacSign(longitude: number): string {
  const signs = [
    'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)',
    'Karka (Cancer)', 'Simha (Leo)', 'Kanya (Virgo)',
    'Tula (Libra)', 'Vrischika (Scorpio)', 'Dhanu (Sagittarius)',
    'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)',
  ];
  const index = Math.floor(longitude / 30) % 12;
  return signs[index];
}
