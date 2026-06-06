# SafeDrive

Expo Router React Native app that scores every drive using on-device sensors.  
No backend · No account · Everything stored in AsyncStorage.

---

## Quick start

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** on a real device.  
> Sensors don't work in simulators — you need a physical phone.

---

## Expo Router file layout

```
app/
  _layout.tsx          Root layout — wraps everything in DriveProvider + Stack
  (tabs)/
    _layout.tsx        Bottom tab bar (Home · Active · History)
    index.tsx          Dashboard — stats, recent drives, Start Drive button
    active.tsx         Active drive — live score, sensor readout, event feed
    history.tsx        History — all past drives grouped by week / month
  summary.tsx          Post-drive summary (pushed after End Drive)
  detail.tsx           Read-only detail for any past session
src/
  types/               TypeScript interfaces (DriveSession, DriveEvent …)
  constants/           theme.ts · thresholds.ts
  utils/               formatters.ts · sensorMath.ts
  services/            storage.ts · scoring.ts
  context/             DriveContext + DriveReducer (global session state)
  hooks/               useSensors · useEventDetection · useLocation · useDriveSession
  components/          ScoreGauge · EventCard · EventBreakdownChart · DriveCard · SensorReadout
```

---

## What's implemented (all steps complete)

| Step | Feature | Status |
|------|---------|--------|
| 1 | Expo Router scaffold + tab/stack navigation | ✅ |
| 2 | Accelerometer + Gyroscope hook (10 Hz) | ✅ |
| 3 | Threshold constants + event detection with cooldowns | ✅ |
| 4 | DriveContext + useReducer (START / LOG_EVENT / END) | ✅ |
| 5 | All 5 screens matching the design mockup | ✅ |
| 6 | AsyncStorage persistence (save, load, delete, clear) | ✅ |
| 7 | ScoreGauge, EventCard, EventBreakdown, DriveCard components | ✅ |
| 8 | Battery-adaptive polling (idle → 300 ms, active → 100 ms) | ✅ |
| 8 | GPS event tagging via expo-location | ✅ |
| 8 | Haptic feedback on every harsh event | ✅ |
| 8 | expo-keep-awake during active drive | ✅ |

---

## Detection thresholds (`src/constants/thresholds.ts`)

| Event | Sensor | Default | Unit |
|-------|--------|---------|------|
| Harsh Braking | Accel Y < -8.5 | 8.5 | m/s² |
| Harsh Acceleration | Accel Y > 7.0 | 7.0 | m/s² |
| Phone Handling | Accel X > 7.8 | 7.8 | m/s² |
| Excessive Movement | Total mag > 11.0 | 11.0 | m/s² |
| Sharp Turn | Gyro Z > 0.8 | 0.8 | rad/s |
| Aggressive Steering | Gyro X/Y > 1.2 | 1.2 | rad/s |

**Tuning:** increase a value to reduce false positives; decrease to catch more events.  
Always test across 5+ real drives after changing any threshold.

---

## Score formula

Start at **100**. Deduct per event:

| Event | Points |
|-------|--------|
| Harsh Braking | −5 |
| Phone Handling | −4 |
| Sharp Turn | −3 |
| Aggressive Steering | −3 |
| Harsh Acceleration | −2 |
| Excessive Movement | −2 |

**Ratings:** Excellent ≥ 90 · Good ≥ 75 · Fair ≥ 55 · Poor < 55

---

## Battery-adaptive polling

The sensor hook switches between two polling rates automatically:

- **Active** (default): 100 ms = 10 Hz
- **Idle** (phone stationary): 300 ms ≈ 3.3 Hz

The switch happens after 10 consecutive readings where the gravity-removed
acceleration magnitude stays below 0.8 m/s². It switches back instantly on
any motion spike.

---

## GPS tagging

`useLocation` runs `watchPositionAsync` during an active session.  
Each detected event gets stamped with `{ lat, lng }` from the last GPS fix.  
The coordinate is stored in `event.location` and will be available for a
future route-replay feature.

---

## Dependencies

| Package | Purpose |
|---------|---------|
| expo-router | File-based navigation |
| expo-sensors | Accelerometer + Gyroscope |
| expo-location | GPS per-event tagging |
| expo-haptics | Vibration on harsh events |
| expo-keep-awake | Screen-on during drive |
| @react-native-async-storage/async-storage | Drive history |
| react-native-svg | SVG score gauge |
| date-fns | Duration + date formatting |
