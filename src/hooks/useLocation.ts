import { useEffect, useRef, useCallback } from 'react';
import * as Location from 'expo-location';

export interface GpsPoint {
  lat: number;
  lng: number;
  ts:  number;
}

/**
 * Starts foreground location updates when `enabled` is true.
 * Calls `onPoint` each time a new GPS fix arrives.
 * Returns a `getLastPoint()` helper for tagging events.
 */
export function useLocation(enabled: boolean, onPoint?: (p: GpsPoint) => void) {
  const lastPoint  = useRef<GpsPoint | null>(null);
  const subscriber = useRef<Location.LocationSubscription | null>(null);

  const getLastPoint = useCallback((): GpsPoint | null => lastPoint.current, []);

  useEffect(() => {
    if (!enabled) {
      subscriber.current?.remove();
      subscriber.current = null;
      lastPoint.current  = null;
      return;
    }

    let cancelled = false;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted' || cancelled) return;

      subscriber.current = await Location.watchPositionAsync(
        {
          accuracy:          Location.Accuracy.High,
          distanceInterval:  5,    // update every 5 m
          timeInterval:      2000, // or every 2 s
        },
        (loc) => {
          const point: GpsPoint = {
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
            ts:  loc.timestamp,
          };
          lastPoint.current = point;
          onPoint?.(point);
        }
      );
    })();

    return () => {
      cancelled = true;
      subscriber.current?.remove();
      subscriber.current = null;
    };
  }, [enabled, onPoint]);

  return { getLastPoint };
}
