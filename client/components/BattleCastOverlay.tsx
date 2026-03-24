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
  kind?: 'attack' | 'draw' | 'discard';
};

interface BattleCastOverlayProps {
  events?: BattleCastEvent[];
  preview?: Omit<BattleCastEvent, 'id'> | null;
}

function getArcHeight(kind: BattleCastEvent['kind']) {
  if (kind === 'draw') {
    return 58;
  }

  if (kind === 'discard') {
    return 28;
  }

  return 44;
}

function BattleCastMotion({ event }: { event: BattleCastEvent }) {
  const progress = useSharedValue(0);
  const flash = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    flash.value = 0;
    progress.value = withTiming(1, {
      duration: event.kind === 'draw' ? 440 : 360,
      easing: Easing.out(Easing.cubic),
    });
    flash.value = withSequence(withTiming(1, { duration: 120 }), withTiming(0, { duration: 240 }));
  }, [event.id, event.kind, flash, progress]);

  const projectileStyle = useAnimatedStyle(() => {
    const arcHeight = getArcHeight(event.kind);
    const x = event.fromX + (event.toX - event.fromX) * progress.value;
    const y =
      event.fromY +
      (event.toY - event.fromY) * progress.value -
      Math.sin(progress.value * Math.PI) * arcHeight;

    return {
      opacity: 1 - Math.max(0, progress.value - 0.82) * 5,
      transform: [
        { translateX: x - 10 },
        { translateY: y - 10 },
        { scale: event.kind === 'attack' ? 0.82 + progress.value * 0.56 : 0.72 + progress.value * 0.44 },
      ],
    };
  });

  const trailStyle = useAnimatedStyle(() => {
    const dx = event.toX - event.fromX;
    const dy = event.toY - event.fromY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    return {
      opacity: event.kind === 'discard' ? 0.28 : 0.42 * (1 - progress.value * 0.5),
      width: distance * Math.max(progress.value, 0.18),
      transform: [
        { translateX: event.fromX },
        { translateY: event.fromY },
        { rotateZ: `${angle}rad` },
      ],
    };
  });

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flash.value * (event.kind === 'attack' ? 0.72 : 0.5),
    transform: [{ scale: 0.58 + flash.value * (event.kind === 'attack' ? 1.18 : 0.78) }],
  }));

  return (
    <>
      <Animated.View
        style={[
          styles.trail,
          trailStyle,
          { backgroundColor: `${event.accent}${event.kind === 'discard' ? '44' : '66'}` },
        ]}
      />
      <Animated.View
        style={[
          styles.projectile,
          projectileStyle,
          {
            borderColor: event.kind === 'discard' ? '#f3dfbf' : event.accent,
            shadowColor: event.accent,
            backgroundColor: event.kind === 'draw' ? '#f4dec1' : `${event.accent}dd`,
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
            borderColor: event.kind === 'discard' ? '#c58d63' : event.accent,
            backgroundColor: `${event.accent}${event.kind === 'attack' ? '22' : '16'}`,
          },
        ]}
      />
    </>
  );
}

export function BattleCastOverlay({ events = [], preview = null }: BattleCastOverlayProps) {
  const arcNodes = preview
    ? Array.from({ length: 7 }, (_, index) => {
        const t = index / 6;
        const x = preview.fromX + (preview.toX - preview.fromX) * t;
        const y = preview.fromY + (preview.toY - preview.fromY) * t - Math.sin(t * Math.PI) * 46;
        return { x, y, index };
      })
    : [];

  if (events.length === 0 && !preview) {
    return null;
  }

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {preview
        ? arcNodes.map((node) => (
            <View
              key={`preview-node-${node.index}`}
              style={[
                styles.arcNode,
                {
                  left: node.x - 4,
                  top: node.y - 4,
                  backgroundColor: node.index % 2 === 0 ? '#fff4dc' : `${preview.accent}cc`,
                  opacity: 0.72,
                },
              ]}
            />
          ))
        : null}
      {events.map((event) => (
        <BattleCastMotion key={event.id} event={event} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  trail: {
    position: 'absolute',
    height: 3,
    borderRadius: 999,
  },
  arcNode: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 999,
    shadowColor: '#ffffff',
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
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
