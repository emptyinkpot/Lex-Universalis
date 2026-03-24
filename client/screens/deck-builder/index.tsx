import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { KardsCard } from '@/components/KardsCard';
import { INITIAL_CARDS, Faction, AnyCard } from '@/types/game';
import { createStyles } from './styles';

export default function DeckBuilderScreen() {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const styles = useMemo(() => createStyles(theme, width), [theme, width]);
  const router = useSafeRouter();
  const isDesktop = width >= 1280;

  const [selectedFaction, setSelectedFaction] = useState<Faction>(Faction.ENGLAND);
  const [deck, setDeck] = useState<AnyCard[]>([]);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const factionCards = useMemo(
    () => INITIAL_CARDS.filter((card) => card.faction === selectedFaction),
    [selectedFaction],
  );

  const averageCost = deck.length > 0
    ? (deck.reduce((sum, card) => sum + card.cost, 0) / deck.length).toFixed(1)
    : '0.0';

  const handleAddCard = (card: AnyCard) => {
    if (deck.length >= 30) {
      alert('卡组已满，最多 30 张。');
      return;
    }

    setDeck((current) => [...current, card]);
  };

  const handleRemoveCard = (index: number) => {
    setDeck((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const renderPoolCard = (card: AnyCard, index: number) => (
    <Pressable
      key={`${card.id}-${index}`}
      onPress={() => handleAddCard(card)}
      onHoverIn={() => setHoveredCardId(card.id)}
      onHoverOut={() => setHoveredCardId(null)}
      style={styles.cardSlot}
    >
      <KardsCard
        card={card}
        size={isDesktop ? 'medium' : 'small'}
        showStats
        isHovered={hoveredCardId === card.id}
      />
    </Pressable>
  );

  const renderDeckCard = (card: AnyCard, index: number) => (
    <Pressable key={`${card.id}-${index}`} onPress={() => handleRemoveCard(index)} style={styles.cardSlot}>
      <KardsCard
        card={card}
        size={isDesktop ? 'medium' : 'small'}
        showStats
        isSelected
      />
    </Pressable>
  );

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle="light">
      <ScrollView
        contentContainerStyle={styles.page}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isDesktop}
      >
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} style={styles.iconButton}>
              <FontAwesome6 name="arrow-left" size={14} color={theme.textPrimary} />
            </Pressable>
            <View style={styles.titleBlock}>
              <ThemedText variant="h2" color={theme.textPrimary}>卡组编辑</ThemedText>
              <ThemedText variant="small" color={theme.textMuted}>
                桌面端工作台布局。左侧选卡，右侧维护当前卡组，不需要整页上下翻。
              </ThemedText>
            </View>
            <Pressable
              style={[styles.primaryButton, deck.length === 0 && styles.primaryButtonDisabled]}
              onPress={() => {
                alert('卡组已保存。');
                router.back();
              }}
              disabled={deck.length === 0}
            >
              <FontAwesome6 name="floppy-disk" size={14} color="#FFFFFF" />
              <ThemedText variant="smallMedium" color="#FFFFFF">保存卡组</ThemedText>
            </Pressable>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <ThemedText variant="tiny" color={theme.textMuted}>卡组数量</ThemedText>
              <ThemedText variant="h3" color={theme.textPrimary}>{deck.length}/30</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText variant="tiny" color={theme.textMuted}>平均费用</ThemedText>
              <ThemedText variant="h3" color={theme.textPrimary}>{averageCost}</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText variant="tiny" color={theme.textMuted}>当前阵营</ThemedText>
              <ThemedText variant="h3" color={theme.textPrimary}>{selectedFaction}</ThemedText>
            </View>
          </View>

          <View style={styles.factionRow}>
            {Object.values(Faction).map((faction) => (
              <Pressable
                key={faction}
                style={[
                  styles.factionButton,
                  selectedFaction === faction && styles.factionButtonActive,
                ]}
                onPress={() => setSelectedFaction(faction)}
              >
                <ThemedText
                  variant="smallMedium"
                  color={selectedFaction === faction ? '#FFFFFF' : theme.textPrimary}
                >
                  {faction}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.workspace}>
          <View style={styles.column}>
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <ThemedText variant="h4" color={theme.textPrimary}>可选卡牌</ThemedText>
                <ThemedText variant="small" color={theme.textMuted}>{factionCards.length} 张</ThemedText>
              </View>
              <View style={styles.cardGrid}>
                {factionCards.map(renderPoolCard)}
              </View>
            </View>
          </View>

          <View style={styles.column}>
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <ThemedText variant="h4" color={theme.textPrimary}>当前卡组</ThemedText>
                <ThemedText variant="small" color={theme.textMuted}>点击卡牌可移除</ThemedText>
              </View>
              {deck.length > 0 ? (
                <View style={styles.cardGrid}>
                  {deck.map(renderDeckCard)}
                </View>
              ) : (
                <View style={styles.emptyDeck}>
                  <FontAwesome6 name="clone" size={44} color={theme.textMuted} />
                  <ThemedText variant="bodyMedium" color={theme.textPrimary}>当前还没有卡牌</ThemedText>
                  <ThemedText variant="small" color={theme.textMuted}>
                    从左侧卡池点击卡牌，把它们加入当前卡组。
                  </ThemedText>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
