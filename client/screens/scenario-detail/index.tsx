import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeRouter, useSafeSearchParams } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { createStyles } from './styles';

interface Scenario {
  id: string;
  name: string;
  year: number;
  era: string;
  description: string;
  historicalBackground: string;
}

interface Chapter {
  id: string;
  name: string;
  description: string;
  storyIntro: string;
  levels: Level[];
  order: number;
}

interface Level {
  id: string;
  chapterId: string;
  name: string;
  description: string;
  difficulty: string;
  storyText: string;
  enemyFaction: string;
  rewards: Array<{ description: string }>;
  victoryCondition: string;
  defeatCondition: string;
  order: number;
}

const storySteps = [
  { title: '战火起始', copy: '这不是完整战役树，而是一个可以直接试玩的展示剧情。', icon: 'fire-flame-curved' },
  { title: '章节陈述', copy: '你会先看到章节开场，再进入一场最小可玩的样板战斗。', icon: 'book-open' },
  { title: '进入战斗', copy: '这一跳转直接复用你项目现有战斗页，用来展示剧情与战斗串联。', icon: 'swords' },
] as const;

export default function ScenarioDetailScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const { scenarioId } = useSafeSearchParams<{ scenarioId: string }>();

  const [loading, setLoading] = useState(true);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [showStoryModal, setShowStoryModal] = useState(false);

  useEffect(() => {
    if (!scenarioId) return;
    void loadData();
  }, [scenarioId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [scenarioRes, chaptersRes] = await Promise.all([
        fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/campaign/scenarios/${scenarioId}`),
        fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/campaign/scenarios/${scenarioId}/chapters`),
      ]);

      const scenarioData = await scenarioRes.json();
      const chaptersData = await chaptersRes.json();

      if (scenarioData.success) {
        setScenario(scenarioData.data);
      }
      if (chaptersData.success) {
        const firstChapter = Array.isArray(chaptersData.data) ? chaptersData.data[0] ?? null : null;
        setChapter(firstChapter);
        setSelectedLevel(firstChapter?.levels?.[0] ?? null);
      }
    } catch (error) {
      console.error('加载剧本详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartBattle = () => {
    if (!selectedLevel) return;
    setShowStoryModal(false);
    router.push('/battle', {
      levelId: selectedLevel.id,
      enemyFaction: selectedLevel.enemyFaction,
      enemyDeck: JSON.stringify(selectedLevel.enemyFaction),
    });
  };

  if (loading) {
    return (
      <Screen backgroundColor="#0a0706" statusBarStyle="light">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d7b26d" />
          <ThemedText variant="body" color="#b8a284" style={styles.loadingText}>
            正在整理剧本与章节...
          </ThemedText>
        </View>
      </Screen>
    );
  }

  if (!scenario || !chapter || !selectedLevel) {
    return (
      <Screen backgroundColor="#0a0706" statusBarStyle="light">
        <View style={styles.loadingContainer}>
          <ThemedText variant="body" color="#b8a284">
            剧本数据不可用。
          </ThemedText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor="#0a0706" statusBarStyle="light">
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <View style={styles.headerOverlay} />
          <View style={styles.headerContainer}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <FontAwesome6 name="arrow-left" size={18} color="#f3e5c5" />
            </Pressable>
            <View style={styles.headerTitleContainer}>
              <ThemedText variant="caption" color="#d7b26d" style={styles.headerSubtitle}>
                {scenario.year} / {scenario.era}
              </ThemedText>
              <ThemedText variant="h2" color="#f3e5c5" style={styles.headerTitle}>
                {scenario.name}
              </ThemedText>
            </View>
          </View>
          <ThemedText variant="small" color="#b39c7e" style={styles.headerCopy}>
            {scenario.description}
          </ThemedText>
        </View>

        <View style={styles.introSection}>
          <View style={styles.introCard}>
            <View style={styles.introHeader}>
              <FontAwesome6 name="landmark" size={18} color="#d7b26d" />
              <ThemedText variant="h3" color="#f3e5c5">
                背景导读
              </ThemedText>
            </View>
            <ThemedText variant="body" color="#cdbb9d" style={styles.introText}>
              {scenario.historicalBackground}
            </ThemedText>
          </View>
        </View>

        <View style={styles.stepsSection}>
          {storySteps.map((step) => (
            <View key={step.title} style={styles.stepCard}>
              <View style={styles.stepIcon}>
                <FontAwesome6 name={step.icon as any} size={14} color="#d7b26d" />
              </View>
              <ThemedText variant="smallMedium" color="#f3e5c5">{step.title}</ThemedText>
              <ThemedText variant="small" color="#ab9576" style={styles.stepCopy}>
                {step.copy}
              </ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.chapterPanel}>
          <View style={styles.chapterPanelHeader}>
            <View>
              <ThemedText variant="caption" color="#d7b26d" style={styles.chapterPanelLabel}>
                chapter 01
              </ThemedText>
              <ThemedText variant="h3" color="#f3e5c5">
                {chapter.name}
              </ThemedText>
            </View>
            <View style={styles.chapterBadge}>
              <ThemedText variant="tiny" color="#22150d">样板剧本</ThemedText>
            </View>
          </View>

          <ThemedText variant="small" color="#b29c7e" style={styles.chapterPanelCopy}>
            {chapter.storyIntro}
          </ThemedText>

          <View style={styles.levelCard}>
            <View style={styles.levelHeader}>
              <View>
                <ThemedText variant="bodyMedium" color="#f3e5c5">{selectedLevel.name}</ThemedText>
                <ThemedText variant="tiny" color="#967f61">{selectedLevel.difficulty}</ThemedText>
              </View>
              <View style={styles.enemyBadge}>
                <FontAwesome6 name="flag" size={12} color="#d7b26d" />
                <ThemedText variant="tiny" color="#d7b26d">{selectedLevel.enemyFaction}</ThemedText>
              </View>
            </View>
            <ThemedText variant="small" color="#b8a283" style={styles.levelText}>
              {selectedLevel.storyText}
            </ThemedText>

            <View style={styles.levelFactRow}>
              <View style={styles.levelFact}>
                <ThemedText variant="tiny" color="#8d775a">胜利条件</ThemedText>
                <ThemedText variant="small" color="#eadcc0">{selectedLevel.victoryCondition}</ThemedText>
              </View>
              <View style={styles.levelFact}>
                <ThemedText variant="tiny" color="#8d775a">失败条件</ThemedText>
                <ThemedText variant="small" color="#eadcc0">{selectedLevel.defeatCondition}</ThemedText>
              </View>
            </View>

            <View style={styles.levelActions}>
              <Pressable style={styles.secondaryButton} onPress={() => setShowStoryModal(true)}>
                <FontAwesome6 name="scroll" size={14} color="#f3e5c5" />
                <ThemedText variant="smallMedium" color="#f3e5c5">查看战前文本</ThemedText>
              </Pressable>
              <Pressable style={styles.primaryButton} onPress={handleStartBattle}>
                <FontAwesome6 name="swords" size={14} color="#22150d" />
                <ThemedText variant="smallMedium" color="#22150d">开始展示战斗</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal visible={showStoryModal} transparent animationType="fade" onRequestClose={() => setShowStoryModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <ThemedText variant="h3" color="#f3e5c5">
                {selectedLevel.name}
              </ThemedText>
              <Pressable onPress={() => setShowStoryModal(false)} style={styles.modalClose}>
                <FontAwesome6 name="xmark" size={18} color="#f3e5c5" />
              </Pressable>
            </View>
            <ScrollView style={styles.modalBody}>
              <ThemedText variant="body" color="#d4c2a2" style={styles.modalStoryText}>
                {selectedLevel.storyText}
              </ThemedText>

              <View style={styles.modalFactCard}>
                <ThemedText variant="smallMedium" color="#f3e5c5">奖励展示</ThemedText>
                {selectedLevel.rewards.map((reward, index) => (
                  <ThemedText key={`${reward.description}-${index}`} variant="small" color="#af9879" style={styles.rewardText}>
                    • {reward.description}
                  </ThemedText>
                ))}
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <Pressable style={styles.secondaryButton} onPress={() => setShowStoryModal(false)}>
                <ThemedText variant="smallMedium" color="#f3e5c5">返回</ThemedText>
              </Pressable>
              <Pressable style={styles.primaryButton} onPress={handleStartBattle}>
                <FontAwesome6 name="play" size={13} color="#22150d" />
                <ThemedText variant="smallMedium" color="#22150d">进入战斗</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
