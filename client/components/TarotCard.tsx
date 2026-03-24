/**
 * 塔罗牌卡片组件
 * 基于标准塔罗牌设计的可复用卡片组件
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { TAROT_CARD_CONFIG, TarotCardConfig, TarotCardStyle } from '@/constants/tarot-card-config';

interface TarotCardProps extends TarotCardConfig {
  /** 自定义样式 */
  style?: TarotCardStyle;
  /** 点击事件 */
  onPress?: () => void;
  /** 是否可点击 */
  active?: boolean;
}

export const TarotCard: React.FC<TarotCardProps> = ({
  number,
  title,
  illustration,
  showSun = true,
  variant = 'default',
  style,
  onPress,
  active = false,
}) => {
  const { theme } = useTheme();

  // 卡牌尺寸
  const cardWidth = style?.width || TAROT_CARD_CONFIG.dimensions.defaultWidth;
  const cardHeight = style?.height || TAROT_CARD_CONFIG.dimensions.defaultHeight;

  // 样式配置
  const cardStyle = {
    width: cardWidth,
    height: cardHeight,
    backgroundColor: style?.backgroundColor || TAROT_CARD_CONFIG.colors.background.cardInner,
    borderColor: style?.borderColor || TAROT_CARD_CONFIG.colors.background.cardOuter,
  };

  // 旋转角度（逆位）
  const rotation = variant === 'reversed' ? 180 : 0;

  return (
    <View
      style={[
        styles.container,
        cardStyle,
        { transform: [{ rotate: `${rotation}deg` }] },
        active && styles.active,
      ]}
    >
      {/* 顶部区域 */}
      <View style={styles.topSection}>
        {/* 数字徽章 */}
        <View style={[styles.numberBadge, styles.topLeft]}>
          <Text style={[
            styles.number,
            {
              color: TAROT_CARD_CONFIG.colors.text.darkBrown,
              fontSize: Math.min(24, cardWidth * 0.1),
            }
          ]}>
            {number}
          </Text>
        </View>

        {/* 太阳装饰 */}
        {showSun && (
          <View style={[styles.sunDecoration, styles.topRight]}>
            <View style={styles.sun} />
          </View>
        )}
      </View>

      {/* 中心视觉区域 */}
      <View style={styles.centerSection}>
        {illustration}
      </View>

      {/* 底部区域 */}
      <View style={styles.bottomSection}>
        <Text
          style={[
            styles.title,
            {
              color: TAROT_CARD_CONFIG.colors.text.orange,
              fontSize: Math.min(18, cardWidth * 0.08),
              letterSpacing: Math.max(2, cardWidth * 0.01),
            }
          ]}
        >
          {title}
        </Text>
      </View>
    </View>
  );
};

// ========== 塔罗牌卡片样式 ==========

const styles = StyleSheet.create({
  container: {
    borderWidth: TAROT_CARD_CONFIG.border.width,
    borderColor: TAROT_CARD_CONFIG.border.color,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: TAROT_CARD_CONFIG.colors.background.cardInner,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  active: {
    shadowColor: TAROT_CARD_CONFIG.colors.primary.clayOrange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  topSection: {
    height: TAROT_CARD_CONFIG.layout.topSection.height,
    paddingHorizontal: TAROT_CARD_CONFIG.layout.topSection.padding,
    position: 'relative',
  },
  topLeft: {
    position: 'absolute',
    top: TAROT_CARD_CONFIG.layout.topSection.padding,
    left: TAROT_CARD_CONFIG.layout.topSection.padding,
  },
  topRight: {
    position: 'absolute',
    top: TAROT_CARD_CONFIG.decoration.sun.offset.top,
    right: TAROT_CARD_CONFIG.decoration.sun.offset.right,
  },
  numberBadge: {
    width: TAROT_CARD_CONFIG.layout.numberBadge.width,
    height: TAROT_CARD_CONFIG.layout.numberBadge.height,
    backgroundColor: TAROT_CARD_CONFIG.colors.primary.warmBrown,
    borderRadius: TAROT_CARD_CONFIG.layout.numberBadge.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    ...TAROT_CARD_CONFIG.typography.number,
    color: TAROT_CARD_CONFIG.colors.text.darkBrown,
    fontWeight: 'bold',
  },
  sunDecoration: {
    width: TAROT_CARD_CONFIG.decoration.sun.size,
    height: TAROT_CARD_CONFIG.decoration.sun.size,
  },
  sun: {
    width: '100%',
    height: '100%',
    backgroundColor: TAROT_CARD_CONFIG.decoration.sun.color,
    borderRadius: TAROT_CARD_CONFIG.decoration.sun.size / 2,
    // 可以添加更复杂的太阳图形
  },
  centerSection: {
    flex: TAROT_CARD_CONFIG.layout.centerSection.flex,
    paddingHorizontal: TAROT_CARD_CONFIG.layout.centerSection.padding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSection: {
    height: TAROT_CARD_CONFIG.layout.bottomSection.height,
    paddingHorizontal: TAROT_CARD_CONFIG.layout.bottomSection.padding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...TAROT_CARD_CONFIG.typography.title,
    color: TAROT_CARD_CONFIG.colors.text.orange,
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    textAlign: 'center',
  },
});
