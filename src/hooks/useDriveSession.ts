import { useCallback, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import { useDrive }         from '../context/DriveContext';
import { useSensors }       from './useSensors';
import { useEventDetection } from './useEventDetection';
import { useLocation }      from './useLocation';
import { saveSession }      from '../services/storage';
import { computeSafetyRating } from '../services/scoring';
import { DriveEvent, DriveSession } from '../types';
import { magnitude }        from '../utils/sensorMath';
import { SensorReading }    from '../types';

export function useDriveSession() {
  const { state, dispatch } = useDrive();
  const sessionStartRef = useRef<number | null>(null);

  // ── GPS ──────────────────────────────────────────────────────────────────────
  const { getLastPoint } = useLocation(state.isSessionActive);

  // ── Event handler ────────────────────────────────────────────────────────────
  const handleEvent = useCallback((event: DriveEvent) => {
    dispatch({ type: 'LOG_EVENT', payload: event });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
  }, [dispatch]);

  const { checkReading } = useEventDetection(handleEvent, sessionStartRef.current);

  // ── Sensor reading handler ────────────────────────────────────────────────────
  const handleSensorReading = useCallback((r: SensorReading) => {
    const accelMag = magnitude(r.ax, r.ay, r.az - 9.81);
    const gyroMag  = magnitude(r.gx, r.gy, r.gz);
    dispatch({ type: 'UPDATE_SENSORS', payload: { accelMag, gyroMag } });

    // Pass last GPS fix so events are geo-tagged
    const loc = getLastPoint();
    checkReading(r, loc ? { lat: loc.lat, lng: loc.lng } : undefined);
  }, [dispatch, getLastPoint, checkReading]);

  useSensors(handleSensorReading, state.isSessionActive);

  // ── Public API ────────────────────────────────────────────────────────────────

  const startDrive = useCallback(() => {
    const now = Date.now();
    sessionStartRef.current = now;
    dispatch({ type: 'START_DRIVE', payload: { id: `drive_${now}`, startTime: now } });
  }, [dispatch]);

  /**
   * Finalises the session, persists it, and returns the completed DriveSession.
   */
  const endDrive = useCallback(async (): Promise<DriveSession | null> => {
    if (!state.currentSession) return null;

    const endTime       = Date.now();
    const durationMs    = endTime - state.currentSession.startTime;
    const finalScore    = state.currentSession.finalScore;
    const safetyRating  = computeSafetyRating(finalScore);
    const distanceMiles = 0; // GPS distance accumulation is a stretch goal

    const completed: DriveSession = {
      ...state.currentSession,
      endTime, durationMs, finalScore, safetyRating, distanceMiles,
    };

    dispatch({ type: 'END_DRIVE', payload: { endTime, distanceMiles } });
    await saveSession(completed);
    sessionStartRef.current = null;
    return completed;
  }, [state.currentSession, dispatch]);

  return { startDrive, endDrive, state };
}
