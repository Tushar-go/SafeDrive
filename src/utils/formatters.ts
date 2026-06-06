import { format, intervalToDuration } from 'date-fns';
import { SafetyRating } from '../types';
import { THRESHOLDS } from '../constants/thresholds';
import { COLORS } from '../constants/theme';

export function formatDriveDuration(ms: number): string {
  if (ms < 60_000) return `${Math.floor(ms / 1000)}s`;
  const dur = intervalToDuration({ start: 0, end: ms });
  if ((dur.hours ?? 0) > 0) return `${dur.hours}h ${dur.minutes}m`;
  return `${dur.minutes}m`;
}

export function formatDriveDate(ts: number): string {
  return format(new Date(ts), 'MMM d, yyyy');
}

export function formatDriveTime(ts: number): string {
  return format(new Date(ts), 'h:mm a');
}

export function formatDriveDateFull(ts: number): string {
  return format(new Date(ts), 'MMMM d, yyyy');
}

/** ms-since-drive-start → "00:14" */
export function formatSessionTimestamp(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

/** ms → "00:14:32" live timer */
export function formatLiveTimer(ms: number): string {
  const s  = Math.floor(ms / 1000);
  const h  = Math.floor(s / 3600);
  const m  = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  if (h > 0)
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
}

export function getSafetyRating(score: number): SafetyRating {
  if (score >= THRESHOLDS.RATINGS.EXCELLENT) return 'Excellent';
  if (score >= THRESHOLDS.RATINGS.GOOD)      return 'Good';
  if (score >= THRESHOLDS.RATINGS.FAIR)      return 'Fair';
  return 'Poor';
}

export function getRatingColor(rating: SafetyRating): string {
  switch (rating) {
    case 'Excellent': return COLORS.scoreGreen;
    case 'Good':      return COLORS.scoreYellow;
    case 'Fair':      return COLORS.scoreOrange;
    case 'Poor':      return COLORS.scoreRed;
  }
}

export function getScoreColor(score: number): string {
  if (score >= 90) return COLORS.scoreGreen;
  if (score >= 75) return COLORS.scoreYellow;
  if (score >= 55) return COLORS.scoreOrange;
  return COLORS.scoreRed;
}

export function formatDistance(miles: number): string {
  return `${miles.toFixed(1)} mi`;
}
