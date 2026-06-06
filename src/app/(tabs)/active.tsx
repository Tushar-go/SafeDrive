import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { ScoreGauge }    from '../../components/ScoreGauge';
import { EventCard }     from '../../components/EventCard';
import { SensorReadout } from '../../components/SensorReadout';
import { useDriveSession } from '../../hooks/useDriveSession';
import { COLORS, FONTS, RADIUS } from '../../constants/theme';
import { formatLiveTimer } from '../../utils/formatters';

export default function ActiveDriveScreen() {
  const router  = useRouter();
  const { endDrive, startDrive, state } = useDriveSession();
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep screen on
  useEffect(() => {
    activateKeepAwakeAsync();
    return () => { deactivateKeepAwake(); };
  }, []);

  // Elapsed clock
  useEffect(() => {
    if (state.isSessionActive && state.currentSession) {
      const start = state.currentSession.startTime;
      intervalRef.current = setInterval(() => setElapsed(Date.now() - start), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [state.isSessionActive, state.currentSession?.startTime]);

  const handleEnd = async () => {
    const session = await endDrive();
    if (session) {
      router.replace({ pathname: '/summary', params: { data: JSON.stringify(session) } });
    }
  };

  const confirmEnd = () => {
    Alert.alert('End Drive?', 'Stop recording and see your summary?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'End Drive', style: 'destructive', onPress: handleEnd },
    ]);
  };

  // If no active session just show a prompt
  if (!state.isSessionActive) {
    return (
      <View style={s.idle}>
        <Text style={s.idleEmoji}>🚗</Text>
        <Text style={s.idleTitle}>No active drive</Text>
        <Text style={s.idleSub}>Go to Home and tap Start Drive.</Text>
        <TouchableOpacity style={s.idleBtn} onPress={() => { startDrive(); }}>
          <Text style={s.idleBtnTxt}>Start Drive</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const score       = state.currentSession?.finalScore ?? 100;
  const events      = state.currentSession?.events ?? [];
  const recentEvts  = [...events].reverse().slice(0, 15);

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.dot} />
        <Text style={s.headerTitle}>Drive Active</Text>
        <Text style={s.timer}>{formatLiveTimer(elapsed)}</Text>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.gaugeWrap}>
          <ScoreGauge score={score} size={180} label="Live Score" />
        </View>

        <View style={s.section}>
          <SensorReadout accelMag={state.liveAccelMag} gyroMag={state.liveGyroMag} />
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Events Detected</Text>
          {recentEvts.length === 0 ? (
            <View style={s.noEvts}>
              <Text style={s.noEvtsTxt}>No events yet — drive safely! 🎉</Text>
            </View>
          ) : (
            <View style={s.evtList}>
              {recentEvts.map(e => <EventCard key={e.id} event={e} />)}
            </View>
          )}
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* End Drive button */}
      <View style={s.endWrap}>
        <TouchableOpacity style={s.endBtn} onPress={confirmEnd} activeOpacity={0.85}>
          <Text style={s.endArrow}>›</Text>
          <Text style={s.endTxt}>Hold to End</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root:        { flex: 1, backgroundColor: COLORS.bg },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  dot:         { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.activeRed },
  headerTitle: { color: COLORS.textPrimary, fontSize: FONTS.h3, fontWeight: '700' },
  timer:       { color: COLORS.textPrimary, fontSize: FONTS.h3, fontWeight: '700', fontVariant: ['tabular-nums'] },
  scroll:      { flex: 1 },
  gaugeWrap:   { alignItems: 'center', paddingVertical: 8 },
  section:     { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle:{ color: COLORS.textPrimary, fontSize: FONTS.h3, fontWeight: '700', marginBottom: 12 },
  evtList:     { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, overflow: 'hidden' },
  noEvts:      { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, padding: 20, alignItems: 'center' },
  noEvtsTxt:   { color: COLORS.textSecondary, fontSize: FONTS.body },
  endWrap:     { position: 'absolute', bottom: 40, left: 16, right: 16 },
  endBtn: {
    backgroundColor: COLORS.activeRed, borderRadius: RADIUS.xl,
    paddingVertical: 18, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10,
    shadowColor: COLORS.activeRed, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5, shadowRadius: 14, elevation: 8,
  },
  endArrow:    { color: '#fff', fontSize: 22, fontWeight: '700' },
  endTxt:      { color: '#fff', fontSize: FONTS.h3, fontWeight: '800' },

  // idle state
  idle:        { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center', gap: 12 },
  idleEmoji:   { fontSize: 52 },
  idleTitle:   { color: COLORS.textPrimary, fontSize: FONTS.h2, fontWeight: '700' },
  idleSub:     { color: COLORS.textSecondary, fontSize: FONTS.body },
  idleBtn:     { backgroundColor: COLORS.green, borderRadius: RADIUS.xl, paddingHorizontal: 32, paddingVertical: 14, marginTop: 8 },
  idleBtnTxt:  { color: '#000', fontSize: FONTS.body, fontWeight: '800' },
});
