import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DriveEvent, EventType } from '../types';
import { COLORS, FONTS } from '../constants/theme';
import { EVENT_LABELS } from '../services/scoring';

const EVENT_COLORS: Record<EventType, string> = {
  HARSH_BRAKING:       COLORS.eventHarshBraking,
  SHARP_TURN:          COLORS.eventSharpTurn,
  HARSH_ACCELERATION:  COLORS.eventHarshAccel,
  PHONE_HANDLING:      COLORS.eventPhoneHandling,
  AGGRESSIVE_STEERING: COLORS.eventAggressiveSteering,
  EXCESSIVE_MOVEMENT:  COLORS.eventExcessiveMovement,
};

const ORDER: EventType[] = [
  'HARSH_BRAKING','SHARP_TURN','HARSH_ACCELERATION',
  'PHONE_HANDLING','AGGRESSIVE_STEERING','EXCESSIVE_MOVEMENT',
];

export function EventBreakdownChart({ events }: { events: DriveEvent[] }) {
  const counts = Object.fromEntries(
    ORDER.map(t => [t, events.filter(e => e.type === t).length])
  ) as Record<EventType, number>;
  const maxCount = Math.max(...Object.values(counts), 1);

  return (
    <View style={styles.wrap}>
      {ORDER.map(type => {
        const n     = counts[type];
        const pct   = n === 0 ? 0 : n / maxCount;
        const color = EVENT_COLORS[type];
        return (
          <View key={type} style={styles.row}>
            <Text style={styles.label} numberOfLines={1}>{EVENT_LABELS[type]}</Text>
            <View style={styles.track}>
              <View style={[styles.bar, { flex: pct, backgroundColor: n ? color : 'transparent' }]} />
              <View style={{ flex: 1 - pct }} />
            </View>
            <Text style={[styles.count, { color: n ? color : COLORS.textMuted }]}>{n}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { color: COLORS.textSecondary, fontSize: FONTS.small, width: 130 },
  track: {
    flex: 1, height: 6, backgroundColor: COLORS.border,
    borderRadius: 3, overflow: 'hidden', flexDirection: 'row',
  },
  bar:   { height: 6, borderRadius: 3 },
  count: { fontSize: FONTS.small, width: 18, textAlign: 'right', fontVariant: ['tabular-nums'] },
});
