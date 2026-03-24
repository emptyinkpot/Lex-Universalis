import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

type SwipeDirection = 'up' | 'down' | 'left' | 'right';

interface BattleSwipeZoneProps {
  children: React.ReactNode;
  onSwipe?: (direction: SwipeDirection) => void;
  onTap?: () => void;
  enabled?: boolean;
}

export function BattleSwipeZone({
  children,
  onSwipe,
  onTap,
  enabled = true,
}: BattleSwipeZoneProps) {
  const panGesture = useMemo(() => {
    if (!enabled) {
      return Gesture.Native();
    }

    return Gesture.Pan()
      .enabled(true)
      .minDistance(12)
      .onEnd((event) => {
        'worklet';
        const absX = Math.abs(event.translationX);
        const absY = Math.abs(event.translationY);

        if (Math.max(absX, absY) < 36) {
          return;
        }

        const direction: SwipeDirection =
          absX > absY
            ? (event.translationX > 0 ? 'right' : 'left')
            : (event.translationY > 0 ? 'down' : 'up');

        if (onSwipe) {
          onSwipe(direction);
        }
      })
      .runOnJS(true);
  }, [enabled, onSwipe]);

  const tapGesture = useMemo(() => {
    if (!enabled) {
      return Gesture.Native();
    }

    return Gesture.Tap()
      .maxDuration(250)
      .onEnd(() => {
        'worklet';
        if (onTap) {
          onTap();
        }
      })
      .runOnJS(true);
  }, [enabled, onTap]);

  const composedGesture = useMemo(
    () => Gesture.Simultaneous(tapGesture, panGesture),
    [tapGesture, panGesture]
  );

  return (
    <GestureDetector gesture={composedGesture}>
      <View style={{ flex: 1 }}>{children}</View>
    </GestureDetector>
  );
}
