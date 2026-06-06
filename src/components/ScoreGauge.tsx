import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { COLORS, FONTS } from '../constants/theme';
import { getScoreColor, getRatingColor, getSafetyRating } from '../utils/formatters';
import { SafetyRating } from '../types';

interface Props {
  score:       number;
  size?:       number;
  showRating?: boolean;
  label?:      string;
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arc(cx: number, cy: number, r: number, a1: number, a2: number): string {
  const s = polar(cx, cy, r, a2);
  const e = polar(cx, cy, r, a1);
  const la = a2 - a1 > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${la} 0 ${e.x} ${e.y}`;
}

const START = -210;
const END   =   30;
const SPAN  = END - START; // 240°

export function ScoreGauge({ score, size = 200, showRating = false, label }: Props) {
  const anim = useRef(new Animated.Value(score)).current;
  const displayed = useRef(score);

  useEffect(() => {
    Animated.timing(anim, { toValue: score, duration: 500, useNativeDriver: false }).start();
    const id = anim.addListener(({ value }) => { displayed.current = Math.round(value); });
    return () => anim.removeListener(id);
  }, [score, anim]);

  const cx = size / 2;
  const cy = size / 2 + 10;
  const r  = size * 0.38;
  const sw = size * 0.055;

  const fillDeg = START + (score / 100) * SPAN;
  const trackD  = arc(cx, cy, r, START, END);
  const fillD   = arc(cx, cy, r, START, fillDeg);
  const dot     = polar(cx, cy, r, fillDeg);

  const scoreColor  = getScoreColor(score);
  const rating      = getSafetyRating(score);
  const ratingColor = getRatingColor(rating as SafetyRating);
  const svgH        = size * 0.72;

  return (
    <View style={{ alignItems: 'center' }}>
      {/* SVG gauge */}
      <View style={{ width: size, height: svgH }}>
        <Svg width={size} height={svgH}>
          <Path d={trackD} stroke={COLORS.border} strokeWidth={sw} fill="none" strokeLinecap="round" />
          <Path d={fillD}  stroke={scoreColor}    strokeWidth={sw} fill="none" strokeLinecap="round" />
          <Circle cx={dot.x} cy={dot.y} r={sw * 0.6} fill={scoreColor} />
        </Svg>

        {/* Score number overlay */}
        <View style={[StyleSheet.absoluteFill, styles.overlay]}>
          <Text style={[styles.scoreNum, { fontSize: size * 0.27, color: COLORS.textPrimary }]}>
            {score}
          </Text>
          {label ? <Text style={styles.label}>{label}</Text> : null}
        </View>
      </View>

      {showRating && (
        <View style={[styles.badge, { backgroundColor: ratingColor + '33', borderColor: ratingColor }]}>
          <View style={[styles.dot, { backgroundColor: ratingColor }]} />
          <Text style={[styles.badgeText, { color: ratingColor }]}>{rating}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 16,
  },
  scoreNum: {
    fontWeight: '800',
    letterSpacing: -2,
  },
  label: {
    color:     COLORS.textSecondary,
    fontSize:  FONTS.small,
    marginTop: 2,
  },
  badge: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingHorizontal: 14,
    paddingVertical:    6,
    borderRadius:   20,
    borderWidth:     1,
    marginTop:       8,
    gap:             6,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  badgeText: { fontSize: FONTS.body, fontWeight: '600' },
});
