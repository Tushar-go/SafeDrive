import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DriveSession } from '../types';
import { COLORS, FONTS, RADIUS } from '../constants/theme';
import { formatDriveDuration, formatDriveDate, formatDriveTime, formatDistance, getScoreColor } from '../utils/formatters';

interface Props {
  session:  DriveSession;
  onPress?: () => void;
}

export function DriveCard({ session, onPress }: Props) {
  const scoreColor = getScoreColor(session.finalScore);
  const duration   = session.durationMs ? formatDriveDuration(session.durationMs) : '—';
  const distance   = session.distanceMiles != null ? formatDistance(session.distanceMiles) : '—';
  const n          = session.events.length;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.circle, { borderColor: scoreColor }]}>
        <Text style={[styles.score, { color: scoreColor }]}>{session.finalScore}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.date}>{formatDriveDate(session.startTime)}</Text>
        <Text style={styles.time}>{formatDriveTime(session.startTime)}</Text>
        <View style={styles.meta}>
          <Text style={styles.metaTxt}>{duration}</Text>
          <Text style={styles.sep}>·</Text>
          <Text style={styles.metaTxt}>{distance}</Text>
          <Text style={styles.sep}>·</Text>
          <Text style={styles.metaTxt}>{n} {n === 1 ? 'event' : 'events'}</Text>
        </View>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md,
    padding: 14, marginBottom: 10, gap: 14,
  },
  circle: {
    width: 52, height: 52, borderRadius: 26,
    borderWidth: 2.5, alignItems: 'center', justifyContent: 'center',
  },
  score:   { fontSize: FONTS.h3, fontWeight: '700' },
  info:    { flex: 1, gap: 1 },
  date:    { color: COLORS.textPrimary, fontSize: FONTS.body, fontWeight: '600' },
  time:    { color: COLORS.textSecondary, fontSize: FONTS.small },
  meta:    { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  metaTxt: { color: COLORS.textSecondary, fontSize: FONTS.small },
  sep:     { color: COLORS.textMuted, fontSize: FONTS.small },
  chevron: { color: COLORS.textMuted, fontSize: 22 },
});
