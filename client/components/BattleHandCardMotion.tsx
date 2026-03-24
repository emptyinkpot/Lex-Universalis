import React, { ReactNode, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  withDelay,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface BattleHandCardMotionProps {
  children: ReactNode;
  hovered: boolean;
  selected: boolean;
  targeting: boolean;
  collapsed?: boolean;
  delay?: number;
}

export function BattleHandCardMotion({
  children,
  hovered,
  selected,
  targeting,
  collapsed = false,
  delay = 0,
}: BattleHandCardMotionProps) {
  const hoverValue = useSharedValue(0);
  const selectValue = useSharedValue(0);
  const entryOffset = useSharedValue(64);
  const entryOpacity = useSharedValue(0);
  const auraValue = useSharedValue(0);
  const collapseValue = useSharedValue(0);

  useEffect(() => {
    hoverValue.value = withSpring(hovered ? 1 : 0, { damping: 16, stiffness: 180 });
  }, [hoverValue, hovered]);

  useEffect(() => {
    selectValue.value = withSpring(selected ? 1 : 0, { damping: 14, stiffness: 220 });
  }, [selectValue, selected]);

  useEffect(() => {
    entryOffset.value = 64;
    entryOpacity.value = 0;
    entryOffset.value = withDelay(delay, withTiming(0, { duration: 420 }));
    entryOpacity.value = withDelay(delay, withTiming(1, { duration: 260 }));
  }, [delay, entryOffset, entryOpacity]);

  useEffect(() => {
    auraValue.value = withTiming(hovered || selected ? 1 : 0, { duration: 180 });
  }, [auraValue, hovered, selected]);

  useEffect(() => {
    collapseValue.value = withTiming(collapsed ? 1 : 0, { duration: 220 });
  }, [collapseValue, collapsed]);

  const cardStyle = useAnimatedStyle(() => {
    const hoverLift = hovered ? -16 : 0;
    const selectLift = selected ? -24 : 0;
    const rotate = (hoverValue.value * -6) + (selectValue.value * -2);
    const scale = 1 + hoverValue.value * 0.04 + selectValue.value * 0.06 - collapseValue.value * 0.08;

    return {
      opacity: entryOpacity.value,
      transform: [
        { translateY: entryOffset.value + hoverLift + selectLift + collapseValue.value * 22 },
        { rotateZ: `${rotate}deg` },
        { scale },
      ],
    };
  });

  const trailStyle = useAnimatedStyle(() => ({
    opacity: targeting && selected ? 1 : 0,
    transform: [
      { scaleX: 0.8 + selectValue.value * 0.35 },
      { scaleY: 1 + hoverValue.value * 0.12 },
    ],
  }));

  const auraStyle = useAnimatedStyle(() => ({
    opacity: auraValue.value * 0.9,
    transform: [
      { scaleX: 0.86 + hoverValue.value * 0.18 + selectValue.value * 0.24 },
      { scaleY: 0.9 + hoverValue.value * 0.12 + selectValue.value * 0.18 },
    ],
  }));

  return (
    <Animated.View style={styles.shell}>
      <Animated.View style={[styles.aura, auraStyle]} />
      <Animated.View style={[styles.trail, trailStyle]} />
      <Animated.View style={cardStyle}>{children}</Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shell: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  aura: {
    position: 'absolute',
    bottom: 18,
    width: 152,
    height: 204,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(215, 178, 109, 0.4)',
    backgroundColor: 'rgba(215, 178, 109, 0.08)',
    shadowColor: '#d7b26d',
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
  trail: {
    position: 'absolute',
    bottom: 22,
    width: 164,
    height: 20,
    borderRadius: 999,
    backgroundColor: 'rgba(215, 178, 109, 0.2)',
    shadowColor: '#d7b26d',
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 6,
  },
});
