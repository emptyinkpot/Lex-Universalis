import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { KardsCard } from '@/components/KardsCard';
import { UIIcon } from '@/components/UIIcon';
import { INITIAL_CARDS, AnyCard, CardType } from '@/types/game';
import { useScreenShake } from '@/utils/cardEffects';
import {
  BattleFeedbackLayer,
  type BattleFeedbackEvent,
} from '@/components/BattleFeedbackLayer';
import { BattleDamageOverlay, type DamageEvent } from '@/components/BattleDamageOverlay';
import { BattleSwipeZone } from '@/components/BattleSwipeZone';
import { BattleSlot, BattleTargetSlot } from '@/components/BattleTargetSlot';
import { createStyles } from './styles';

type BattleLogEntry = {
  id: string;
  title: string;
  detail: string;
  accent: string;
};

type BattleFocus = 'enemy-line' | 'player-line';

type BattlefieldRow = 'front' | 'back';

const battleRules = [
  { label: '阶段', value: '声明 → 施行 → 结束' },
  { label: '前排', value: '可基础攻击' },
  { label: '后排', value: '可被法术与穿透处理' },
  { label: '反制', value: '选定目标后可打断' },
];

const createInitialBattleSlots = (): BattleSlot[] => [
  {
    id: 'front-1',
    title: '先锋盾阵',
    row: 'front',
    index: 0,
    health: 7,
    maxHealth: 7,
    counterArmed: true,
    status: 'alive',
  },
  {
    id: 'front-2',
    title: '战线中枢',
    row: 'front',
    index: 1,
    health: 6,
    maxHealth: 6,
    counterArmed: false,
    status: 'alive',
  },
  {
    id: 'front-3',
    title: '右翼冲锋',
    row: 'front',
    index: 2,
    health: 5,
    maxHealth: 5,
    counterArmed: false,
    status: 'alive',
  },
  {
    id: 'back-1',
    title: '后援火力',
    row: 'back',
    index: 0,
    health: 5,
    maxHealth: 5,
    counterArmed: false,
    status: 'alive',
  },
  {
    id: 'back-2',
    title: '补给线',
    row: 'back',
    index: 1,
    health: 4,
    maxHealth: 4,
    counterArmed: false,
    status: 'alive',
  },
  {
    id: 'back-3',
    title: '术式节点',
    row: 'back',
    index: 2,
    health: 4,
    maxHealth: 4,
    counterArmed: false,
    status: 'alive',
  },
];

export default function BattleScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const { width, height } = useWindowDimensions();
  const { shake, animatedStyle: shakeStyle } = useScreenShake();
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const damageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deathTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const [selectedCard, setSelectedCard] = useState<AnyCard | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [battleFocus, setBattleFocus] = useState<BattleFocus>('enemy-line');
  const [isTargeting, setIsTargeting] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [feedbackEvent, setFeedbackEvent] = useState<BattleFeedbackEvent | null>(null);
  const [damageEvent, setDamageEvent] = useState<DamageEvent | null>(null);
  const [battleSlots, setBattleSlots] = useState<BattleSlot[]>(() => createInitialBattleSlots());
  const [battleLog, setBattleLog] = useState<BattleLogEntry[]>([
    {
      id: 'rule-1',
      title: '战斗规则',
      detail: '声明阶段先于施行阶段。选牌后上滑进入目标模式，再点击前排或后排槽位完成结算。',
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
      deathTimersRef.current.forEach((timer) => clearTimeout(timer));
      deathTimersRef.current.clear();
    },
    []
  );

  const appendLog = (entry: BattleLogEntry) => {
    setBattleLog((current) => [entry, ...current].slice(0, 4));
  };

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

  const getCardDamage = (card: AnyCard) => {
    if (card.type === CardType.UNIT) {
      return card.attack;
    }

    if (card.type === CardType.TACTIC) {
      return Math.max(2, card.cost + 1);
    }

    return Math.max(2, card.cost);
  };

  const getTargetPoint = (slot: BattleSlot) => {
    const colX = [width * 0.18, width * 0.5, width * 0.82];
    const rowY = slot.row === 'front' ? height * 0.41 : height * 0.51;

    return {
      x: colX[slot.index] ?? width * 0.5,
      y: rowY,
    };
  };

  const queueDeathFade = (slotId: string) => {
    if (deathTimersRef.current.has(slotId)) {
      clearTimeout(deathTimersRef.current.get(slotId));
    }

    const timer = setTimeout(() => {
      setBattleSlots((current) =>
        current.map((slot) =>
          slot.id === slotId ? { ...slot, status: 'dead' } : slot
        )
      );
      deathTimersRef.current.delete(slotId);
    }, 560);

    deathTimersRef.current.set(slotId, timer);
  };

  const cancelTargetMode = () => {
    setIsTargeting(false);
    setSelectedCard(null);
    emitFeedback({
      kind: 'counter',
      title: '取消目标选择',
      detail: '已退出当前卡牌的目标锁定状态。',
      accent: '#6B7280',
      side: 'player',
      duration: 420,
    });
    appendLog({
      id: `cancel-${Date.now()}`,
      title: '取消锁定',
      detail: '目标选择已取消。',
      accent: '#6B7280',
    });
    void Haptics.selectionAsync();
  };

  const handleEndTurn = () => {
    setSelectedCard(null);
    setIsTargeting(false);
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

  const enterTargetMode = () => {
    if (!selectedCard) {
      emitFeedback({
        kind: 'turn',
        title: '尚未选牌',
        detail: '先点击一张手牌，再上滑进入目标选择。',
        accent: '#6B7280',
        side: 'player',
        duration: 420,
      });
      return;
    }

    setIsTargeting(true);
    emitFeedback({
      kind: 'spell',
      title: '进入目标选择',
      detail: '现在可以点击前排或后排槽位完成结算。',
      accent: '#C9A96E',
      side: 'player',
      duration: 520,
    });
    appendLog({
      id: `target-${Date.now()}`,
      title: '目标选择',
      detail: `${selectedCard.name} 已进入待结算状态。`,
      accent: '#C9A96E',
    });
    void Haptics.selectionAsync();
  };

  const resolveTargetSelection = (slotId: string) => {
    if (!selectedCard || !isTargeting || isResolving) {
      return;
    }

    const targetSlot = battleSlots.find((slot) => slot.id === slotId);
    if (!targetSlot || targetSlot.status !== 'alive') {
      return;
    }

    setIsResolving(true);
    const baseDamage = getCardDamage(selectedCard);
    const isCounterHit = targetSlot.counterArmed && selectedCard.type === CardType.UNIT;
    const rowPenalty = targetSlot.row === 'back' && selectedCard.type === CardType.UNIT ? 1 : 0;
    const finalDamage = Math.max(0, baseDamage - rowPenalty - (isCounterHit ? 1 : 0));
    const nextSlotHealth = Math.max(0, targetSlot.health - finalDamage);
    const slotPoint = getTargetPoint(targetSlot);
    const accent = selectedCard.faction === 'FRANCE'
      ? '#002FA7'
      : selectedCard.faction === 'ENGLAND'
        ? '#C8102E'
        : '#C9A96E';

    setBattleSlots((current) =>
      current.map((slot) => {
        if (slot.id !== slotId) {
          return slot;
        }

        return {
          ...slot,
          health: nextSlotHealth,
          counterArmed: false,
          status: nextSlotHealth <= 0 ? 'dying' : 'alive',
        };
      })
    );

    setEnemyHealth((current) => Math.max(0, current - finalDamage));
    emitFeedback({
      kind: isCounterHit ? 'counter' : 'attack',
      title: isCounterHit ? '反制打断' : `${selectedCard.name} 命中目标`,
      detail: isCounterHit
        ? '目标槽位触发反制，伤害被压缩并回响到己方。'
        : `已对 ${targetSlot.title} 造成 ${finalDamage} 点伤害。`,
      accent,
      side: 'player',
      duration: isCounterHit ? 720 : 780,
    });
    emitDamage({
      amount: Math.max(1, finalDamage),
      kind: isCounterHit ? 'counter' : 'damage',
      x: slotPoint.x,
      y: slotPoint.y,
      accent,
    });

    if (isCounterHit) {
      setPlayerHealth((current) => Math.max(0, current - 1));
      triggerScreenShake();
      appendLog({
        id: `counter-${Date.now()}`,
        title: '反制触发',
        detail: `${targetSlot.title} 阻断了这次攻击，并让你损失 1 点生命。`,
        accent: '#6B7280',
      });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      appendLog({
        id: `hit-${Date.now()}`,
        title: '目标结算',
        detail: `${targetSlot.title} 承受 ${finalDamage} 点伤害。`,
        accent,
      });
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (nextSlotHealth <= 0) {
      appendLog({
        id: `death-${Date.now()}`,
        title: '单位退场',
        detail: `${targetSlot.title} 已被击破，正在退场。`,
        accent: '#111827',
      });
      emitFeedback({
        kind: 'turn',
        title: '单位退场',
        detail: `${targetSlot.title} 失去战斗能力。`,
        accent: '#111827',
        side: 'enemy',
        duration: 620,
      });
      queueDeathFade(slotId);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setSelectedCard(null);
    setIsTargeting(false);
    setBattleFocus('enemy-line');

    setTimeout(() => {
      setIsResolving(false);
    }, 260);
  };

  const handleCardPress = (card: AnyCard) => {
    setSelectedCard(card);
    setIsTargeting(false);
    setBattleFocus('enemy-line');
    emitFeedback({
      kind: 'attack',
      title: `${card.name} 已锁定`,
      detail: '上滑进入目标选择，或下滑取消。',
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

    if (direction === 'up') {
      if (selectedCard) {
        enterTargetMode();
      } else {
        emitFeedback({
          kind: 'turn',
          title: '先选一张牌',
          detail: '上滑动作需要先锁定手牌。',
          accent: '#6B7280',
          side: 'player',
          duration: 420,
        });
      }
      return;
    }

    if (direction === 'down') {
      if (isTargeting || selectedCard) {
        cancelTargetMode();
        return;
      }

      emitFeedback({
        kind: 'counter',
        title: '暂无可取消内容',
        detail: '你当前没有锁定卡牌。',
        accent: '#6B7280',
        side: 'player',
        duration: 380,
      });
    }
  };

  const renderHandCard = (card: AnyCard, index: number) => (
    <Animated.View
      key={`${card.id}-${index}`}
      entering={FadeInDown.delay(index * 80).duration(420)}
      style={styles.handCardShell}
    >
      <KardsCard
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
            setIsTargeting(false);
          }
        }}
      />
    </Animated.View>
  );

  const renderBattleSlot = (slot: BattleSlot) => (
    <BattleTargetSlot
      key={slot.id}
      slot={slot}
      selected={false}
      targeting={isTargeting && selectedCard != null}
      accent={selectedCard?.faction === 'FRANCE'
        ? '#002FA7'
        : selectedCard?.faction === 'ENGLAND'
          ? '#C8102E'
          : '#C9A96E'}
      onPress={() => resolveTargetSelection(slot.id)}
    />
  );

  const renderRow = (row: BattlefieldRow) => {
    const rowSlots = battleSlots.filter((slot) => slot.row === row);

    return (
      <View style={styles.slotRowBlock} key={row}>
        <View style={styles.rowHeader}>
          <ThemedText variant="caption" color={theme.textMuted} style={styles.rowHeaderLabel}>
            {row === 'front' ? '前排槽位' : '后排槽位'}
          </ThemedText>
          <ThemedText variant="caption" color={theme.textMuted} style={styles.rowHeaderHint}>
            {isTargeting && selectedCard
              ? '点击槽位完成结算'
              : row === 'front'
                ? '承受正面冲击'
                : '适合远程与法术处理'}
          </ThemedText>
        </View>
        <View style={styles.slotRowGrid}>{rowSlots.map(renderBattleSlot)}</View>
      </View>
    );
  };

  const selectedCardLabel = selectedCard
    ? `已选：${selectedCard.name}`
    : '未选中手牌';

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
            <View style={styles.battlefieldHeader}>
              <View style={styles.battlefieldFocusRow}>
                <ThemedText variant="caption" color={theme.textMuted} style={styles.battlefieldLabel}>
                  {battleFocus === 'enemy-line' ? '当前聚焦：敌方阵线' : '当前聚焦：己方阵线'}
                </ThemedText>
                {isTargeting && selectedCard && (
                  <View style={styles.targetBadge}>
                    <ThemedText variant="caption" color="#FFFFFF" style={styles.targetBadgeText}>
                      目标选择中
                    </ThemedText>
                  </View>
                )}
              </View>
              <ThemedText variant="small" color={theme.textSecondary} style={styles.selectionText}>
                {selectedCardLabel}
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

            {renderRow('front')}
            <View style={styles.battleDivider} />
            {renderRow('back')}
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
