import React, { useCallback, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { loadAllSessions } from '../../services/storage';
import { DriveSession } from '../../types';
import { COLORS, FONTS, RADIUS } from '../../constants/theme';
import { ScoreGauge } from '../../components/ScoreGauge';
import { DriveCard }  from '../../components/DriveCard';
import { useDriveSession } from '../../hooks/useDriveSession';
import { formatDistance } from '../../utils/formatters';

export default function DashboardScreen() {
  const router  = useRouter();
  const [history, setHistory] = useState<DriveSession[]>([]);
  const { startDrive, state } = useDriveSession();

  useFocusEffect(
    useCallback(() => { loadAllSessions().then(setHistory); }, [])
  );

  const handleStart = () => {
    if (state.isSessionActive) { router.push('/(tabs)/active'); return; }
    startDrive();
    router.push('/(tabs)/active');
  };

  const totalDrives  = history.length;
  const totalMiles   = history.reduce((a, s) => a + (s.distanceMiles ?? 0), 0);
  const bestScore    = history.length ? Math.max(...history.map(s => s.finalScore)) : 0;
  const avgScore     = history.length
    ? Math.round(history.reduce((a, s) => a + s.finalScore, 0) / history.length)
    : 100;

  return (
    <View style={s.root}>
      {/* ── Header ── */}
      <View style={s.header}>
        <View style={s.logoRow}>
          <View style={s.logoBox}><Text style={s.logoEmoji}>🛡</Text></View>
          <Text style={s.appName}>SafeDrive</Text>
        </View>
        <TouchableOpacity><Text style={s.gear}>⚙</Text></TouchableOpacity>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Gauge */}
        <View style={s.gaugeWrap}>
          <ScoreGauge score={avgScore} size={200} />
          <Text style={s.gaugeLabel}>Avg. Safety Score</Text>
          <View style={s.gaugeTicks}>
            <Text style={s.tick}>0</Text>
            <Text style={s.tick}>100</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          {[
            { icon: '🛣', val: totalDrives,              lbl: 'Total Drives'  },
            { icon: '📍', val: `${totalMiles.toFixed(0)}`, lbl: 'Total Miles' },
            { icon: '🏆', val: bestScore,                lbl: 'Best Score'    },
          ].map(({ icon, val, lbl }, i, arr) => (
            <React.Fragment key={lbl}>
              <View style={s.stat}>
                <Text style={s.statIcon}>{icon}</Text>
                <Text style={s.statVal}>{val}</Text>
                <Text style={s.statLbl}>{lbl}</Text>
              </View>
              {i < arr.length - 1 && <View style={s.statDiv} />}
            </React.Fragment>
          ))}
        </View>

        {/* Recent drives */}
        <View style={s.section}>
          <View style={s.sectionHdr}>
            <Text style={s.sectionTitle}>Recent Drives</Text>
            {history.length > 4 && (
              <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
                <Text style={s.viewAll}>View All</Text>
              </TouchableOpacity>
            )}
          </View>

          {history.length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyTxt}>No drives yet — tap Start Drive!</Text>
            </View>
          ) : (
            history.slice(0, 4).map(sess => (
              <DriveCard
                key={sess.id}
                session={sess}
                onPress={() => router.push({ pathname: '/detail', params: { id: sess.id, data: JSON.stringify(sess) } })}
              />
            ))
          )}
        </View>
        <View style={{ height: 130 }} />
      </ScrollView>

      {/* Start Drive CTA */}
      <View style={s.ctaWrap}>
        <TouchableOpacity style={s.cta} onPress={handleStart} activeOpacity={0.85}>
          <Text style={s.ctaEmoji}>🚗</Text>
          <Text style={s.ctaTxt}>{state.isSessionActive ? 'Drive Active' : 'Start Drive'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root:       { flex: 1, backgroundColor: COLORS.bg },
  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12 },
  logoRow:    { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBox:    { width: 32, height: 32, borderRadius: 8, backgroundColor: COLORS.green + '22', alignItems: 'center', justifyContent: 'center' },
  logoEmoji:  { fontSize: 16 },
  appName:    { color: COLORS.textPrimary, fontSize: FONTS.h3, fontWeight: '700' },
  gear:       { color: COLORS.textSecondary, fontSize: 22 },
  scroll:     { flex: 1 },
  gaugeWrap:  { alignItems: 'center', paddingTop: 8, paddingBottom: 4 },
  gaugeLabel: { color: COLORS.textSecondary, fontSize: FONTS.small, marginTop: -8 },
  gaugeTicks: { flexDirection: 'row', justifyContent: 'space-between', width: 200, marginTop: 4 },
  tick:       { color: COLORS.textMuted, fontSize: FONTS.tiny },
  statsRow:   { flexDirection: 'row', backgroundColor: COLORS.bgCard, marginHorizontal: 16, borderRadius: RADIUS.lg, padding: 16, marginBottom: 20 },
  stat:       { flex: 1, alignItems: 'center', gap: 3 },
  statIcon:   { fontSize: 18 },
  statVal:    { color: COLORS.textPrimary, fontSize: FONTS.h2, fontWeight: '700' },
  statLbl:    { color: COLORS.textSecondary, fontSize: FONTS.tiny, textAlign: 'center' },
  statDiv:    { width: 1, backgroundColor: COLORS.border, marginVertical: 4 },
  section:    { paddingHorizontal: 16 },
  sectionHdr: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle:{ color: COLORS.textPrimary, fontSize: FONTS.h3, fontWeight: '700' },
  viewAll:    { color: COLORS.green, fontSize: FONTS.small },
  empty:      { paddingVertical: 24, alignItems: 'center' },
  emptyTxt:   { color: COLORS.textSecondary, fontSize: FONTS.body },
  ctaWrap:    { position: 'absolute', bottom: 90, left: 16, right: 16 },
  cta: {
    backgroundColor: COLORS.green, borderRadius: RADIUS.xl,
    paddingVertical: 18, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10,
    shadowColor: COLORS.green, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  ctaEmoji:   { fontSize: 20 },
  ctaTxt:     { color: '#000', fontSize: FONTS.h3, fontWeight: '800' },
});
