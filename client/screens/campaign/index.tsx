import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { AnimatedTiltSurface } from '@/components/AnimatedTiltSurface';
import { createStyles } from './styles';

interface Scenario {
  id: string;
  name: string;
  year: number;
  era: string;
  description: string;
  historicalBackground: string;
  playerFactions: string[];
  recommendedFaction?: string;
  chapters: Array<{
    id: string;
    name: string;
    description: string;
    storyIntro: string;
    levels: Array<{
      id: string;
      name: string;
      description: string;
      difficulty: string;
      storyText: string;
      enemyFaction: string;
      victoryCondition: string;
      defeatCondition: string;
      rewards: Array<{ description: string }>;
    }>;
  }>;
}

interface StoryProgress {
  totalStars: number;
  completedLevels: Array<{ levelId: string; stars: number }>;
}

const storyBeats = [
  { title: '王位争夺', copy: '英法王权冲突被正式点燃，整个大陆开始重新站队。', icon: 'crown' },
  { title: '前线试探', copy: '最初的战斗规模不大，但会决定后续战线和士气。', icon: 'shield-halved' },
  { title: '样板战斗', copy: '这一关会直接把剧情送进现有战斗系统，用来展示完整流程。', icon: 'swords' },
] as const;

export default function StoryModeScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();

  const [loading, setLoading] = useState(true);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [progress, setProgress] = useState<StoryProgress | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [scenariosRes, progressRes] = await Promise.all([
        fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/campaign/scenarios`),
        fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/campaign/progress/user_default`),
      ]);

      const scenariosData = await scenariosRes.json();
      const progressData = await progressRes.json();

      if (scenariosData.success) {
        setScenario(Array.isArray(scenariosData.data) ? scenariosData.data[0] ?? null : null);
      }
      if (progressData.success) {
        setProgress(progressData.data);
      }
    } catch (error) {
      console.error('加载故事模式失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const firstChapter = scenario?.chapters?.[0] ?? null;
  const firstLevel = firstChapter?.levels?.[0] ?? null;

  const openScenario = () => {
    if (!scenario) return;
    router.push('/scenario-detail', { scenarioId: scenario.id });
  };

  const startShowcaseBattle = () => {
    if (!firstLevel) return;
    router.push('/battle', {
      levelId: firstLevel.id,
      enemyFaction: firstLevel.enemyFaction,
      enemyDeck: JSON.stringify(firstLevel.enemyFaction),
    });
  };

  if (loading) {
    return (
      <Screen backgroundColor="#0a0706" statusBarStyle="light">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d7b26d" />
          <ThemedText variant="body" color="#b8a284" style={styles.loadingText}>
            正在展开故事卷轴...
          </ThemedText>
        </View>
      </Screen>
    );
  }

  if (!scenario || !firstChapter || !firstLevel) {
    return (
      <Screen backgroundColor="#0a0706" statusBarStyle="light">
        <View style={styles.loadingContainer}>
          <ThemedText variant="body" color="#b8a284">
            当前没有可展示的故事内容。
          </ThemedText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor="#0a0706" statusBarStyle="light">
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.heroHalo} />
          <ThemedText variant="caption" color="#d7b26d" style={styles.heroSubtitle}>
            STORY MODE
          </ThemedText>
          <ThemedText variant="h1" color="#f2e4c4" style={styles.heroTitle}>
            故事模式
          </ThemedText>
          <ThemedText variant="body" color="#b5a083" style={styles.heroCopy}>
            这里先保留一个可玩的展示剧本。点进去能看剧情、章节和示例战斗，不再是空页面。
          </ThemedText>

          <View style={styles.progressRow}>
            <View style={styles.progressChip}>
              <ThemedText variant="tiny" color="#8f7759">总星数</ThemedText>
              <ThemedText variant="h4" color="#f2e4c4">{progress?.totalStars ?? 0}</ThemedText>
            </View>
            <View style={styles.progressChip}>
              <ThemedText variant="tiny" color="#8f7759">章节</ThemedText>
              <ThemedText variant="h4" color="#f2e4c4">{scenario.chapters.length}</ThemedText>
            </View>
            <View style={styles.progressChip}>
              <ThemedText variant="tiny" color="#8f7759">关卡</ThemedText>
              <ThemedText variant="h4" color="#f2e4c4">{firstChapter.levels.length}</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.storyCard}>
          <View style={styles.storyCardHeader}>
            <View style={styles.storyYearBadge}>
              <ThemedText variant="smallMedium" color="#24160d">{scenario.year}</ThemedText>
            </View>
            <View style={styles.storyTitleBlock}>
              <ThemedText variant="h2" color="#f2e4c4">{scenario.name}</ThemedText>
              <ThemedText variant="small" color="#b29c7d">{scenario.era}</ThemedText>
            </View>
          </View>

          <ThemedText variant="body" color="#d2c0a1" style={styles.storyDescription}>
            {scenario.description}
          </ThemedText>
          <ThemedText variant="small" color="#9f8a6f" style={styles.storyBackground}>
            {scenario.historicalBackground}
          </ThemedText>

          <View style={styles.beatsGrid}>
            {storyBeats.map((beat) => (
              <AnimatedTiltSurface key={beat.title} style={styles.beatCardWrap} contentStyle={styles.beatCard} glowColor="rgba(215,178,109,0.22)">
                <View style={styles.beatIcon}>
                  <FontAwesome6 name={beat.icon as any} size={14} color="#d7b26d" />
                </View>
                <ThemedText variant="smallMedium" color="#f2e4c4">{beat.title}</ThemedText>
                <ThemedText variant="small" color="#a58f73" style={styles.beatCopy}>
                  {beat.copy}
                </ThemedText>
              </AnimatedTiltSurface>
            ))}
          </View>

          <View style={styles.ctaRow}>
            <Pressable style={styles.secondaryAction} onPress={openScenario}>
              <FontAwesome6 name="book-open" size={14} color="#f2e4c4" />
              <ThemedText variant="smallMedium" color="#f2e4c4">查看剧本详情</ThemedText>
            </Pressable>
            <Pressable style={styles.primaryAction} onPress={startShowcaseBattle}>
              <FontAwesome6 name="swords" size={14} color="#1f130b" />
              <ThemedText variant="smallMedium" color="#1f130b">直接进入示例战斗</ThemedText>
            </Pressable>
          </View>
        </View>

        <View style={styles.chapterPreview}>
          <View style={styles.chapterPreviewHeader}>
            <ThemedText variant="h3" color="#f2e4c4">当前展示章节</ThemedText>
            <View style={styles.chapterTag}>
              <ThemedText variant="tiny" color="#21150d">chapter 01</ThemedText>
            </View>
          </View>
          <ThemedText variant="bodyMedium" color="#e6d8b8">{firstChapter.name}</ThemedText>
          <ThemedText variant="small" color="#ab9577" style={styles.chapterPreviewText}>
            {firstChapter.storyIntro}
          </ThemedText>
          <View style={styles.levelPreviewCard}>
            <View style={styles.levelPreviewHeader}>
              <View>
                <ThemedText variant="smallMedium" color="#f2e4c4">{firstLevel.name}</ThemedText>
                <ThemedText variant="tiny" color="#947f63">{firstLevel.difficulty}</ThemedText>
              </View>
              <View style={styles.levelFactionBadge}>
                <FontAwesome6 name="flag" size={12} color="#d7b26d" />
                <ThemedText variant="tiny" color="#d7b26d">{firstLevel.enemyFaction}</ThemedText>
              </View>
            </View>
            <ThemedText variant="small" color="#b6a081" style={styles.levelPreviewText}>
              {firstLevel.storyText}
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
