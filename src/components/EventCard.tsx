import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DriveEvent, EventType } from '../types';
import { COLORS, FONTS } from '../constants/theme';
import { EVENT_LABELS } from '../services/scoring';
import { formatSessionTimestamp } from '../utils/formatters';

const CFG: Record<EventType, { icon: string; color: string }> = {
  HARSH_BRAKING:       { icon: '↓', color: COLORS.eventHarshBraking },
  SHARP_TURN:          { icon: '↱', color: COLORS.eventSharpTurn },
  HARSH_ACCELERATION:  { icon: '↑', color: COLORS.eventHarshAccel },
  PHONE_HANDLING:      { icon: '📱', color: COLORS.eventPhoneHandling },
  AGGRESSIVE_STEERING: { icon: '⊕', color: COLORS.eventAggressiveSteering },
  EXCESSIVE_MOVEMENT:  { icon: '⊘', color: COLORS.eventExcessiveMovement },
};

export function EventCard({ event }: { event: DriveEvent }) {
  const { icon, color } = CFG[event.type];
  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: color + '22' }]}>
        <Text style={[styles.icon, { color }]}>{icon}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>{EVENT_LABELS[event.type]}</Text>
        <Text style={[styles.pts, { color }]}>-{event.pointsDeducted} points</Text>
      </View>
      <Text style={styles.time}>{formatSessionTimestamp(event.timestamp)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems:    'center',
    paddingVertical:   12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  iconWrap: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  icon:  { fontSize: 17, fontWeight: '700' },
  info:  { flex: 1 },
  label: { color: COLORS.textPrimary, fontSize: FONTS.body, fontWeight: '600' },
  pts:   { fontSize: FONTS.small, marginTop: 1 },
  time:  { color: COLORS.textSecondary, fontSize: FONTS.small, fontVariant: ['tabular-nums'] },
});
