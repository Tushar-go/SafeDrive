import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Share,
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

export default function SummaryScreen() {
  const router = useRouter();
  const { data } = useLocalSearchParams<{ data: string }>();
  const session: DriveSession = JSON.parse(data ?? '{}');

  const duration = session.durationMs ? formatDriveDuration(session.durationMs) : '—';
  const distance = session.distanceMiles != null ? formatDistance(session.distanceMiles) : '—';
  const n        = session.events?.length ?? 0;

  const handleShare = () =>
    Share.share({
      message: `SafeDrive Score: ${session.finalScore}/100 (${session.safetyRating})\nDuration: ${duration} · Events: ${n}`,
    });

  const handleDone = () => router.replace('/(tabs)');

  return (
    <View style={s.root}>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={s.titleSec}>
          <Text style={s.title}>Drive Complete</Text>
          <Text style={s.sub}>
            {formatDriveDateFull(session.startTime)} · {duration}
          </Text>
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
            <View style={s.evtList}>
              {(session.events ?? []).map(e => <EventCard key={e.id} event={e} />)}
            </View>
          )}
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Actions */}
      <View style={s.actions}>
        <TouchableOpacity style={s.shareBtn} onPress={handleShare} activeOpacity={0.8}>
          <Text style={s.shareIcon}>↑</Text>
          <Text style={s.shareTxt}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.doneBtn} onPress={handleDone} activeOpacity={0.85}>
          <Text style={s.doneTxt}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root:       { flex: 1, backgroundColor: COLORS.bg },
  scroll:     { flex: 1 },
  titleSec:   { alignItems: 'center', paddingTop: 60, paddingBottom: 4 },
  title:      { color: COLORS.textPrimary, fontSize: FONTS.h1, fontWeight: '800' },
  sub:        { color: COLORS.textSecondary, fontSize: FONTS.body, marginTop: 4 },
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
  evtList:    { overflow: 'hidden' },
  noEvts:     { paddingVertical: 12, alignItems: 'center' },
  noEvtsTxt:  { color: COLORS.textSecondary, fontSize: FONTS.body },
  actions:    { position: 'absolute', bottom: 36, left: 16, right: 16, flexDirection: 'row', gap: 12 },
  shareBtn:   { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.bgCard, borderRadius: RADIUS.xl, paddingVertical: 16, borderWidth: 1, borderColor: COLORS.border },
  shareIcon:  { color: COLORS.textPrimary, fontSize: 18 },
  shareTxt:   { color: COLORS.textPrimary, fontSize: FONTS.body, fontWeight: '700' },
  doneBtn:    { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.green, borderRadius: RADIUS.xl, paddingVertical: 16 },
  doneTxt:    { color: '#000', fontSize: FONTS.body, fontWeight: '800' },
});
