import { useRef, useCallback } from 'react';
import { SensorReading, DriveEvent, EventType } from '../types';
import { THRESHOLDS } from '../constants/thresholds';
import { magnitude } from '../utils/sensorMath';
import { getDeduction, getCooldown } from '../services/scoring';

type EventCB = (e: DriveEvent) => void;

export function useEventDetection(onEvent: EventCB, sessionStartTime: number | null) {
  const lastFired = useRef<Partial<Record<EventType, number>>>({});

  const tryFire = useCallback(
    (type: EventType, now: number, location?: { lat: number; lng: number }) => {
      const last = lastFired.current[type] ?? 0;
      if (now - last < getCooldown(type)) return;
      lastFired.current[type] = now;

      const event: DriveEvent = {
        id:             `${type}_${now}`,
        type,
        timestamp:      sessionStartTime ? now - sessionStartTime : 0,
        absoluteTime:   now,
        pointsDeducted: getDeduction(type),
        location,
      };
      onEvent(event);
    },
    [onEvent, sessionStartTime]
  );

  const checkReading = useCallback(
    (r: SensorReading, location?: { lat: number; lng: number }) => {
      if (!sessionStartTime) return;
      const now = Date.now();
      const { ax, ay, az, gx, gy, gz } = r;

      // ── Accelerometer ────────────────────────────────────────────────────────
      const gravRemoved = magnitude(ax, ay, az - 9.81);

      // Harsh braking  — strong negative-Y (forward jolt)
      if (ay < -THRESHOLDS.HARSH_BRAKING_G)
        tryFire('HARSH_BRAKING', now, location);

      // Harsh acceleration — strong positive-Y
      if (ay > THRESHOLDS.HARSH_ACCELERATION_G)
        tryFire('HARSH_ACCELERATION', now, location);

      // Phone handling — X-axis lateral jolt
      if (Math.abs(ax) > THRESHOLDS.PHONE_HANDLING_G)
        tryFire('PHONE_HANDLING', now, location);

      // Excessive movement — any massive jolt
      if (gravRemoved > THRESHOLDS.EXCESSIVE_MOVEMENT_G)
        tryFire('EXCESSIVE_MOVEMENT', now, location);

      // ── Gyroscope ────────────────────────────────────────────────────────────

      // Sharp turn — yaw (Z-axis rotation)
      if (Math.abs(gz) > THRESHOLDS.SHARP_TURN_RAD)
        tryFire('SHARP_TURN', now, location);

      // Aggressive steering — pitch/roll (X or Y)
      if (Math.max(Math.abs(gx), Math.abs(gy)) > THRESHOLDS.AGGRESSIVE_STEERING_RAD)
        tryFire('AGGRESSIVE_STEERING', now, location);
    },
    [sessionStartTime, tryFire]
  );

  return { checkReading };
}
