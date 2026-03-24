import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export type BattleCastEvent = {
  id: string;
  accent: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
};

interface BattleCastOverlayProps {
  event: BattleCastEvent | null;
}

export function BattleCastOverlay({ event }: BattleCastOverlayProps) {
  const progress = useSharedValue(0);
  const flash = useSharedValue(0);

  useEffect(() => {
    if (!event) {
      progress.value = 0;
      flash.value = 0;
      return;
    }

    progress.value = 0;
    flash.value = 0;
    progress.value = withTiming(1, {
      duration: 360,
      easing: Easing.out(Easing.cubic),
    });
    flash.value = withSequence(
      withTiming(1, { duration: 120 }),
      withTiming(0, { duration: 220 }),
    );
  }, [event?.id, flash, progress]);

  const projectileStyle = useAnimatedStyle(() => {
    if (!event) {
      return { opacity: 0 };
    }

    const x = event.fromX + (event.toX - event.fromX) * progress.value;
    const y = event.fromY + (event.toY - event.fromY) * progress.value - Math.sin(progress.value * Math.PI) * 42;

    return {
      opacity: 1 - Math.max(0, progress.value - 0.82) * 5,
      transform: [{ translateX: x - 10 }, { translateY: y - 10 }, { scale: 0.78 + progress.value * 0.5 }],
    };
  });

  const trailStyle = useAnimatedStyle(() => {
    if (!event) {
      return { opacity: 0 };
    }

    const dx = event.toX - event.fromX;
    const dy = event.toY - event.fromY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    return {
      opacity: 0.4 * (1 - progress.value * 0.55),
      width: distance * Math.max(progress.value, 0.14),
      transform: [
        { translateX: event.fromX },
        { translateY: event.fromY },
        { rotateZ: `${angle}rad` },
      ],
    };
  });

  const flashStyle = useAnimatedStyle(() => {
    if (!event) {
      return { opacity: 0 };
    }

    return {
      opacity: flash.value * 0.7,
      transform: [{ scale: 0.6 + flash.value * 1.2 }],
    };
  });

  if (!event) {
    return null;
  }

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[
          styles.trail,
          trailStyle,
          { backgroundColor: `${event.accent}66` },
        ]}
      />
      <Animated.View
        style={[
          styles.projectile,
          projectileStyle,
          {
            borderColor: event.accent,
            shadowColor: event.accent,
            backgroundColor: `${event.accent}dd`,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.flash,
          flashStyle,
          {
            left: event.toX - 42,
            top: event.toY - 42,
            borderColor: event.accent,
            backgroundColor: `${event.accent}22`,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  trail: {
    position: 'absolute',
    height: 3,
    borderRadius: 999,
  },
  projectile: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 2,
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  flash: {
    position: 'absolute',
    width: 84,
    height: 84,
    borderRadius: 999,
    borderWidth: 2,
  },
});
