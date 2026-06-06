import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS } from '../constants/theme';

interface Props { accelMag: number; gyroMag: number }

export function SensorReadout({ accelMag, gyroMag }: Props) {
  const aC = accelMag > 8 ? COLORS.red : accelMag > 4 ? COLORS.orange : COLORS.green;
  const gC = gyroMag  > 1.2 ? COLORS.red : gyroMag > 0.6 ? COLORS.orange : COLORS.green;
  return (
    <View style={styles.wrap}>
      <View style={styles.item}>
        <Text style={styles.lbl}>Accel</Text>
        <Text style={[styles.val, { color: aC }]}>{accelMag.toFixed(1)}<Text style={styles.unit}> m/s²</Text></Text>
      </View>
      <View style={styles.div} />
      <View style={styles.item}>
        <Text style={styles.lbl}>Gyro</Text>
        <Text style={[styles.val, { color: gC }]}>{gyroMag.toFixed(2)}<Text style={styles.unit}> rad/s</Text></Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row', backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md, padding: 14,
    alignItems: 'center', justifyContent: 'space-around',
  },
  item: { alignItems: 'center', flex: 1 },
  lbl:  { color: COLORS.textSecondary, fontSize: FONTS.small, marginBottom: 4 },
  val:  { fontSize: FONTS.h3, fontWeight: '700', fontVariant: ['tabular-nums'] },
  unit: { fontSize: FONTS.tiny, color: COLORS.textSecondary, fontWeight: '400' },
  div:  { width: 1, height: 36, backgroundColor: COLORS.border },
});
