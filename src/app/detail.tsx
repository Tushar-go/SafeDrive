import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScoreGauge }           from '../components/ScoreGauge';
import { EventBreakdownChart }  from '../components/EventBreakdownChart';
import { EventCard }            from '../components/EventCard';
import { COLORS, FONTS, RADIUS } from '../constants/theme';
import {
  formatDriveDuration, formatDriveDateFull,
  formatDriveTime, formatDistance,
} from '../utils/formatters';
import { DriveSession } from '../types';

export default function DetailScreen() {
  const router = useRouter();
  const { data } = useLocalSearchParams<{ data: string }>();
  const session: DriveSession = JSON.parse(data ?? '{}');

  const duration = session.durationMs ? formatDriveDuration(session.durationMs) : '—';
  const distance = session.distanceMiles != null ? formatDistance(session.distanceMiles) : '—';
  const n        = session.events?.length ?? 0;

  return (
    <View style={s.root}>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header row */}
        <View style={s.hdr}>
          <TouchableOpacity onPress={() => router.back()} style={s.back}>
            <Text style={s.backIcon}>‹</Text>
          </TouchableOpacity>
          <View style={s.hdrCenter}>
            <Text style={s.title}>Drive Detail</Text>
            <Text style={s.sub}>
              {formatDriveDateFull(session.startTime)} · {formatDriveTime(session.startTime)}
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Gauge */}
        <View style={s.gaugeWrap}>
          <ScoreGauge score={session.finalScore} size={200} showRating />
          <Text style={s.scoreLbl}>Safety Score</Text>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          {[
            { icon: '🕐', lbl: 'Duration',     val: duration },
            { icon: '⚠️',  lbl: 'Total Events', val: String(n) },
            { icon: '📍', lbl: 'Distance',     val: distance },
          ].map(({ icon, lbl, val }, i, arr) => (
            <React.Fragment key={lbl}>
              <View style={s.stat}>
                <Text style={s.statIcon}>{icon}</Text>
                <Text style={s.statLbl}>{lbl}</Text>
                <Text style={s.statVal}>{val}</Text>
              </View>
              {i < arr.length - 1 && <View style={s.statDiv} />}
            </React.Fragment>
          ))}
        </View>

        {/* Event breakdown */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Event Breakdown</Text>
          <EventBreakdownChart events={session.events ?? []} />
        </View>

        {/* Event log */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Event Log</Text>
          {n === 0 ? (
            <View style={s.noEvts}>
              <Text style={s.noEvtsTxt}>🎉 No events — perfect drive!</Text>
            </View>
          ) : (
            (session.events ?? []).map(e => <EventCard key={e.id} event={e} />)
          )}
        </View>
        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:       { flex: 1, backgroundColor: COLORS.bg },
  scroll:     { flex: 1 },
  hdr:        { flexDirection: 'row', alignItems: 'flex-start', paddingTop: 56, paddingBottom: 8, paddingHorizontal: 16 },
  back:       { width: 40, paddingTop: 2 },
  backIcon:   { color: COLORS.textPrimary, fontSize: 30, lineHeight: 34 },
  hdrCenter:  { flex: 1, alignItems: 'center' },
  title:      { color: COLORS.textPrimary, fontSize: FONTS.h2, fontWeight: '800' },
  sub:        { color: COLORS.textSecondary, fontSize: FONTS.small, marginTop: 3 },
  gaugeWrap:  { alignItems: 'center', paddingVertical: 8 },
  scoreLbl:   { color: COLORS.textSecondary, fontSize: FONTS.small, marginTop: -6 },
  statsRow:   { flexDirection: 'row', backgroundColor: COLORS.bgCard, marginHorizontal: 16, borderRadius: RADIUS.lg, padding: 16, marginBottom: 16, alignItems: 'center' },
  stat:       { flex: 1, alignItems: 'center', gap: 3 },
  statIcon:   { fontSize: 16 },
  statLbl:    { color: COLORS.textSecondary, fontSize: FONTS.tiny },
  statVal:    { color: COLORS.textPrimary, fontSize: FONTS.body, fontWeight: '700' },
  statDiv:    { width: 1, height: 40, backgroundColor: COLORS.border },
  card:       { backgroundColor: COLORS.bgCard, marginHorizontal: 16, borderRadius: RADIUS.lg, padding: 16, marginBottom: 16 },
  cardTitle:  { color: COLORS.textPrimary, fontSize: FONTS.h3, fontWeight: '700', marginBottom: 14 },
  noEvts:     { paddingVertical: 12, alignItems: 'center' },
  noEvtsTxt:  { color: COLORS.textSecondary, fontSize: FONTS.body },
});
