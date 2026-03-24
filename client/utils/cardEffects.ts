import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  Easing,
  runOnJS,
  SharedValue,
} from 'react-native-reanimated';

// 卡牌动画类型
export enum CardAnimationType {
  PLAY = 'play', // 打出
  DRAW = 'draw', // 抽牌
  HOVER = 'hover', // 悬停
  SELECT = 'select', // 选中
  ATTACK = 'attack', // 攻击
  DAMAGE = 'damage', // 受伤
  DEATH = 'death', // 死亡
  HIGHLIGHT = 'highlight', // 高亮
}

// 卡牌特效配置
export interface CardEffectConfig {
  duration?: number;
  delay?: number;
  easing?: (t: number) => number;
  springConfig?: {
    damping?: number;
    stiffness?: number;
    mass?: number;
  };
}

// 卡牌动画控制器Hook
export function useCardAnimation() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  // 播放卡牌打出动画
  const playPlayAnimation = (
    onComplete?: () => void,
    config: CardEffectConfig = {}
  ) => {
    const { duration = 600, easing = Easing.bezier(0.25, 0.1, 0.25, 1) } = config;

    // 使用简单的弹簧动画，避免 withSequence 的引用问题
    // eslint-disable-next-line react-hooks/rules-of-hooks
    scale.value = withSpring(1, { damping: 12, stiffness: 200 }, (finished) => {
      if (finished && onComplete) {
        runOnJS(onComplete)();
      }
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    opacity.value = withTiming(1, { duration: duration / 2, easing });
  };

  // 播放抽牌动画
  const playDrawAnimation = (
    startPosition: { x: number; y: number },
    endPosition: { x: number; y: number },
    onComplete?: () => void,
    config: CardEffectConfig = {}
  ) => {
    const { duration = 400, easing = Easing.out(Easing.cubic) } = config;

    // 使用简单的动画，避免 withSequence
    // eslint-disable-next-line react-hooks/rules-of-hooks
    translateX.value = withTiming(endPosition.x, { duration, easing }, (finished) => {
      if (finished && onComplete) {
        runOnJS(onComplete)();
      }
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    translateY.value = withTiming(endPosition.y, { duration, easing });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    rotation.value = withSpring(0, { damping: 15, stiffness: 200 });
  };

  // 播放悬停动画
  const playHoverAnimation = (
    isHovered: boolean,
    config: CardEffectConfig = {}
  ) => {
    const { springConfig = { damping: 15, stiffness: 200 } } = config;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    scale.value = withSpring(isHovered ? 1.05 : 1, springConfig);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    rotation.value = withSpring(isHovered ? 2 : 0, springConfig);
  };

  // 播放选中动画
  const playSelectAnimation = (
    isSelected: boolean,
    config: CardEffectConfig = {}
  ) => {
    const { springConfig = { damping: 20, stiffness: 300 } } = config;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    scale.value = withSpring(isSelected ? 1.02 : 1, springConfig);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    translateY.value = withSpring(isSelected ? -4 : 0, springConfig);
  };

  // 播放攻击动画
  const playAttackAnimation = (
    direction: 'left' | 'right',
    onComplete?: () => void,
    config: CardEffectConfig = {}
  ) => {
    const { duration = 300 } = config;
    const attackDistance = 30;

    // 简化为单向动画，避免 withSequence
    // eslint-disable-next-line react-hooks/rules-of-hooks
    translateX.value = withTiming(direction === 'left' ? -attackDistance : attackDistance, {
      duration,
      easing: Easing.out(Easing.quad),
    }, (finished) => {
      if (finished && onComplete) {
        runOnJS(onComplete)();
      }
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    scale.value = withSpring(1.1, { damping: 15, stiffness: 250 });
    
    // 动画结束后恢复
    setTimeout(() => {
      translateX.value = withTiming(0, { duration: 200 });
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    }, duration);
  };

  // 播放受伤动画
  const playDamageAnimation = (
    onComplete?: () => void,
    config: CardEffectConfig = {}
  ) => {
    const { duration = 400 } = config;

    // 简化为弹簧震动，避免 withSequence
    // eslint-disable-next-line react-hooks/rules-of-hooks
    scale.value = withSpring(1.05, { 
      damping: 8, 
      stiffness: 400 
    }, (finished) => {
      if (finished && onComplete) {
        runOnJS(onComplete)();
      }
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    rotation.value = withTiming(3, { duration: duration / 2, easing: Easing.out(Easing.quad) });
  };

  // 播放死亡动画
  const playDeathAnimation = (
    onComplete?: () => void,
    config: CardEffectConfig = {}
  ) => {
    const { duration = 600, easing = Easing.in(Easing.cubic) } = config;

    // 简化为淡出动画，避免 withSequence
    // eslint-disable-next-line react-hooks/rules-of-hooks
    opacity.value = withTiming(0, { duration, easing }, (finished) => {
      if (finished && onComplete) {
        runOnJS(onComplete)();
      }
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    scale.value = withTiming(0.8, { duration });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    rotation.value = withTiming(90, { duration, easing });
  };

  // 播放高亮动画
  const playHighlightAnimation = (
    isHighlight: boolean,
    config: CardEffectConfig = {}
  ) => {
    const { springConfig = { damping: 20, stiffness: 250 } } = config;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    scale.value = withSpring(isHighlight ? 1.03 : 1, springConfig);
  };

  // 获取动画样式
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  // 重置所有动画
  const reset = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    scale.value = withTiming(1, { duration: 200 });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    opacity.value = withTiming(1, { duration: 200 });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    rotation.value = withTiming(0, { duration: 200 });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    translateY.value = withTiming(0, { duration: 200 });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    translateX.value = withTiming(0, { duration: 200 });
  };

  return {
    playPlayAnimation,
    playDrawAnimation,
    playHoverAnimation,
    playSelectAnimation,
    playAttackAnimation,
    playDamageAnimation,
    playDeathAnimation,
    playHighlightAnimation,
    reset,
    animatedStyle,
  };
}

// 冲击波特效参数
export interface ShockwaveConfig {
  x: number;
  y: number;
  color: string;
  maxRadius: number;
  duration: number;
}

// 冲击波动画控制器
export function useShockwaveEffect(config: ShockwaveConfig) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  const play = () => {
    // 简化为单向缩放动画，避免 withSequence
    scale.value = withTiming(config.maxRadius / 100, {
      duration: config.duration,
      easing: Easing.out(Easing.quad),
    });

    opacity.value = withTiming(0, {
      duration: config.duration,
      easing: Easing.in(Easing.quad),
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
      width: config.maxRadius,
      height: config.maxRadius,
      borderRadius: config.maxRadius / 2,
      backgroundColor: config.color,
      position: 'absolute',
      left: config.x - config.maxRadius / 2,
      top: config.y - config.maxRadius / 2,
    };
  });

  return { play, animatedStyle };
}

// 屏幕震动特效
export function useScreenShake() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const shake = (intensity: number = 5, duration: number = 200) => {
    // 完全移除 withRepeat 和 withSequence，改用简单的单向动画
    translateX.value = withTiming(intensity, { 
      duration: duration / 4, 
      easing: Easing.out(Easing.quad) 
    });
    
    translateY.value = withTiming(intensity, { 
      duration: duration / 4, 
      easing: Easing.out(Easing.quad) 
    });

    // 使用 setTimeout 恢复原位
    setTimeout(() => {
      translateX.value = withTiming(0, { duration: duration * 3 / 4 });
      translateY.value = withTiming(0, { duration: duration * 3 / 4 });
    }, duration / 4);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  return { shake, animatedStyle };
}

// 伤害数字弹出特效
export function useDamageNumberEffect() {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0.5);

  const play = (duration: number = 800) => {
    // 简化为单向动画，避免 withSequence
    translateY.value = withTiming(-80, {
      duration: duration,
      easing: Easing.out(Easing.cubic),
    });

    opacity.value = withTiming(0, {
      duration: duration * 0.4,
      easing: Easing.in(Easing.quad),
    });

    scale.value = withTiming(1, { duration: duration });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  return { play, animatedStyle };
}
