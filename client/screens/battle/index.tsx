import React, { useMemo, useState } from 'react';
import { View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { KardsCard } from '@/components/KardsCard';
import { FactionIcon } from '@/components/FactionIcon';
import { UIIcon } from '@/components/UIIcon';
import { INITIAL_CARDS, AnyCard } from '@/types/game';
import { useScreenShake } from '@/utils/cardEffects';
import { createStyles } from './styles';

const { height } = Dimensions.get('window');

export default function BattleScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();

  // 屏幕震动特效
  const { shake, animatedStyle: shakeStyle } = useScreenShake();
  
  // 状态管理
  const [selectedCard, setSelectedCard] = useState<AnyCard | null>(null);

  // 模拟手牌
  const hand = useMemo(() => INITIAL_CARDS.slice(0, 5), []);

  // 模拟资源
  const playerGold = 6;
  const playerInfluence = 3;
  const enemyGold = 5;
  const enemyInfluence = 2;

  // 模拟城堡生命值
  const playerHealth = 30;
  const enemyHealth = 28;

  // 模拟回合
  const currentTurn = 3;
  const isPlayerTurn = true;

  // 触发屏幕震动（例如：攻击时）
  const triggerScreenShake = () => {
    shake(8, 300);
  };

  // 悬停状态
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const renderHandCard = (card: AnyCard, index: number) => (
    <KardsCard
      key={`${card.id}-${index}`}
      card={card}
      size="medium"
      showStats={true}
      fanIndex={index}                    // 扇形布局索引
      totalFanCards={hand.length}         // 总卡数
      isHovered={hoveredIndex === index}  // 悬停状态
      isSelected={selectedCard?.id === card.id}
      onPress={() => {
        setSelectedCard(card);
        triggerScreenShake();
      }}
      onPressIn={() => setHoveredIndex(index)}
      onPressOut={() => setHoveredIndex(null)}
      onDeselect={() => {
        // 在手牌区域松手时取消选中
        if (selectedCard?.id === card.id) {
          setSelectedCard(null);
        }
      }}
    />
  );

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle="light">
      <View style={styles.container}>
        {/* 敌方信息栏 - 紧凑设计 */}
        <View style={styles.enemyInfoBar}>
          <View style={styles.enemyNameSection}>
            <FontAwesome6 name="user" size={14} color="#FFFFFF" />
            <ThemedText variant="caption" color="#FFFFFF" style={styles.enemyName}>
              敌方城堡
            </ThemedText>
          </View>
          <View style={styles.enemyStats}>
            <View style={styles.statItemCompact}>
              <UIIcon iconName="health" size={12} />
              <ThemedText variant="caption" color="#FFFFFF" style={styles.statTextCompact}>
                {enemyHealth}
              </ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItemCompact}>
              <UIIcon iconName="gold" size={12} />
              <ThemedText variant="caption" color="#FFFFFF" style={styles.statTextCompact}>
                {enemyGold}
              </ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItemCompact}>
              <UIIcon iconName="influence" size={12} />
              <ThemedText variant="caption" color="#FFFFFF" style={styles.statTextCompact}>
                {enemyInfluence}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* 战场区域 - 自适应高度 */}
        <Animated.View style={[shakeStyle, styles.battlefield]}>
          {/* 敌方战场 */}
          <View style={styles.battlefieldZone}>
            <View style={styles.zoneRow}>
              {[1, 2, 3].map((_, index) => (
                <View key={index} style={styles.zoneSlot} />
              ))}
            </View>
          </View>

          {/* 中线 */}
          <View style={styles.divider} />

          {/* 己方战场 */}
          <View style={styles.battlefieldZone}>
            <View style={styles.zoneRow}>
              {[1, 2, 3].map((_, index) => (
                <TouchableOpacity key={index} style={styles.zoneSlotEmpty} activeOpacity={0.5}>
                  <FontAwesome6 name="plus" size={14} color={theme.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* 手牌区域 - 扇形布局 */}
        <View style={styles.handContainer}>
          <View style={styles.handInfoRow}>
            <ThemedText variant="caption" color={theme.textMuted} style={styles.handLabel}>
              手牌 ({hand.length})
            </ThemedText>
            <ThemedText variant="caption" color={theme.textMuted}>
              {isPlayerTurn ? '你的回合' : '敌方回合'}
            </ThemedText>
          </View>
          {/* 扇形布局容器 */}
          <View style={styles.handFanContainer}>
            {hand.map((card, index) => renderHandCard(card, index))}
          </View>
        </View>

        {/* 操作按钮 - 包含玩家统计信息，在最底部 */}
        <View style={styles.actionBar}>
          {/* 左侧：退出按钮 */}
          <TouchableOpacity style={styles.actionButtonSecondary} onPress={() => router.back()}>
            <FontAwesome6 name="arrow-right-from-bracket" size={14} color="#002FA7" />
            <ThemedText variant="caption" color="#002FA7" style={styles.buttonTextSecondary}>
              退出
            </ThemedText>
          </TouchableOpacity>

          {/* 中间：玩家统计信息 */}
          <View style={styles.playerStatsCompact}>
            <View style={styles.statRow}>
              <View style={styles.statItemCompact}>
                <UIIcon iconName="health" size={14} />
                <ThemedText variant="smallMedium" color={theme.textPrimary} style={styles.statTextCompact}>
                  {playerHealth}
                </ThemedText>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItemCompact}>
                <UIIcon iconName="gold" size={14} />
                <ThemedText variant="smallMedium" color={theme.textPrimary} style={styles.statTextCompact}>
                  {playerGold}
                </ThemedText>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItemCompact}>
                <UIIcon iconName="influence" size={14} />
                <ThemedText variant="smallMedium" color={theme.textPrimary} style={styles.statTextCompact}>
                  {playerInfluence}
                </ThemedText>
              </View>
            </View>
            <View style={styles.turnBadge}>
              <ThemedText variant="caption" color="#FFFFFF" style={styles.turnText}>
                回合 {currentTurn}
              </ThemedText>
            </View>
          </View>

          {/* 右侧：结束回合按钮 */}
          <TouchableOpacity style={styles.actionButtonPrimary}>
            <ThemedText variant="smallMedium" color="#FFFFFF" style={styles.buttonTextPrimary}>
              结束回合
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}
