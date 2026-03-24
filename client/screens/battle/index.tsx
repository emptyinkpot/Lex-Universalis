import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TouchableOpacity, View, useWindowDimensions } from 'react-native';
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
import { INITIAL_CARDS, AnyCard, CardType } from '@/types/game';
import { useScreenShake } from '@/utils/cardEffects';
import {
  BattleFeedbackLayer,
  type BattleFeedbackEvent,
} from '@/components/BattleFeedbackLayer';
import { BattleCastOverlay, type BattleCastEvent } from '@/components/BattleCastOverlay';
import { BattleDamageOverlay, type DamageEvent } from '@/components/BattleDamageOverlay';
import { BattleImpactOverlay, type BattleImpactEvent } from '@/components/BattleImpactOverlay';
import { BattleHandCardMotion } from '@/components/BattleHandCardMotion';
import { BattlePileBadge } from '@/components/BattlePileBadge';
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
type Point = { x: number; y: number };

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
  const router = useSafeRouter();
  const { width, height } = useWindowDimensions();
  const isDesktopBattle = width >= 1100;
  const styles = useMemo(() => createStyles(theme, width, height), [height, theme, width]);
  const { shake, animatedStyle: shakeStyle } = useScreenShake();
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const damageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const impactTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deathTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const dealTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const drawCursorRef = useRef(0);
  const handRef = useRef<AnyCard[]>([]);
  const deckAnchorRef = useRef<Point | null>(null);
  const discardAnchorRef = useRef<Point | null>(null);

  const [selectedCard, setSelectedCard] = useState<AnyCard | null>(null);
  const [selectedHandIndex, setSelectedHandIndex] = useState<number | null>(null);
  const [selectedQueueIds, setSelectedQueueIds] = useState<string[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isHandDragging, setIsHandDragging] = useState(false);
  const [dragPoint, setDragPoint] = useState<{ x: number; y: number } | null>(null);
  const [handCollapsed, setHandCollapsed] = useState(false);
  const [battleFocus, setBattleFocus] = useState<BattleFocus>('enemy-line');
  const [isTargeting, setIsTargeting] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [feedbackEvent, setFeedbackEvent] = useState<BattleFeedbackEvent | null>(null);
  const [damageEvent, setDamageEvent] = useState<DamageEvent | null>(null);
  const [castEvents, setCastEvents] = useState<BattleCastEvent[]>([]);
  const [impactEvent, setImpactEvent] = useState<BattleImpactEvent | null>(null);
  const [discardCount, setDiscardCount] = useState(0);
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
  const battleDeck = useMemo(
    () => [...INITIAL_CARDS, ...INITIAL_CARDS.slice(0, 5)].map((card, index) => ({
      ...card,
      id: `${card.id}-battle-${index}`,
    })),
    []
  );
  const [hand, setHand] = useState<AnyCard[]>([]);
  const selectedQueue = useMemo(
    () =>
      selectedQueueIds
        .map((id) => hand.find((card) => card.id === id))
        .filter((card): card is AnyCard => Boolean(card)),
    [hand, selectedQueueIds],
  );

  useEffect(() => {
    handRef.current = hand;
  }, [hand]);

  useEffect(
    () => () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
      if (damageTimerRef.current) {
        clearTimeout(damageTimerRef.current);
      }
      if (impactTimerRef.current) {
        clearTimeout(impactTimerRef.current);
      }
      deathTimersRef.current.forEach((timer) => clearTimeout(timer));
      deathTimersRef.current.clear();
      dealTimersRef.current.forEach((timer) => clearTimeout(timer));
      dealTimersRef.current = [];
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

  const emitImpact = (event: Omit<BattleImpactEvent, 'id'>) => {
    if (impactTimerRef.current) {
      clearTimeout(impactTimerRef.current);
    }

    const nextEvent: BattleImpactEvent = {
      ...event,
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    };

    setImpactEvent(nextEvent);
    impactTimerRef.current = setTimeout(() => {
      setImpactEvent(null);
    }, 700);
  };

  const queueCastEvent = (event: Omit<BattleCastEvent, 'id'>, duration = 780) => {
    const nextEvent: BattleCastEvent = {
      ...event,
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    };

    setCastEvents((current) => [...current, nextEvent]);
    setTimeout(() => {
      setCastEvents((current) => current.filter((item) => item.id !== nextEvent.id));
    }, duration);
  };

  const getHandPoint = (index: number) => {
    const desktopSpread = Math.min(152, width * 0.095);
    const spread = width >= 1360 ? desktopSpread : Math.min(width * 0.12, 86);
    const centerOffset = index - Math.max(0, hand.length - 1) / 2;
    return {
      x: width * 0.5 + centerOffset * spread,
      y: height - (width >= 1360 ? 168 : 154),
    };
  };

  const scheduleDrawCard = (delay = 0, reason: 'deal' | 'draw' = 'draw') => {
    if (drawCursorRef.current >= battleDeck.length) {
      return;
    }

    const card = battleDeck[drawCursorRef.current];
    drawCursorRef.current += 1;
    const timer = setTimeout(() => {
      const targetIndex = handRef.current.length;
      const targetPoint = getHandPoint(targetIndex);
      const deckAnchor = deckAnchorRef.current ?? {
        x: width * 0.18,
        y: height - 126,
      };

      queueCastEvent(
        {
          kind: 'draw',
          accent: '#d7b26d',
          fromX: deckAnchor.x,
          fromY: deckAnchor.y,
          toX: targetPoint.x,
          toY: targetPoint.y,
        },
        820,
      );
      setHand((current) => [...current, card]);
      if (reason === 'draw') {
        appendLog({
          id: `draw-${Date.now()}`,
          title: '抽取手牌',
          detail: `${card.name} 已加入手牌。`,
          accent: '#C9A96E',
        });
        emitFeedback({
          kind: 'turn',
          title: '补入新牌',
          detail: `${card.name} 已进入手牌区。`,
          accent: '#C9A96E',
          side: 'player',
          duration: 420,
        });
      }
    }, delay);

    dealTimersRef.current.push(timer);
  };

  useEffect(() => {
    setHand([]);
    setCastEvents([]);
    setImpactEvent(null);
    setDiscardCount(0);
    setSelectedQueueIds([]);
    drawCursorRef.current = 0;
    dealTimersRef.current.forEach((timer) => clearTimeout(timer));
    dealTimersRef.current = [];
    for (let index = 0; index < 5; index += 1) {
      scheduleDrawCard(index * 130, 'deal');
    }
  }, [battleDeck]);

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

  const getDraggedTargetSlotId = () => {
    if (!dragPoint) {
      return null;
    }

    const hitSlot = battleSlots.find((slot) => {
      if (slot.status !== 'alive') {
        return false;
      }

      const point = getTargetPoint(slot);
      const withinX = Math.abs(dragPoint.x - point.x) <= 88;
      const withinY = Math.abs(dragPoint.y - point.y) <= 68;
      return withinX && withinY;
    });

    return hitSlot?.id ?? null;
  };

  const draggedTargetSlotId = getDraggedTargetSlotId();
  const dragGuidePreview = selectedCard && selectedHandIndex !== null && dragPoint
    ? {
        accent: selectedCard.faction === 'FRANCE'
          ? '#002FA7'
          : selectedCard.faction === 'ENGLAND'
            ? '#C8102E'
            : '#C9A96E',
        fromX: getHandPoint(selectedHandIndex).x,
        fromY: getHandPoint(selectedHandIndex).y,
        toX: draggedTargetSlotId
          ? getTargetPoint(battleSlots.find((slot) => slot.id === draggedTargetSlotId) ?? battleSlots[0]).x
          : dragPoint.x,
        toY: draggedTargetSlotId
          ? getTargetPoint(battleSlots.find((slot) => slot.id === draggedTargetSlotId) ?? battleSlots[0]).y
          : dragPoint.y,
      }
    : null;

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
    setIsHandDragging(false);
    setDragPoint(null);
    setSelectedCard(null);
    setSelectedHandIndex(null);
    setSelectedQueueIds([]);
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
    setSelectedHandIndex(null);
    setSelectedQueueIds([]);
    setIsHandDragging(false);
    setDragPoint(null);
    setHandCollapsed(true);
    setTimeout(() => setHandCollapsed(false), 360);
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

  const stageCardSelection = (card: AnyCard, index: number, source: 'tap' | 'drag' = 'tap') => {
    setSelectedCard(card);
    setSelectedHandIndex(index);
    setSelectedQueueIds((current) => (current.includes(card.id) ? current : [...current, card.id]));
    setIsTargeting(false);
    setBattleFocus('enemy-line');
    emitFeedback({
      kind: 'attack',
      title: source === 'drag' ? `${card.name} 已抬手` : `${card.name} 已锁定`,
      detail: source === 'drag' ? '继续上拖进入目标选择，或松手回到手牌区。' : '上滑进入目标选择，或下滑取消。',
      accent: '#C9A96E',
      side: 'player',
      duration: 640,
    });
    appendLog({
      id: `${card.id}-${source}-${Date.now()}`,
      title: source === 'drag' ? '卡牌抬手' : '卡牌锁定',
      detail: `${card.name} 已进入待出牌状态。`,
      accent: '#C9A96E',
    });
  };

  const enterTargetMode = (cardOverride?: AnyCard) => {
    const activeCard = cardOverride ?? selectedCard;
    if (!activeCard) {
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

    setIsHandDragging(false);
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
      detail: `${activeCard.name} 已进入待结算状态。`,
      accent: '#C9A96E',
    });
    void Haptics.selectionAsync();
  };

  const resolveTargetSelection = (slotId: string) => {
    if (!selectedCard || !isTargeting || isResolving || selectedQueue.length === 0) {
      return;
    }

    const targetSlot = battleSlots.find((slot) => slot.id === slotId);
    if (!targetSlot || targetSlot.status !== 'alive') {
      return;
    }

    setIsResolving(true);
    let nextSlotHealth = targetSlot.health;
    let counterArmed = targetSlot.counterArmed;
    let totalDamage = 0;
    let counterHits = 0;
    const queuedCards = [...selectedQueue];
    const slotPoint = getTargetPoint(targetSlot);
    const accent = selectedCard.faction === 'FRANCE'
      ? '#002FA7'
      : selectedCard.faction === 'ENGLAND'
        ? '#C8102E'
        : '#C9A96E';

    queuedCards.forEach((card, queueIndex) => {
      const currentHandIndex = hand.findIndex((item) => item.id === card.id);
      const handPoint = getHandPoint(Math.max(0, currentHandIndex));
      const cardAccent = card.faction === 'FRANCE'
        ? '#002FA7'
        : card.faction === 'ENGLAND'
          ? '#C8102E'
          : '#C9A96E';
      const baseDamage = getCardDamage(card);
      const rowPenalty = targetSlot.row === 'back' && card.type === CardType.UNIT ? 1 : 0;
      const isCounterHit = counterArmed && card.type === CardType.UNIT;
      const finalDamage = Math.max(0, baseDamage - rowPenalty - (isCounterHit ? 1 : 0));

      totalDamage += finalDamage;
      if (isCounterHit) {
        counterHits += 1;
        counterArmed = false;
      }
      nextSlotHealth = Math.max(0, nextSlotHealth - finalDamage);

      setTimeout(() => {
        queueCastEvent({
          kind: 'attack',
          accent: cardAccent,
          fromX: handPoint.x,
          fromY: handPoint.y,
          toX: slotPoint.x,
          toY: slotPoint.y,
        });
      }, queueIndex * 120);

      const discardAnchor = discardAnchorRef.current ?? {
        x: width * 0.84,
        y: height - 126,
      };

      setTimeout(() => {
        queueCastEvent(
          {
            kind: 'discard',
            accent: '#8f5234',
            fromX: handPoint.x,
            fromY: handPoint.y,
            toX: discardAnchor.x,
            toY: discardAnchor.y,
          },
          760,
        );
      }, 180 + queueIndex * 120);
    });

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

    setEnemyHealth((current) => Math.max(0, current - totalDamage));
    emitFeedback({
      kind: counterHits > 0 ? 'counter' : 'attack',
      title: queuedCards.length > 1 ? `连携命中 ${targetSlot.title}` : `${selectedCard.name} 命中目标`,
      detail: counterHits > 0
        ? `连携总伤害 ${totalDamage}，目标触发了 ${counterHits} 次反制。`
        : `队列中的 ${queuedCards.length} 张牌总计造成 ${totalDamage} 点伤害。`,
      accent,
      side: 'player',
      duration: counterHits > 0 ? 760 : 820,
    });
    emitDamage({
      amount: Math.max(1, totalDamage),
      kind: counterHits > 0 ? 'counter' : 'damage',
      x: slotPoint.x,
      y: slotPoint.y,
      accent,
    });
    emitImpact({
      x: slotPoint.x,
      y: slotPoint.y,
      accent,
      shatter: nextSlotHealth <= 0 || counterHits > 0,
    });

    if (counterHits > 0) {
      setPlayerHealth((current) => Math.max(0, current - counterHits));
      triggerScreenShake();
      appendLog({
        id: `counter-${Date.now()}`,
        title: '反制触发',
        detail: `${targetSlot.title} 在连携期间反打了 ${counterHits} 次。`,
        accent: '#6B7280',
      });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      appendLog({
        id: `hit-${Date.now()}`,
        title: '目标结算',
        detail: `${targetSlot.title} 承受了 ${totalDamage} 点连携伤害。`,
        accent,
      });
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (nextSlotHealth <= 0) {
      appendLog({
        id: `death-${Date.now()}`,
        title: '单位退场',
        detail: `${targetSlot.title} 已被连携击破，正在退场。`,
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

    setHand((current) => current.filter((card) => !selectedQueueIds.includes(card.id)));
    setDiscardCount((current) => current + queuedCards.length);
    setSelectedCard(null);
    setSelectedHandIndex(null);
    setSelectedQueueIds([]);
    setIsTargeting(false);
    setDragPoint(null);
    setBattleFocus('enemy-line');
    queuedCards.forEach((_, queueIndex) => {
      scheduleDrawCard(420 + queueIndex * 140, 'draw');
    });

    setTimeout(() => {
      setIsResolving(false);
    }, 260 + queuedCards.length * 80);
  };

  const handleCardPress = (card: AnyCard, index: number) => {
    if (selectedQueueIds.includes(card.id) && !isTargeting) {
      const nextQueueIds = selectedQueueIds.filter((id) => id !== card.id);
      const nextLastId = nextQueueIds[nextQueueIds.length - 1];
      setSelectedQueueIds(nextQueueIds);
      setSelectedCard(nextLastId ? hand.find((item) => item.id === nextLastId) ?? null : null);
      setSelectedHandIndex(nextLastId ? hand.findIndex((item) => item.id === nextLastId) : null);
      setIsHandDragging(false);
      emitFeedback({
        kind: 'counter',
        title: '移出连携队列',
        detail: `${card.name} 已从当前连携序列中移除。`,
        accent: '#6B7280',
        side: 'player',
        duration: 360,
      });
      return;
    }

    stageCardSelection(card, index, 'tap');
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
      if (selectedQueue.length > 0) {
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
      if (isTargeting || selectedQueue.length > 0) {
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
    <BattleHandCardMotion
      key={`${card.id}-${index}`}
      hovered={hoveredIndex === index}
      selected={selectedQueueIds.includes(card.id)}
      targeting={isTargeting}
      collapsed={handCollapsed}
      delay={index * 80}
      desktop={width >= 1360}
    >
      <KardsCard
        card={card}
        size={width >= 1360 ? 'large' : 'medium'}
        showStats
        fanIndex={index}
        totalFanCards={hand.length}
        isHovered={hoveredIndex === index}
        isSelected={selectedQueueIds.includes(card.id)}
        onPress={() => handleCardPress(card, index)}
        onPressIn={() => setHoveredIndex(index)}
        onPressOut={() => setHoveredIndex(null)}
        onDragStart={() => {
          setIsHandDragging(true);
          setDragPoint(null);
          setHoveredIndex(index);
          stageCardSelection(card, index, 'drag');
        }}
        onDragEnd={() => {
          setIsHandDragging(false);
          setHoveredIndex(null);
          setDragPoint(null);
        }}
        onDropInZone={() => {
          setHoveredIndex(null);
          if (draggedTargetSlotId) {
            resolveTargetSelection(draggedTargetSlotId);
            return;
          }
          stageCardSelection(card, index, 'drag');
          enterTargetMode(card);
        }}
        onDragMove={(point) => {
          setDragPoint(point);
        }}
        onDeselect={() => {
          if (selectedQueueIds.includes(card.id)) {
            const nextQueueIds = selectedQueueIds.filter((id) => id !== card.id);
            const nextLastId = nextQueueIds[nextQueueIds.length - 1];
            setSelectedQueueIds(nextQueueIds);
            setSelectedCard(nextLastId ? hand.find((item) => item.id === nextLastId) ?? null : null);
            setSelectedHandIndex(nextLastId ? hand.findIndex((item) => item.id === nextLastId) : null);
            setIsHandDragging(false);
            setDragPoint(null);
            setIsTargeting(false);
          }
        }}
      />
    </BattleHandCardMotion>
  );

  const renderBattleSlot = (slot: BattleSlot) => (
    <BattleTargetSlot
      key={slot.id}
      slot={slot}
      selected={draggedTargetSlotId === slot.id}
      hovered={draggedTargetSlotId === slot.id}
      targeting={isTargeting && selectedQueue.length > 0}
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
            {isTargeting && selectedQueue.length > 0
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

  const selectedCardLabel = selectedQueue.length > 0
    ? `连携队列 ${selectedQueue.length} 张：${selectedQueue.map((card) => card.name).join(' / ')}`
    : '未选中手牌';

  const battleCore = (
    <BattleSwipeZone onSwipe={handleBattleSwipe}>
      <Animated.View
        style={[shakeStyle, isDesktopBattle ? styles.desktopBattlefield : styles.battlefield]}
      >
        <View style={styles.battlefieldHeader}>
          <View style={styles.battlefieldFocusRow}>
            <ThemedText variant="caption" color={theme.textMuted} style={styles.battlefieldLabel}>
              {battleFocus === 'enemy-line' ? 'Enemy Line Focus' : 'Player Line Focus'}
            </ThemedText>
            {isTargeting && selectedCard && (
              <View style={styles.targetBadge}>
                <ThemedText variant="caption" color="#FFFFFF" style={styles.targetBadgeText}>
                  Targeting
                </ThemedText>
              </View>
            )}
          </View>
          <ThemedText variant="small" color={theme.textSecondary} style={styles.selectionText}>
            {selectedCardLabel}
          </ThemedText>
          <View style={styles.swipeHintRow}>
            <ThemedText variant="caption" color={theme.textMuted} style={styles.swipeHint}>
              Switch Focus
            </ThemedText>
            <ThemedText variant="caption" color={theme.textMuted} style={styles.swipeHint}>
              Play Card
            </ThemedText>
            <ThemedText variant="caption" color={theme.textMuted} style={styles.swipeHint}>
              Cancel
            </ThemedText>
          </View>
        </View>

        {renderRow('front')}
        <View style={styles.battleDivider} />
        {renderRow('back')}
      </Animated.View>
    </BattleSwipeZone>
  );

  const battleLogPanel = (
    <FlashList
      data={battleLog}
      numColumns={isDesktopBattle ? 1 : 2}
      key={isDesktopBattle ? 'desktop-log' : 'mobile-log'}
      keyExtractor={(item) => item.id}
      contentContainerStyle={isDesktopBattle ? styles.desktopLogPanel : styles.logPanel}
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
  );

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle="light">
      <View style={styles.container}>
        <BattleFeedbackLayer event={feedbackEvent} />
        <BattleDamageOverlay event={damageEvent} />
        <BattleCastOverlay events={castEvents} preview={dragGuidePreview} />
        <BattleImpactOverlay event={impactEvent} />

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

        {isDesktopBattle ? (
          <View style={styles.desktopBattleStage}>
            {battleCore}

            <View style={styles.desktopSideRail}>
              <View style={styles.desktopSideCard}>
                <View style={styles.desktopSideHeader}>
                  <ThemedText
                    variant="caption"
                    color={theme.textMuted}
                    style={styles.desktopSideHeaderLabel}
                  >
                    Rules
                  </ThemedText>
                </View>
                <View style={styles.desktopRuleStack}>
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
              </View>

              <View style={[styles.desktopSideCard, styles.desktopLogCard]}>
                <View style={styles.desktopSideHeader}>
                  <ThemedText
                    variant="caption"
                    color={theme.textMuted}
                    style={styles.desktopSideHeaderLabel}
                  >
                    Log
                  </ThemedText>
                </View>
                {battleLogPanel}
              </View>
            </View>
          </View>
        ) : (
          <>
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
            {battleCore}
            {battleLogPanel}
          </>
        )}

        <View style={styles.handContainer}>
          <View style={styles.handInfoRow}>
            <ThemedText variant="caption" color={theme.textMuted} style={styles.handLabel}>
              手牌 ({hand.length})
            </ThemedText>
            <BattlePileBadge
              label="牌堆"
              count={Math.max(0, battleDeck.length - drawCursorRef.current)}
              icon="layer-group"
              accent="#d7b26d"
              onMeasure={(point) => {
                deckAnchorRef.current = point;
              }}
            />
            <ThemedText variant="caption" color={theme.textMuted}>
              {isPlayerTurn ? '你的回合' : '敌方回合'}
            </ThemedText>
            <BattlePileBadge
              label="弃牌"
              count={discardCount}
              icon="box-archive"
              accent="#8f5234"
              onMeasure={(point) => {
                discardAnchorRef.current = point;
              }}
            />
          </View>
          <View style={[styles.releaseLane, (isHandDragging || isTargeting) && styles.releaseLaneActive]}>
            <View style={styles.releaseLaneGlow} />
            <ThemedText variant="tiny" color={(isHandDragging || isTargeting) ? '#f4dec1' : '#8f7759'}>
              {isTargeting ? '点选目标完成出牌' : isHandDragging ? '继续上拖以释放并选择目标' : '拖动卡牌抬手，或点击后上滑出牌'}
            </ThemedText>
          </View>
          {selectedQueue.length > 0 ? (
            <View style={styles.selectionTray}>
              <View style={styles.selectionDot} />
              <ThemedText variant="small" color={theme.textPrimary} style={styles.selectionTrayText}>
                {isTargeting
                  ? `${selectedQueue.length} 张牌已进入连携出牌，点击目标完成结算`
                  : `${selectedQueue.length} 张牌已加入连携队列，可继续点牌或直接指定目标`}
              </ThemedText>
            </View>
          ) : null}
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
