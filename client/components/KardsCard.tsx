import React, { useMemo, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from './ThemedText';
import { ParticleEffect } from './ParticleEffect';
import { AnyCard } from '@/types/game';
import { useTheme } from '@/hooks/useTheme';
import {
  FanLayoutConfig,
  CardTransform,
  calculateFanLayout,
} from '@/utils/cardAnimations';

interface KardsCardProps {
  card: AnyCard;
  style?: any;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  isHovered?: boolean;
  isSelected?: boolean;
  size?: 'small' | 'medium' | 'large';
  showStats?: boolean;
  fanIndex?: number; // 扇形布局中的索引
  totalFanCards?: number; // 扇形布局总卡数
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDropInZone?: (point?: { x: number; y: number }) => void;
  onDragMove?: (point: { x: number; y: number }) => void;
  onDeselect?: () => void; // 取消选中回调
  isDraggable?: boolean; // 是否允许拖动
}

export const KardsCard: React.FC<KardsCardProps> = ({
  card,
  style,
  onPress,
  onPressIn,
  onPressOut,
  isHovered = false,
  isSelected = false,
  size = 'medium',
  showStats = true,
  fanIndex = -1, // -1 表示不在扇形布局中
  totalFanCards = 0,
  onDragStart,
  onDragEnd,
  onDropInZone,
  onDragMove,
  onDeselect,
  isDraggable = true,
}) => {
  const { theme } = useTheme();
  
  // 2. 拖动动画值（独立系统）
  const dragOffsetX = useSharedValue(0);
  const dragOffsetY = useSharedValue(0);
  const dragScale = useSharedValue(1);
  const dragRotation = useSharedValue(0);
  const dragZIndex = useSharedValue(1);
  const hasMoved = useSharedValue(false);
  const selectionScale = useSharedValue(1);
  
  // 扇形布局配置
  const fanConfig: FanLayoutConfig = useMemo(() => ({
    radius: 200,
    angleRange: 80,
    cardSpacing: 0.15,
    fanHeight: 0,
    cardWidth: size === 'large' ? 255 : size === 'small' ? 128 : 195,
    cardHeight: size === 'large' ? 357 : size === 'small' ? 179 : 273,
  }), [size]);

  // 当前扇形变换
  const [currentFanTransform, setCurrentFanTransform] = useState<CardTransform | null>(null);
  const [dynamicZIndex, setDynamicZIndex] = useState(0);
  const [isDraggingState, setIsDraggingState] = useState(false);

  // 粒子特效状态
  const [showParticles, setShowParticles] = useState(false);
  
  // 扇形布局的共享值
  const fanTranslateX = useSharedValue(0);
  const fanTranslateY = useSharedValue(0);
  const fanRotation = useSharedValue(0);
  const fanScale = useSharedValue(1);
  
  // 计算最终位置（扇形 + 拖动 + 选中）
  const finalTranslateX = useDerivedValue(() => fanTranslateX.value + dragOffsetX.value);
  const finalTranslateY = useDerivedValue(() => fanTranslateY.value + dragOffsetY.value);
  const finalScale = useDerivedValue(() => fanScale.value * dragScale.value * selectionScale.value);
  const finalRotation = useDerivedValue(() => fanRotation.value + dragRotation.value);

  // 根据卡牌阵营获取颜色
  const getFactionColor = () => {
    switch (card.faction) {
      case 'ENGLAND': return '#8B0000';
      case 'FRANCE': return '#0000CD';
      case 'HRE': return '#FFD700';
      case 'VIKING': return '#4169E1';
      case 'BYZANTIUM': return '#800080';
      default: return theme.primary;
    }
  };

  // 卡牌尺寸配置
  const cardSizes = useMemo(() => {
    switch (size) {
      case 'small': return { width: 70, height: 98, padding: 6 };
      case 'medium': return { width: 100, height: 140, padding: 10 };
      case 'large': return { width: 140, height: 196, padding: 14 };
      default: return { width: 100, height: 140, padding: 10 };
    }
  }, [size]);

  // 纸张纹理效果
  const paperTexture = useMemo(() => (
    <LinearGradient
      colors={['#F5F3E8', '#E8E4D9', '#F5F3E8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
  ), []);

  // 金属光泽效果
  const metalShine = useMemo(() => (
    <LinearGradient
      colors={[
        'rgba(255,255,255,0)',
        'rgba(255,255,255,0.1)',
        'rgba(255,255,255,0)',
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={StyleSheet.absoluteFill}
    />
  ), []);

  // 拖动样式（合并扇形布局 + 拖动 + 选中）
  const dragAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: finalTranslateX.value },
      { translateY: finalTranslateY.value },
      { scale: finalScale.value },
      { rotate: `${finalRotation.value}deg` },
    ],
    transformOrigin: 'center center',  // 锚点在卡牌中心
    zIndex: Math.round(dragZIndex.value),
  }));

  // 光晕样式（阵营色）
  const factionColor = getFactionColor();
  const glowStyle = useAnimatedStyle(() => {
    const glowIntensity = isSelected ? 1.2 : (isHovered ? 0.8 : 0);
    return {
      shadowColor: factionColor,
      shadowOffset: {
        width: 0,
        height: glowIntensity * 10,
      },
      shadowOpacity: glowIntensity * 0.5,
      shadowRadius: glowIntensity * 20,
      elevation: glowIntensity * 10,
    };
  });

  // 恢复扇形布局状态的函数
  const restoreFanLayout = () => {
    if (currentFanTransform) {
      fanTranslateX.value = withTiming(currentFanTransform.x, { duration: 150 });
      fanTranslateY.value = withTiming(currentFanTransform.y, { duration: 150 });
      fanRotation.value = withTiming(currentFanTransform.rotation, { duration: 150 });
      fanScale.value = withTiming(currentFanTransform.scale, { duration: 150 });
      setDynamicZIndex(currentFanTransform.zIndex);
    }
  };

  // 应用扇形布局
  useEffect(() => {
    if (fanIndex >= 0 && totalFanCards > 0) {
      const transform = calculateFanLayout(fanIndex, totalFanCards, fanConfig);
      setCurrentFanTransform(transform);
      setDynamicZIndex(transform.zIndex);
      
      // 设置扇形布局的共享值
      fanTranslateX.value = withTiming(transform.x, { duration: 400 });
      fanTranslateY.value = withTiming(transform.y, { duration: 400 });
      fanRotation.value = withTiming(transform.rotation, { duration: 400 });
      fanScale.value = withTiming(transform.scale, { duration: 400 });
    }
  }, [fanIndex, totalFanCards, fanConfig]);

  // 悬停效果
  useEffect(() => {
    if (fanIndex >= 0 && currentFanTransform && !isDraggingState) {
      if (isHovered) {
        // 悬停时：上浮、面向玩家（保持弹性效果）
        fanTranslateX.value = withTiming(currentFanTransform.x, { duration: 300 });
        fanTranslateY.value = withTiming(currentFanTransform.y - 40, { duration: 300 });
        fanRotation.value = withTiming(0, { duration: 300 });
        fanScale.value = withSpring(1.2, { damping: 15, stiffness: 200 });
        setDynamicZIndex(999);
      } else {
        // 恢复到扇形位置（快速复位）
        fanTranslateX.value = withTiming(currentFanTransform.x, { duration: 150 });
        fanTranslateY.value = withTiming(currentFanTransform.y, { duration: 150 });
        fanRotation.value = withTiming(currentFanTransform.rotation, { duration: 150 });
        fanScale.value = withTiming(currentFanTransform.scale, { duration: 150 });
        setDynamicZIndex(currentFanTransform.zIndex);
      }
    }
  }, [isHovered, fanIndex, isDraggingState]);

  // 选中效果
  useEffect(() => {
    // 更新选中动画值
    if (isSelected) {
      selectionScale.value = withSpring(1.1, { stiffness: 500, damping: 10 });
    } else {
      // 取消选中：快速复位，不震荡
      selectionScale.value = withTiming(1, { duration: 150 });

      // 取消选中时重置拖动偏移：快速复位
      dragScale.value = withTiming(1, { duration: 150 });
      dragOffsetX.value = withTiming(0, { duration: 150 });
      dragOffsetY.value = withTiming(0, { duration: 150 });
      hasMoved.value = false;

      // 恢复扇形布局初始状态
      restoreFanLayout();
    }
  }, [isSelected]);

  // 拖动手势
  const panGesture = useMemo(() => {
    if (!isDraggable) return Gesture.Native();

    return Gesture.Pan()
      .enabled(true)
      .minDistance(0)  // 不设置最小距离，让 onUpdate 自由移动
      .onStart(() => {
        'worklet';
        hasMoved.value = false;  // 重置移动标志
        runOnJS(setIsDraggingState)(true);
        // 清除悬停状态，避免悬停动画干扰拖动
        if (onPressOut) runOnJS(onPressOut)();
        // 提升到最上层
        dragZIndex.value = 9999;
        dragScale.value = withSpring(1.3, { damping: 10, stiffness: 200 });
        runOnJS(setShowParticles)(true);
        if (onDragStart) runOnJS(onDragStart)();
      })
      .onUpdate((event) => {
        'worklet';
        const dx = Math.abs(event.translationX);
        const dy = Math.abs(event.translationY);
        // 移动超过 8 像素才算真正开始拖动
        if (dx > 8 || dy > 8) {
          hasMoved.value = true;
        }
        dragOffsetX.value = event.translationX;
        dragOffsetY.value = event.translationY;
        if (onDragMove) runOnJS(onDragMove)({ x: event.absoluteX, y: event.absoluteY });
        // 轻微旋转效果
        dragRotation.value = event.translationX * 0.05;
      })
      .onEnd((event) => {
        'worklet';
        runOnJS(setShowParticles)(false);
        runOnJS(setIsDraggingState)(false);
        
        const isDropZone = event.translationY < -96;
        
        if (isDropZone && hasMoved.value && onDropInZone) {
          // 拖到目标区域：打出卡牌
          dragScale.value = withSpring(1);
          dragOffsetX.value = withTiming(0, { duration: 150 });
          dragOffsetY.value = withTiming(0, { duration: 150 }, () => {
            if (onDropInZone) runOnJS(onDropInZone)({ x: event.absoluteX, y: event.absoluteY });
          });
        } else {
          // 在手牌区域松手：回归原位 + 取消选中（快速复位）
          dragScale.value = withTiming(1, { duration: 150 });
          dragOffsetX.value = withTiming(0, { duration: 150 });
          dragOffsetY.value = withTiming(0, { duration: 150 });
          dragRotation.value = withTiming(0, { duration: 150 });

          // 触发取消选中
          if (onDeselect) runOnJS(onDeselect)();
        }
        
        dragZIndex.value = 1;
        hasMoved.value = false;  // 重置移动标志
        if (onDragEnd) runOnJS(onDragEnd)();
      })
      .runOnJS(true);
  }, [isDraggable, onDragStart, onDropInZone, onDragEnd, onDeselect]);

  // 点击手势
  const tapGesture = useMemo(() => {
    return Gesture.Tap()
      .enabled(isDraggable)
      .numberOfTaps(1)
      .maxDuration(250)  // 250ms - 点击超时
      .onStart(() => {
        'worklet';
        if (onPressIn) runOnJS(onPressIn)();
      })
      .onEnd(() => {
        'worklet';
        if (onPressOut) runOnJS(onPressOut)();

        // 只有没有移动才算点击
        if (!hasMoved.value) {
          if (onPress) runOnJS(onPress)();
        }
      })
      .runOnJS(true);
  }, [isDraggable, onPress, onPressIn, onPressOut]);

  // 手势组合：Simultaneous 让点击和拖动并行处理，通过 hasMoved 区分
  const composedGesture = useMemo(() => {
    return Gesture.Simultaneous(tapGesture, panGesture);
  }, [tapGesture, panGesture]);

  const isInFanLayout = fanIndex >= 0 && totalFanCards > 0;
  const { width: cardW } = cardSizes;

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          dragAnimatedStyle,
          {
            position: 'absolute',
            bottom: 0,
            left: '50%',  // 从容器中心开始
            marginLeft: -cardSizes.width / 2,  // 向左偏移一半宽度
            width: cardSizes.width,
            height: cardSizes.height,
            zIndex: isInFanLayout ? dynamicZIndex : undefined,
          },
        ]}
      >
        {/* 卡牌内容层 */}
        <Animated.View
          style={[
            styles.cardContainer,
            glowStyle,
            style,
            isSelected && styles.selectedCard,
          ]}
        >
              {/* 粒子特效 */}
              {showParticles && (
                <ParticleEffect
                  visible={showParticles}
                  particleCount={12}
                  color={factionColor}
                  size={6}
                  containerWidth={cardSizes.width}
                  containerHeight={cardSizes.height}
                />
              )}
              
              {/* 卡牌内容 */}
              <View style={[styles.cardInner, cardSizes]}>
                {paperTexture}
                
                <View style={[styles.cardBorder, { borderColor: factionColor }]}>
                  <View style={[styles.innerBorder, { borderColor: '#C9A96E' }]}>
                        <Animated.View style={styles.cardContent}>
                      <View style={[styles.costBadge, { backgroundColor: factionColor }]}>
                        <ThemedText variant="caption" color="#FFFFFF" style={styles.costText}>
                          {card.cost}
                        </ThemedText>
                      </View>

                      <ThemedText
                        variant="small"
                        color={theme.textPrimary}
                        style={styles.cardName}
                        numberOfLines={1}
                      >
                        {card.name}
                      </ThemedText>

                      <ThemedText
                        variant="tiny"
                        color={theme.textSecondary}
                        style={styles.cardDescription}
                        numberOfLines={2}
                      >
                        {card.description}
                      </ThemedText>

                      <View style={styles.typeBadge}>
                        <ThemedText variant="tiny" color={factionColor}>
                          {card.type}
                        </ThemedText>
                      </View>

                      {showStats && card.type === 'UNIT' && (
                        <View style={styles.statsContainer}>
                          <View style={styles.statItem}>
                            <View style={[styles.statBadge, { backgroundColor: '#C8102E' }]}>
                              <ThemedText variant="tiny" color="#FFFFFF">
                                {card.attack}
                              </ThemedText>
                            </View>
                          </View>
                          <View style={styles.statItem}>
                            <View style={[styles.statBadge, { backgroundColor: '#002FA7' }]}>
                              <ThemedText variant="tiny" color="#FFFFFF">
                                {card.health}
                              </ThemedText>
                            </View>
                          </View>
                        </View>
                      )}

                      {(isHovered || isSelected) && (
                        <View
                          style={[
                            styles.focusOverlay,
                            {
                              borderColor: isSelected ? '#D7B26D' : factionColor,
                              backgroundColor: isSelected ? 'rgba(215, 178, 109, 0.08)' : 'rgba(255, 255, 255, 0.04)',
                            },
                          ]}
                        />
                      )}
                      {metalShine}
                    </Animated.View>
                  </View>
                </View>
              </View>

              {/* 选中发光效果 */}
              {isSelected && (
                <Animated.View style={[styles.glowEffect, { borderColor: '#D7B26D' }]} />
              )}
            </Animated.View>
          </Animated.View>
      </GestureDetector>
    );
  };

const styles = StyleSheet.create({
  cardWrapper: {
    position: 'relative',
  },
  cardContainer: {
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardInner: {
    backgroundColor: '#F5F3E8',
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardBorder: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 2,
  },
  innerBorder: {
    borderWidth: 1,
    borderRadius: 6,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    position: 'relative',
  },
  focusOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderRadius: 6,
  },
  costBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  costText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardName: {
    marginTop: 28,
    fontWeight: '600',
    textAlign: 'center',
  },
  cardDescription: {
    marginTop: 4,
    paddingHorizontal: 4,
    textAlign: 'center',
    lineHeight: 12,
  },
  typeBadge: {
    position: 'absolute',
    bottom: 28,
    left: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 2,
  },
  statsContainer: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    flexDirection: 'row',
    gap: 4,
  },
  statItem: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  statBadge: {
    width: 18,
    height: 18,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCard: {
    // 选中效果
    borderWidth: 3,
    borderColor: '#D7B26D',
    // 增强发光
    shadowColor: '#D7B26D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1.5,  // 增强
    shadowRadius: 30,    // 增大
    elevation: 15,
  },
  glowEffect: {
    ...StyleSheet.absoluteFillObject,
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 16,
    borderWidth: 4,
    shadowColor: '#D7B26D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1.5,
    shadowRadius: 30,
    elevation: 15,
  },
});
