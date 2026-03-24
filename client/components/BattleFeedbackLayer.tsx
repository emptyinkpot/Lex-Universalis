import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Canvas, Circle, Line, Rect, vec } from '@shopify/react-native-skia';
import { ThemedText } from './ThemedText';

export type BattleFeedbackKind = 'attack' | 'spell' | 'counter' | 'heal' | 'turn';

export type BattleFeedbackEvent = {
  id: string;
  kind: BattleFeedbackKind;
  title: string;
  detail: string;
  accent: string;
  side: 'player' | 'enemy';
  duration: number;
};

interface BattleFeedbackLayerProps {
  event: BattleFeedbackEvent | null;
}

export function BattleFeedbackLayer({ event }: BattleFeedbackLayerProps) {
  const { width, height } = useWindowDimensions();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!event) {
      setProgress(0);
      return;
    }

    let raf = 0;
    const start = Date.now();

    const tick = () => {
      const next = Math.min((Date.now() - start) / event.duration, 1);
      setProgress(next);
      if (next < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    setProgress(0);
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [event?.id, event?.duration]);

  const sparks = useMemo(() => {
    if (!event) {
      return [];
    }

    const centerX = event.side === 'player' ? width * 0.68 : width * 0.32;
    const centerY = Math.max(140, height * 0.34);
    const sparkRadius = 28 + progress * 100;

    return Array.from({ length: 8 }, (_, index) => {
      const angle = (index / 8) * Math.PI * 2 + progress * 0.7;
      const distance = sparkRadius + index * 2;
      return {
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance * 0.58,
      };
    });
  }, [event, height, progress, width]);

  if (!event) {
    return null;
  }

  const overlayOpacity = Math.max(0, 0.22 * (1 - progress));
  const centerX = event.side === 'player' ? width * 0.68 : width * 0.32;
  const centerY = Math.max(140, height * 0.34);
  const ringRadius = 22 + progress * 120;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Canvas style={StyleSheet.absoluteFill}>
        <Rect x={0} y={0} width={width} height={height} color={event.accent} opacity={overlayOpacity} />
        <Circle
          cx={centerX}
          cy={centerY}
          r={ringRadius}
          color={event.accent}
          opacity={0.6 * (1 - progress)}
          strokeWidth={Math.max(6, 14 - progress * 8)}
          style="stroke"
        />
        <Circle
          cx={centerX}
          cy={centerY}
          r={Math.max(10, ringRadius * 0.32)}
          color="#FFFFFF"
          opacity={0.4 * (1 - progress)}
        />
        <Line
          p1={vec(width * 0.16, centerY - 54)}
          p2={vec(width * 0.84, centerY + 54)}
          color={event.accent}
          opacity={0.5 * (1 - progress)}
          strokeWidth={7 + (1 - progress) * 4}
        />
        {sparks.map((spark, index) => (
          <Circle
            key={`${event.id}-${index}`}
            cx={spark.x}
            cy={spark.y}
            r={Math.max(1.5, 5 - progress * 3)}
            color={index % 2 === 0 ? '#FFFFFF' : event.accent}
            opacity={Math.max(0, 1 - progress * 1.2)}
          />
        ))}
      </Canvas>

      <View style={styles.banner}>
        <View style={[styles.bannerAccent, { backgroundColor: event.accent }]} />
        <View style={styles.bannerBody}>
          <ThemedText variant="caption" color={event.accent} style={styles.bannerKind}>
            {feedbackLabels[event.kind]}
          </ThemedText>
          <ThemedText variant="h3" color="#FFFFFF">
            {event.title}
          </ThemedText>
          <ThemedText variant="small" color="#E5E7EB" style={styles.bannerDetail}>
            {event.detail}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const feedbackLabels: Record<BattleFeedbackKind, string> = {
  attack: '基础攻击',
  spell: '法术结算',
  counter: '反制触发',
  heal: '恢复反馈',
  turn: '回合推进',
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 18,
    left: 14,
    right: 14,
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: 'rgba(7, 12, 24, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  bannerAccent: {
    width: 8,
  },
  bannerBody: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 2,
  },
  bannerKind: {
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  bannerDetail: {
    lineHeight: 20,
  },
});
