import { useEffect, useRef, useCallback } from 'react';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import { SensorReading } from '../types';
import { THRESHOLDS } from '../constants/thresholds';
import { magnitude } from '../utils/sensorMath';

type SensorCB = (r: SensorReading) => void;

/**
 * Battery-adaptive sensor hook.
 *
 * While motion is detected (accel magnitude above IDLE_THRESHOLD_G after
 * removing gravity) polling runs at POLLING_INTERVAL_MS (100 ms / 10 Hz).
 *
 * When the phone is stationary the interval drops to POLLING_IDLE_MS (300 ms)
 * to save battery.  The switch happens after 10 consecutive idle readings.
 */
export function useSensors(onReading: SensorCB, enabled: boolean) {
  const accelRef = useRef({ x: 0, y: 0, z: 0 });
  const gyroRef  = useRef({ x: 0, y: 0, z: 0 });
  const accelSub = useRef<ReturnType<typeof Accelerometer.addListener> | null>(null);
  const gyroSub  = useRef<ReturnType<typeof Gyroscope.addListener> | null>(null);

  // Adaptive-polling state
  const idleCount    = useRef(0);
  const isIdle       = useRef(false);
  const IDLE_WINDOW  = 10; // consecutive idle readings before switching

  const setInterval = useCallback((idle: boolean) => {
    const ms = idle ? THRESHOLDS.POLLING_IDLE_MS : THRESHOLDS.POLLING_INTERVAL_MS;
    Accelerometer.setUpdateInterval(ms);
    Gyroscope.setUpdateInterval(ms);
  }, []);

  const fireReading = useCallback(() => {
    const { x: ax, y: ay, z: az } = accelRef.current;
    const { x: gx, y: gy, z: gz } = gyroRef.current;

    // Adaptive polling decision
    const motionMag = magnitude(ax, ay, az - 9.81);
    if (motionMag < THRESHOLDS.IDLE_THRESHOLD_G) {
      idleCount.current += 1;
      if (!isIdle.current && idleCount.current >= IDLE_WINDOW) {
        isIdle.current = true;
        setInterval(true);
      }
    } else {
      idleCount.current = 0;
      if (isIdle.current) {
        isIdle.current = false;
        setInterval(false);
      }
    }

    onReading({ ax, ay, az, gx, gy, gz });
  }, [onReading, setInterval]);

  useEffect(() => {
    if (!enabled) {
      accelSub.current?.remove();
      gyroSub.current?.remove();
      accelSub.current = null;
      gyroSub.current  = null;
      idleCount.current = 0;
      isIdle.current    = false;
      return;
    }

    setInterval(false);

    accelSub.current = Accelerometer.addListener((d) => {
      // expo-sensors returns g-force; convert to m/s²
      accelRef.current = { x: d.x * 9.81, y: d.y * 9.81, z: d.z * 9.81 };
      fireReading();
    });

    gyroSub.current = Gyroscope.addListener((d) => {
      gyroRef.current = d; // already rad/s
    });

    return () => {
      accelSub.current?.remove();
      gyroSub.current?.remove();
    };
  }, [enabled, fireReading, setInterval]);
}
