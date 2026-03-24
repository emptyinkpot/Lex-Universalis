import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

// 单个粒子组件（定义在文件顶层，避免在map中调用Hooks）
interface ParticleItemProps {
  particle: Particle;
}

const ParticleItem: React.FC<ParticleItemProps> = ({ particle }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);
  const translateY = useSharedValue(0);

  const particleStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
      ],
    };
  });

  // 启动动画
  React.useEffect(() => {
    // 淡入
    opacity.value = withTiming(1, { duration: 300 });
    scale.value = withTiming(1, { duration: 300 });
    // 向上移动
    translateY.value = withSpring(-20 - Math.random() * 30, {
      damping: 10,
      stiffness: 50,
    });

    // 延迟后淡出
    const fadeOutTimer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 500 });
      scale.value = withTiming(0.5, { duration: 500 });
    }, particle.duration - 500);

    return () => clearTimeout(fadeOutTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [particle.duration]);

  return (
    <Animated.View
      style={[
        styles.particle,
        particleStyle,
        {
          left: particle.x,
          top: particle.y,
          width: particle.size,
          height: particle.size,
          borderRadius: particle.size / 2,
          backgroundColor: particle.color,
        },
      ]}
    />
  );
};

interface ParticleEffectProps {
  visible: boolean;
  particleCount?: number;
  color?: string;
  size?: number;
  containerWidth: number;
  containerHeight: number;
}

// 生成粒子数据的辅助函数（纯函数，基于seed）
const generateParticles = (
  particleCount: number,
  color: string,
  size: number,
  containerWidth: number,
  containerHeight: number,
  seed: number
): Particle[] => {
  const result: Particle[] = [];
  // 使用简单的伪随机数生成器（基于seed）
  let random = seed;
  const nextRandom = () => {
    random = (random * 9301 + 49297) % 233280;
    return random / 233280;
  };

  for (let i = 0; i < particleCount; i++) {
    result.push({
      id: i,
      x: nextRandom() * containerWidth,
      y: nextRandom() * containerHeight,
      size: size + nextRandom() * size * 0.5,
      color: color,
      duration: 1000 + nextRandom() * 1000,
      delay: nextRandom() * 500,
    });
  }
  return result;
};

// 从props生成唯一的seed（简单哈希）
const generateSeed = (
  particleCount: number,
  color: string,
  size: number,
  containerWidth: number,
  containerHeight: number
): number => {
  const str = `${particleCount}-${color}-${size}-${containerWidth}-${containerHeight}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

export const ParticleEffect: React.FC<ParticleEffectProps> = ({
  visible,
  particleCount = 12,
  color = '#FFD700',
  size = 8,
  containerWidth,
  containerHeight,
}) => {
  // 从props生成seed（确保props变化时重新生成）
  const seed = generateSeed(particleCount, color, size, containerWidth, containerHeight);
  const particles = visible
    ? generateParticles(particleCount, color, size, containerWidth, containerHeight, seed)
    : [];

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {particles.map((particle) => (
        <ParticleItem key={particle.id} particle={particle} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 5,
  },
});
