/**
 * SafeDrive — Detection Thresholds
 *
 * All sensor values assume a phone mounted on the dashboard,
 * portrait orientation, Z-axis ≈ vertical.
 *
 * Accelerometer units : m/s²   (expo-sensors returns g-force; we multiply ×9.81)
 * Gyroscope units     : rad/s
 *
 * Tuning guide
 * ─────────────
 *   Too many false positives  → raise the threshold
 *   Real events being missed  → lower the threshold
 *   Always re-test across 5+ drives after changing a value.
 */
export const THRESHOLDS = {

  // ── Accelerometer ───────────────────────────────────────────────────────────

  /** Hard deceleration — phone jolts forward (negative Y in portrait mount) */
  HARSH_BRAKING_G:       8.5,   // m/s²

  /** Strong acceleration — phone pushed backward into mount (positive Y) */
  HARSH_ACCELERATION_G:  7.0,   // m/s²

  /** Catch-all: very large total jolt, gravity-removed magnitude */
  EXCESSIVE_MOVEMENT_G: 11.0,   // m/s²

  /** X-axis lateral jolt used as phone-handling proxy */
  PHONE_HANDLING_G:      7.8,   // m/s²

  // ── Gyroscope ───────────────────────────────────────────────────────────────

  /** Yaw rate (Z) — sharp turn */
  SHARP_TURN_RAD:         0.8,  // rad/s

  /** Pitch/roll rate (X or Y) — aggressive swerve */
  AGGRESSIVE_STEERING_RAD:1.2,  // rad/s

  // ── Scoring ─────────────────────────────────────────────────────────────────

  SCORE_DEDUCTIONS: {
    HARSH_BRAKING:       5,
    PHONE_HANDLING:      4,
    SHARP_TURN:          3,
    AGGRESSIVE_STEERING: 3,
    HARSH_ACCELERATION:  2,
    EXCESSIVE_MOVEMENT:  2,
  } as const,

  // ── Cooldown (ms) per event type — prevents re-fire inside one incident ─────

  COOLDOWN_MS: {
    HARSH_BRAKING:       2000,
    PHONE_HANDLING:      3000,
    SHARP_TURN:          1500,
    AGGRESSIVE_STEERING: 1500,
    HARSH_ACCELERATION:  2000,
    EXCESSIVE_MOVEMENT:  1000,
  } as const,

  // ── Sensor polling ──────────────────────────────────────────────────────────

  /** Base polling interval in ms (10 Hz) */
  POLLING_INTERVAL_MS: 100,

  /** Reduced interval when phone is stationary (saves battery) */
  POLLING_IDLE_MS: 300,

  /** Accel magnitude below which we switch to idle polling (m/s², gravity-removed) */
  IDLE_THRESHOLD_G: 0.8,

  // ── Safety rating bands ─────────────────────────────────────────────────────

  RATINGS: {
    EXCELLENT: 90,
    GOOD:      75,
    FAIR:      55,
    // POOR: < 55
  } as const,

} as const;
