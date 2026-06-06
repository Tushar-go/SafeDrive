export type EventType =
  | 'HARSH_BRAKING'
  | 'SHARP_TURN'
  | 'HARSH_ACCELERATION'
  | 'PHONE_HANDLING'
  | 'AGGRESSIVE_STEERING'
  | 'EXCESSIVE_MOVEMENT';

export type SafetyRating = 'Excellent' | 'Good' | 'Fair' | 'Poor';

export interface DriveEvent {
  id: string;
  type: EventType;
  /** ms elapsed since drive start */
  timestamp: number;
  absoluteTime: number;
  pointsDeducted: number;
  location?: { lat: number; lng: number };
}

export interface SensorReading {
  ax: number; ay: number; az: number;
  gx: number; gy: number; gz: number;
}

export interface DriveSession {
  id: string;
  startTime: number;
  endTime?: number;
  durationMs?: number;
  events: DriveEvent[];
  finalScore: number;
  safetyRating?: SafetyRating;
  distanceMiles?: number;
}
