import React, { useCallback, useEffect, useRef } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';

interface BattlePileBadgeProps {
  label: string;
  count: number;
  icon: 'layer-group' | 'box-archive';
  accent: string;
  onMeasure?: (point: { x: number; y: number }) => void;
}

export function BattlePileBadge({ label, count, icon, accent, onMeasure }: BattlePileBadgeProps) {
  const wrapRef = useRef<View | null>(null);
  const stack = Math.min(3, Math.max(1, count > 0 ? 3 : 1));

  const measurePosition = useCallback(() => {
    if (!onMeasure || !wrapRef.current) {
      return;
    }

    wrapRef.current.measureInWindow((x, y, width, height) => {
      onMeasure({
        x: x + width / 2,
        y: y + height / 2,
      });
    });
  }, [onMeasure]);

  const handleLayout = (_event: LayoutChangeEvent) => {
    measurePosition();
  };

  useEffect(() => {
    measurePosition();
  }, [count, measurePosition]);

  return (
    <View ref={wrapRef} style={styles.wrap} onLayout={handleLayout}>
      <View style={styles.stackArea}>
        {Array.from({ length: stack }).map((_, index) => (
          <View
            key={`${label}-${index}`}
            style={[
              styles.stackCard,
              {
                top: index * 3,
                left: index * 4,
                borderColor: accent,
                backgroundColor: index === stack - 1 ? '#efe0b8' : '#d1bf96',
              },
            ]}
          />
        ))}
        <View style={[styles.iconBadge, { backgroundColor: accent }]}>
          <FontAwesome6 name={icon} size={11} color="#120d09" />
        </View>
      </View>
      <View style={styles.copy}>
        <ThemedText variant="tiny" color="#8f7759">
          {label}
        </ThemedText>
        <ThemedText variant="smallMedium" color="#f4dec1">
          {count}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stackArea: {
    width: 48,
    height: 40,
    position: 'relative',
  },
  stackCard: {
    position: 'absolute',
    width: 28,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
  },
  iconBadge: {
    position: 'absolute',
    right: -4,
    bottom: -2,
    width: 18,
    height: 18,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    gap: 2,
  },
});
