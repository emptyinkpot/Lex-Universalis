import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ThemedText } from './ThemedText';

export type DamageEvent = {
  id: string;
  amount: number;
  kind: 'damage' | 'heal' | 'shield' | 'counter';
  x: number;
  y: number;
  accent: string;
};

interface BattleDamageOverlayProps {
  event: DamageEvent | null;
}

export function BattleDamageOverlay({ event }: BattleDamageOverlayProps) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0.82);

  useEffect(() => {
    if (!event) {
      translateY.value = 0;
      opacity.value = 1;
      scale.value = 0.82;
      return;
    }

    translateY.value = 0;
    opacity.value = 1;
    scale.value = 0.82;

    translateY.value = withTiming(-72, { duration: 800 });
    opacity.value = withTiming(0, { duration: 650 });
    scale.value = withTiming(1, { duration: 220 });
  }, [event?.id, opacity, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  if (!event) {
    return null;
  }

  const prefix = event.kind === 'heal' ? '+' : event.kind === 'shield' ? 'SH' : '-';

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[
          styles.bubble,
          animatedStyle,
          {
            left: event.x - 28,
            top: event.y - 20,
            borderColor: event.accent,
            backgroundColor: `${event.accent}22`,
          },
        ]}
      >
        <ThemedText variant="smallMedium" color="#FFFFFF" style={[styles.amount, { color: event.accent }]}>
          {prefix}
          {event.amount}
        </ThemedText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    minWidth: 56,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  amount: {
    fontWeight: '800',
    letterSpacing: 1,
  },
});
