import React, { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { ThemedText } from './ThemedText';

export type BattleSlotStatus = 'alive' | 'dying' | 'dead';

export type BattleSlot = {
  id: string;
  title: string;
  row: 'front' | 'back';
  index: number;
  health: number;
  maxHealth: number;
  counterArmed: boolean;
  status: BattleSlotStatus;
};

interface BattleTargetSlotProps {
  slot: BattleSlot;
  selected: boolean;
  targeting: boolean;
  accent: string;
  onPress: () => void;
}

export function BattleTargetSlot({
  slot,
  selected,
  targeting,
  accent,
  onPress,
}: BattleTargetSlotProps) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (slot.status === 'dying') {
      opacity.value = withTiming(0.35, { duration: 180 });
      scale.value = withSpring(0.96, { damping: 18, stiffness: 220 });
      return;
    }

    if (slot.status === 'dead') {
      opacity.value = withTiming(0, { duration: 220 });
      scale.value = withTiming(0.9, { duration: 220 });
      return;
    }

    opacity.value = withTiming(1, { duration: 160 });
    scale.value = withSpring(selected ? 1.02 : 1, { damping: 15, stiffness: 220 });
  }, [selected, slot.status, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const hpPercent = slot.maxHealth > 0 ? Math.max(0, slot.health / slot.maxHealth) : 0;

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      disabled={slot.status !== 'alive'}
      style={{ flex: 1 }}
    >
      <Animated.View
        style={[
          styles.slot,
          animatedStyle,
          selected && styles.selected,
          targeting && styles.targeting,
          slot.status === 'dying' && styles.dying,
          slot.status === 'dead' && styles.dead,
          { borderColor: selected ? accent : 'rgba(0,47,167,0.14)' },
        ]}
      >
        <View style={styles.slotHeader}>
          <ThemedText variant="caption" color="#FFFFFF" style={styles.rowTag}>
            {slot.row === 'front' ? '前排' : '后排'}
          </ThemedText>
          <ThemedText variant="caption" color="#FFFFFF" style={styles.healthText}>
            {slot.health}/{slot.maxHealth}
          </ThemedText>
        </View>

        <ThemedText variant="smallMedium" color="#FFFFFF" style={styles.slotTitle} numberOfLines={1}>
          {slot.title}
        </ThemedText>

        <View style={styles.hpTrack}>
          <View
            style={[
              styles.hpFill,
              {
                width: `${Math.max(8, hpPercent * 100)}%`,
                backgroundColor: accent,
              },
            ]}
          />
        </View>

        <View style={styles.slotFooter}>
          <ThemedText variant="caption" color="#E5E7EB" style={styles.slotHint}>
            {slot.status === 'dying'
              ? '濒临退场'
              : slot.status === 'dead'
                ? '已退场'
                : targeting
                  ? '点击选择'
                  : slot.counterArmed
                    ? '可反制'
                    : '可选'}
          </ThemedText>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = {
  slot: {
    minHeight: 102,
    borderRadius: 18,
    borderWidth: 1,
    backgroundColor: 'rgba(7, 12, 24, 0.52)',
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  selected: {
    borderWidth: 2,
    shadowColor: '#00F0FF',
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  targeting: {
    backgroundColor: 'rgba(2, 12, 35, 0.72)',
  },
  dying: {
    borderStyle: 'dashed' as const,
  },
  dead: {
    backgroundColor: 'rgba(10, 14, 28, 0.28)',
  },
  slotHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  rowTag: {
    letterSpacing: 1,
  },
  healthText: {
    fontWeight: '700' as const,
  },
  slotTitle: {
    fontWeight: '700' as const,
  },
  hpTrack: {
    height: 6,
    borderRadius: 999,
    overflow: 'hidden' as const,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  hpFill: {
    height: 6,
    borderRadius: 999,
  },
  slotFooter: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  slotHint: {
    letterSpacing: 0.8,
  },
};
