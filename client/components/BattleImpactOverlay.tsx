import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Line } from 'react-native-svg';

export type BattleImpactEvent = {
  id: string;
  x: number;
  y: number;
  accent: string;
  shatter?: boolean;
};

interface BattleImpactOverlayProps {
  event: BattleImpactEvent | null;
}

const SHARD_ANGLES = [-72, -34, -10, 18, 44, 76];
const CRACK_LINES = [
  { x1: 62, y1: 62, x2: 16, y2: 26 },
  { x1: 62, y1: 62, x2: 104, y2: 24 },
  { x1: 62, y1: 62, x2: 32, y2: 104 },
  { x1: 62, y1: 62, x2: 98, y2: 98 },
  { x1: 62, y1: 62, x2: 64, y2: 12 },
];

export function BattleImpactOverlay({ event }: BattleImpactOverlayProps) {
  const burst = useSharedValue(0);
  const fade = useSharedValue(0);

  useEffect(() => {
    if (!event) {
      burst.value = 0;
      fade.value = 0;
      return;
    }

    burst.value = 0;
    fade.value = 1;
    burst.value = withTiming(1, {
      duration: 420,
      easing: Easing.out(Easing.cubic),
    });
    fade.value = withTiming(0, {
      duration: 620,
      easing: Easing.out(Easing.quad),
    });
  }, [burst, event?.id, fade]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: fade.value * 0.85,
    transform: [{ scale: 0.7 + burst.value * 0.8 }],
  }));

  const crackStyle = useAnimatedStyle(() => ({
    opacity: fade.value * 0.78,
    transform: [{ scale: 0.82 + burst.value * 0.18 }],
  }));

  if (!event) {
    return null;
  }

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[
          styles.impactRing,
          ringStyle,
          {
            left: event.x - 52,
            top: event.y - 52,
            borderColor: `${event.accent}dd`,
            shadowColor: event.accent,
            backgroundColor: `${event.accent}14`,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.crackWrap,
          crackStyle,
          {
            left: event.x - 62,
            top: event.y - 62,
          },
        ]}
      >
        <Svg width={124} height={124} viewBox="0 0 124 124">
          {CRACK_LINES.map((line, index) => (
            <Line
              key={`${event.id}-crack-${index}`}
              {...line}
              stroke={index === 0 ? '#fff4dc' : event.accent}
              strokeWidth={index === 0 ? 2.1 : 1.35}
              strokeLinecap="round"
              opacity={index === 0 ? 0.9 : 0.62}
            />
          ))}
        </Svg>
      </Animated.View>
      {event.shatter
        ? SHARD_ANGLES.map((angle, index) => {
            const distance = 18 + index * 7;
            const radians = (angle * Math.PI) / 180;
            const left = event.x - 5 + Math.cos(radians) * distance;
            const top = event.y - 5 + Math.sin(radians) * distance;
            return (
              <Animated.View
                key={`${event.id}-shard-${angle}`}
                style={[
                  styles.shard,
                  crackStyle,
                  {
                    left,
                    top,
                    backgroundColor: index % 2 === 0 ? '#fff4dc' : event.accent,
                    transform: [{ rotateZ: `${angle}deg` }],
                  },
                ]}
              />
            );
          })
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  impactRing: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 999,
    borderWidth: 2,
    shadowOpacity: 0.34,
    shadowRadius: 16,
    elevation: 8,
  },
  crackWrap: {
    position: 'absolute',
    width: 124,
    height: 124,
  },
  shard: {
    position: 'absolute',
    width: 10,
    height: 4,
    borderRadius: 999,
    shadowColor: '#fff4dc',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
