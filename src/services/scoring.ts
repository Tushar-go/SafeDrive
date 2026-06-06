import { EventType, SafetyRating } from '../types';
import { THRESHOLDS } from '../constants/thresholds';
import { getSafetyRating } from '../utils/formatters';

export function getDeduction(type: EventType): number {
  return THRESHOLDS.SCORE_DEDUCTIONS[type] ?? 2;
}

export function getCooldown(type: EventType): number {
  return THRESHOLDS.COOLDOWN_MS[type] ?? 2000;
}

export function computeFinalScore(events: { type: EventType }[]): number {
  return Math.max(0, events.reduce((acc, e) => acc - getDeduction(e.type), 100));
}

export function computeSafetyRating(score: number): SafetyRating {
  return getSafetyRating(score);
}

export const EVENT_LABELS: Record<EventType, string> = {
  HARSH_BRAKING:       'Harsh Braking',
  SHARP_TURN:          'Sharp Turn',
  HARSH_ACCELERATION:  'Harsh Acceleration',
  PHONE_HANDLING:      'Phone Handling',
  AGGRESSIVE_STEERING: 'Aggressive Steering',
  EXCESSIVE_MOVEMENT:  'Excessive Movement',
};
