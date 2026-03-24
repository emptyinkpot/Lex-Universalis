import React, { useMemo, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
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
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();

  const [selectedFaction, setSelectedFaction] = useState<Faction>(Faction.ENGLAND);
  const [deck, setDeck] = useState<AnyCard[]>([]);
  const [hoveredCardId, setSelectedCardId] = useState<string | null>(null);

  // 过滤当前阵营的卡牌
  const factionCards = useMemo(() => {
    return INITIAL_CARDS.filter(card => card.faction === selectedFaction);
  }, [selectedFaction]);

  // 添加卡牌到卡组
  const handleAddCard = (card: AnyCard) => {
    if (deck.length >= 30) {
      alert('卡组已满（最多30张）');
      return;
    }
    setDeck([...deck, card]);
  };

  // 从卡组移除卡牌
  const handleRemoveCard = (index: number) => {
    setDeck(deck.filter((_, i) => i !== index));
  };

  // 渲染卡牌列表
  const renderFactionCards = () => {
    return (
      <View style={styles.cardsGrid}>
        {factionCards.map((card, index) => (
          <TouchableOpacity
            key={`${card.id}-${index}`}
            onPress={() => handleAddCard(card)}
            activeOpacity={0.7}
          >
            <KardsCard
              card={card}
              size="small"
              showStats={true}
              isHovered={hoveredCardId === card.id}
              style={styles.gridCard}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // 渲染卡组中的卡牌
  const renderDeckCards = () => {
    if (deck.length === 0) {
      return (
        <View style={styles.emptyDeck}>
          <FontAwesome6 name="clone" size={48} color={theme.textMuted} />
          <ThemedText variant="body" color={theme.textMuted} style={styles.emptyText}>
            点击上方卡牌添加到卡组
          </ThemedText>
        </View>
      );
    }

    return (
      <View style={styles.cardsGrid}>
        {deck.map((card, index) => (
          <TouchableOpacity
            key={`${card.id}-${index}`}
            onPress={() => handleRemoveCard(index)}
            activeOpacity={0.7}
          >
            <KardsCard
              card={card}
              size="small"
              showStats={true}
              isSelected={true}
              style={styles.gridCard}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle="light">
      <View style={styles.container}>
        {/* 顶部栏 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome6 name="arrow-left" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <ThemedText variant="h3" color={theme.textPrimary}>
            卡组编辑
          </ThemedText>
          <View style={{ width: 24 }} />
        </View>

        {/* 阵营选择 */}
        <View style={styles.factionSelector}>
          {Object.values(Faction).map(faction => (
            <TouchableOpacity
              key={faction}
              style={[
                styles.factionButton,
                selectedFaction === faction && styles.factionButtonActive,
              ]}
              onPress={() => setSelectedFaction(faction)}
            >
              <ThemedText
                variant="smallMedium"
                color={selectedFaction === faction ? '#FFFFFF' : theme.textMuted}
              >
                {faction}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* 卡组统计 */}
        <View style={styles.deckStats}>
          <View style={styles.statItem}>
            <ThemedText variant="h2" color="#002FA7" style={styles.statValue}>
              {deck.length}
            </ThemedText>
            <ThemedText variant="caption" color={theme.textMuted} style={styles.statLabel}>
              / 30
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText variant="caption" color={theme.textMuted}>
              阵营:
            </ThemedText>
            <ThemedText variant="smallMedium" color={theme.textPrimary} style={styles.statLabel}>
              {selectedFaction}
            </ThemedText>
          </View>
        </View>

        {/* 可选卡牌列表 */}
        <View style={styles.section}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            可选卡牌 ({factionCards.length})
          </ThemedText>
          {renderFactionCards()}
        </View>

        {/* 当前卡组 */}
        <View style={styles.section}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            当前卡组 ({deck.length}/30)
          </ThemedText>
          {renderDeckCards()}
        </View>

        {/* 保存按钮 */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            alert('卡组已保存！');
            router.back();
          }}
          disabled={deck.length === 0}
        >
          <ThemedText variant="labelTitle" color="#FFFFFF">
            保存卡组
          </ThemedText>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}
