import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { loadAllSessions, clearAllSessions } from '../../services/storage';
import { DriveSession } from '../../types';
import { DriveCard }    from '../../components/DriveCard';
import { COLORS, FONTS, RADIUS } from '../../constants/theme';
import { format, isThisWeek } from 'date-fns';

function groupSessions(sessions: DriveSession[]) {
  const thisWeek:  DriveSession[] = [];
  const lastWeek:  DriveSession[] = [];
  const older: Record<string, DriveSession[]> = {};

  const now      = Date.now();
  const oneWeek  = 7 * 24 * 60 * 60 * 1000;
  const twoWeeks = 2 * oneWeek;

  for (const s of sessions) {
    const age = now - s.startTime;
    if (age < oneWeek)        thisWeek.push(s);
    else if (age < twoWeeks)  lastWeek.push(s);
    else {
      const key = format(new Date(s.startTime), 'MMMM yyyy');
      (older[key] ??= []).push(s);
    }
  }
  return { thisWeek, lastWeek, older };
}

export default function HistoryScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<DriveSession[]>([]);

  useFocusEffect(
    useCallback(() => { loadAllSessions().then(setHistory); }, [])
  );

  const { thisWeek, lastWeek, older } = groupSessions(history);

  const handleClear = () =>
    Alert.alert('Clear All History?', 'This permanently deletes all drives.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete All', style: 'destructive', onPress: async () => {
        await clearAllSessions(); setHistory([]);
      }},
    ]);

  const goDetail = (sess: DriveSession) =>
    router.push({ pathname: '/detail', params: { data: JSON.stringify(sess) } });

  const renderGroup = (title: string, sessions: DriveSession[]) => {
    if (!sessions.length) return null;
    return (
      <View key={title} style={s.group}>
        <Text style={s.groupTitle}>{title}</Text>
        {sessions.map(sess => (
          <DriveCard key={sess.id} session={sess} onPress={() => goDetail(sess)} />
        ))}
      </View>
    );
  };

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Text style={s.title}>Your Drives</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Text style={s.menuIcon}>☰</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyEmoji}>🚗</Text>
          <Text style={s.emptyTitle}>No drives yet</Text>
          <Text style={s.emptySub}>Complete a drive to see your history here.</Text>
        </View>
      ) : (
        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
          {renderGroup('This Week', thisWeek)}
          {renderGroup('Last Week', lastWeek)}
          {Object.entries(older).map(([month, sess]) => renderGroup(month, sess))}
          <View style={{ height: 80 }} />
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root:       { flex: 1, backgroundColor: COLORS.bg },
  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  title:      { color: COLORS.textPrimary, fontSize: FONTS.h1, fontWeight: '800' },
  menuIcon:   { color: COLORS.textSecondary, fontSize: 22 },
  scroll:     { flex: 1, paddingHorizontal: 16 },
  group:      { marginBottom: 20 },
  groupTitle: { color: COLORS.textSecondary, fontSize: FONTS.small, fontWeight: '600', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.8 },
  empty:      { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { color: COLORS.textPrimary, fontSize: FONTS.h2, fontWeight: '700' },
  emptySub:   { color: COLORS.textSecondary, fontSize: FONTS.body, textAlign: 'center', paddingHorizontal: 40 },
});
