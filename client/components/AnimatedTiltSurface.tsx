import React, { ReactNode } from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type AnimatedTiltSurfaceProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
  hoverEnabled?: boolean;
  glowColor?: string;
};

export function AnimatedTiltSurface({
  children,
  style,
  contentStyle,
  onPress,
  disabled = false,
  hoverEnabled = true,
  glowColor = 'rgba(215,178,109,0.28)',
}: AnimatedTiltSurfaceProps) {
  const hover = useSharedValue(0);
  const press = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const tilt = hover.value * 6;
    const pressedScale = press.value > 0 ? 0.985 : 1;

    return {
      transform: [
        { perspective: 900 },
        { translateY: -hover.value * 6 + press.value * 2 },
        { rotateX: `${tilt * 0.45}deg` },
        { rotateY: `${-tilt}deg` },
        { scale: pressedScale + hover.value * 0.015 },
      ],
      shadowColor: glowColor,
      shadowOpacity: hover.value * 0.38,
      shadowRadius: 18 + hover.value * 10,
      shadowOffset: { width: 0, height: 12 },
      elevation: 8,
    };
  });

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onHoverIn={hoverEnabled ? () => { hover.value = withTiming(1, { duration: 180 }); } : undefined}
      onHoverOut={hoverEnabled ? () => { hover.value = withTiming(0, { duration: 180 }); } : undefined}
      onPressIn={() => { press.value = withTiming(1, { duration: 90 }); }}
      onPressOut={() => { press.value = withTiming(0, { duration: 120 }); }}
      style={style}
    >
      <Animated.View style={[animatedStyle, contentStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
