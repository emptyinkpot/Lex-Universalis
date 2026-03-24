import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { KardsCard } from '@/components/KardsCard';
import { UIIcon } from '@/components/UIIcon';
import { INITIAL_CARDS, AnyCard } from '@/types/game';
import { useScreenShake } from '@/utils/cardEffects';
import {
  BattleFeedbackLayer,
  type BattleFeedbackEvent,
} from '@/components/BattleFeedbackLayer';
import { BattleDamageOverlay, type DamageEvent } from '@/components/BattleDamageOverlay';
import { BattleSwipeZone } from '@/components/BattleSwipeZone';
import { createStyles } from './styles';

type BattleLogEntry = {
  id: string;
  title: string;
  detail: string;
  accent: string;
};

type BattleFocus = 'enemy-line' | 'player-line';

const battleRules = [
  { label: '阶段', value: '声明 → 施行 → 结束' },
  { label: '前排', value: '可基础攻击' },
  { label: '后排', value: '不能基础攻防' },
  { label: '反制', value: '选定目标后可打断' },
];

export default function BattleScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const { shake, animatedStyle: shakeStyle } = useScreenShake();
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const damageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [selectedCard, setSelectedCard] = useState<AnyCard | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [battleFocus, setBattleFocus] = useState<BattleFocus>('enemy-line');
  const [feedbackEvent, setFeedbackEvent] = useState<BattleFeedbackEvent | null>(null);
  const [damageEvent, setDamageEvent] = useState<DamageEvent | null>(null);
  const [battleLog, setBattleLog] = useState<BattleLogEntry[]>([
    {
      id: 'rule-1',
      title: '战斗规则',
      detail: '声明阶段先于施行阶段，前排可以基础攻击，后排承担支援与保护。',
      accent: '#C9A96E',
    },
  ]);

  const [playerHealth, setPlayerHealth] = useState(30);
  const [enemyHealth, setEnemyHealth] = useState(28);
  const [playerGold] = useState(6);
  const [playerInfluence] = useState(3);
  const [enemyGold] = useState(5);
  const [enemyInfluence] = useState(2);
  const currentTurn = 3;
  const isPlayerTurn = true;
  const hand = useMemo(() => INITIAL_CARDS.slice(0, 5), []);

  useEffect(
    () => () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
      if (damageTimerRef.current) {
        clearTimeout(damageTimerRef.current);
      }
    },
    []
  );

  const triggerScreenShake = () => {
    shake(8, 300);
  };

  const emitFeedback = (event: Omit<BattleFeedbackEvent, 'id'>) => {
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
    }

    const nextEvent: BattleFeedbackEvent = {
      ...event,
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    };

    setFeedbackEvent(nextEvent);
    feedbackTimerRef.current = setTimeout(() => {
      setFeedbackEvent(null);
    }, nextEvent.duration + 160);
  };

  const emitDamage = (event: Omit<DamageEvent, 'id'>) => {
    if (damageTimerRef.current) {
      clearTimeout(damageTimerRef.current);
    }

    const nextEvent: DamageEvent = {
      ...event,
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    };

    setDamageEvent(nextEvent);
    damageTimerRef.current = setTimeout(() => {
      setDamageEvent(null);
    }, 900);
  };

  const appendLog = (entry: BattleLogEntry) => {
    setBattleLog((current) => [entry, ...current].slice(0, 4));
  };

  const resolveCardHit = (card: AnyCard, origin: 'tap' | 'swipe') => {
    const accent = card.faction === 'FRANCE'
      ? '#002FA7'
      : card.faction === 'ENGLAND'
        ? '#C8102E'
        : '#C9A96E';
    const damage = origin === 'swipe' ? 3 : 2;

    setSelectedCard(card);
    setBattleFocus('enemy-line');
    setEnemyHealth((current) => Math.max(0, current - damage));
    triggerScreenShake();

    emitFeedback({
      kind: 'attack',
      title: `${card.name} 触发命中反馈`,
      detail: '命中闪光、冲击波和屏幕抖动会在这里统一播放。',
      accent,
      side: 'player',
      duration: 780,
    });
    emitDamage({
      amount: damage,
      kind: 'damage',
      x: 220,
      y: 210,
      accent,
    });
    appendLog({
      id: `${card.id}-${Date.now()}`,
      title: origin === 'swipe' ? '滑动出牌' : '基础攻击',
      detail: `${card.name} 对敌方造成 ${damage} 点伤害。`,
      accent,
    });

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleBattleSwipe = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (direction === 'left' || direction === 'right') {
      const nextFocus: BattleFocus =
        battleFocus === 'enemy-line' ? 'player-line' : 'enemy-line';
      setBattleFocus(nextFocus);
      emitFeedback({
        kind: 'turn',
        title: '切换视角',
        detail: nextFocus === 'enemy-line' ? '当前聚焦敌方前排。' : '当前聚焦己方前排。',
        accent: '#C9A96E',
        side: nextFocus === 'enemy-line' ? 'enemy' : 'player',
        duration: 500,
      });
      appendLog({
        id: `focus-${Date.now()}`,
        title: '滑动切换',
        detail: nextFocus === 'enemy-line' ? '战场视角切回敌方阵线。' : '战场视角切回己方阵线。',
        accent: '#C9A96E',
      });
      void Haptics.selectionAsync();
      return;
    }

    if (direction === 'up' && selectedCard) {
      resolveCardHit(selectedCard, 'swipe');
      return;
    }

    if (direction === 'down') {
      setSelectedCard(null);
      emitFeedback({
        kind: 'counter',
        title: '取消选择',
        detail: '向下滑动用于撤销当前卡牌锁定。',
        accent: '#6B7280',
        side: 'player',
        duration: 420,
      });
      appendLog({
        id: `cancel-${Date.now()}`,
        title: '取消锁定',
        detail: '已退出当前卡牌的锁定状态。',
        accent: '#6B7280',
      });
      void Haptics.selectionAsync();
    }
  };

  const handleCardPress = (card: AnyCard) => {
    setSelectedCard(card);
    setBattleFocus('enemy-line');
    emitFeedback({
      kind: 'attack',
      title: `${card.name} 已锁定`,
      detail: '上滑可试作出牌雏形，下滑可取消，左右滑可切换视角。',
      accent: '#C9A96E',
      side: 'player',
      duration: 640,
    });
    appendLog({
      id: `${card.id}-${Date.now()}`,
      title: '卡牌锁定',
      detail: `${card.name} 已进入待出牌状态。`,
      accent: '#C9A96E',
    });
    void Haptics.selectionAsync();
  };

  const handleEndTurn = () => {
    setSelectedCard(null);
    emitFeedback({
      kind: 'turn',
      title: '结束回合',
      detail: '回合推进、状态结算和下一轮提示会在这里汇总。',
      accent: '#C9A96E',
      side: 'enemy',
      duration: 640,
    });
    appendLog({
      id: `turn-${Date.now()}`,
      title: '回合推进',
      detail: '你结束了当前回合，等待对手行动。',
      accent: '#C9A96E',
    });
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const renderHandCard = (card: AnyCard, index: number) => (
    <KardsCard
      key={`${card.id}-${index}`}
      card={card}
      size="medium"
      showStats
      fanIndex={index}
      totalFanCards={hand.length}
      isHovered={hoveredIndex === index}
      isSelected={selectedCard?.id === card.id}
      onPress={() => handleCardPress(card)}
      onPressIn={() => setHoveredIndex(index)}
      onPressOut={() => setHoveredIndex(null)}
      onDeselect={() => {
        if (selectedCard?.id === card.id) {
          setSelectedCard(null);
        }
      }}
    />
  );

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle="light">
      <View style={styles.container}>
        <BattleFeedbackLayer event={feedbackEvent} />
        <BattleDamageOverlay event={damageEvent} />

        <View style={styles.enemyInfoBar}>
          <View style={styles.enemyNameSection}>
            <FontAwesome6 name="user" size={14} color="#FFFFFF" />
            <ThemedText variant="caption" color="#FFFFFF" style={styles.enemyName}>
              敌方城垒
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

        <View style={styles.rulesBar}>
          {battleRules.map((item) => (
            <View key={item.label} style={styles.ruleChip}>
              <ThemedText variant="caption" color={theme.textMuted} style={styles.ruleChipLabel}>
                {item.label}
              </ThemedText>
              <ThemedText variant="smallMedium" color={theme.textPrimary} style={styles.ruleChipValue}>
                {item.value}
              </ThemedText>
            </View>
          ))}
        </View>

        <BattleSwipeZone onSwipe={handleBattleSwipe}>
          <Animated.View style={[shakeStyle, styles.battlefield]}>
            <View style={styles.battlefieldTopRow}>
              <ThemedText variant="caption" color={theme.textMuted} style={styles.battlefieldLabel}>
                {battleFocus === 'enemy-line' ? '当前聚焦：敌方前排' : '当前聚焦：己方前排'}
              </ThemedText>
              <View style={styles.swipeHintRow}>
                <ThemedText variant="caption" color={theme.textMuted} style={styles.swipeHint}>
                  左右切换视角
                </ThemedText>
                <ThemedText variant="caption" color={theme.textMuted} style={styles.swipeHint}>
                  上滑出牌
                </ThemedText>
                <ThemedText variant="caption" color={theme.textMuted} style={styles.swipeHint}>
                  下滑取消
                </ThemedText>
              </View>
            </View>

            <View style={styles.battlefieldZone}>
              <View style={styles.zoneRow}>
                {[1, 2, 3].map((_, index) => (
                  <View key={index} style={styles.zoneSlot} />
                ))}
              </View>
            </View>

            <View style={styles.divider} />

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
        </BattleSwipeZone>

        <FlashList
          data={battleLog}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.logPanel}
          renderItem={({ item }) => (
            <View style={styles.logItem}>
              <View style={[styles.logAccent, { backgroundColor: item.accent }]} />
              <View style={styles.logCopy}>
                <ThemedText variant="smallMedium" color={theme.textPrimary}>
                  {item.title}
                </ThemedText>
                <ThemedText variant="caption" color={theme.textSecondary} style={styles.logDetail}>
                  {item.detail}
                </ThemedText>
              </View>
            </View>
          )}
        />

        <View style={styles.handContainer}>
          <View style={styles.handInfoRow}>
            <ThemedText variant="caption" color={theme.textMuted} style={styles.handLabel}>
              手牌 ({hand.length})
            </ThemedText>
            <ThemedText variant="caption" color={theme.textMuted}>
              {isPlayerTurn ? '你的回合' : '敌方回合'}
            </ThemedText>
          </View>
          <View style={styles.handFanContainer}>
            {hand.map((card, index) => renderHandCard(card, index))}
          </View>
        </View>

        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.actionButtonSecondary} onPress={() => router.back()}>
            <FontAwesome6 name="arrow-right-from-bracket" size={14} color="#002FA7" />
            <ThemedText variant="caption" color="#002FA7" style={styles.buttonTextSecondary}>
              退出
            </ThemedText>
          </TouchableOpacity>

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

          <TouchableOpacity style={styles.actionButtonPrimary} onPress={handleEndTurn}>
            <ThemedText variant="smallMedium" color="#FFFFFF" style={styles.buttonTextPrimary}>
              结束回合
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}
