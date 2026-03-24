import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ThemedText } from './ThemedText';
import type { BattleFeedbackEvent, BattleFeedbackKind } from './BattleFeedbackLayer';

interface BattleFeedbackLayerProps {
  event: BattleFeedbackEvent | null;
}

export function BattleFeedbackLayer({ event }: BattleFeedbackLayerProps) {
  const scale = useSharedValue(0.86);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!event) {
      scale.value = 0.86;
      opacity.value = 0;
      return;
    }

    scale.value = 0.86;
    opacity.value = 0;
    scale.value = withTiming(1, { duration: 240 });
    opacity.value = withTiming(1, { duration: 180 });
  }, [event?.id, opacity, scale]);

  const burstStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.28,
    transform: [{ scale: scale.value }],
  }));

  if (!event) {
    return null;
  }

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[
          styles.burst,
          burstStyle,
          {
            borderColor: event.accent,
            backgroundColor: `${event.accent}22`,
            alignSelf: event.side === 'player' ? 'flex-end' : 'flex-start',
          },
        ]}
      />

      <View style={styles.bannerWrap}>
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
  burst: {
    position: 'absolute',
    top: 104,
    width: 180,
    height: 180,
    borderRadius: 999,
    borderWidth: 2,
    marginHorizontal: 24,
  },
  bannerWrap: {
    position: 'absolute',
    top: 18,
    left: 14,
    right: 14,
  },
  banner: {
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
