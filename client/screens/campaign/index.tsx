import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';
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
  playerFactions: string[];
  recommendedFaction?: string;
  chapters: any[];
  order: number;
}

interface CampaignProgress {
  currentChapter: string;
  completedLevels: any[];
  totalStars: number;
  unlockedChapters: string[];
}

export default function StoryModeScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();

  const [loading, setLoading] = useState(true);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [progress, setProgress] = useState<CampaignProgress | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const scenariosRes = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/campaign/scenarios`);
      const scenariosData = await scenariosRes.json();
      if (scenariosData.success) {
        setScenarios(scenariosData.data);
      }

      const userId = 'user_default';
      const progressRes = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/campaign/progress/${userId}`);
      const progressData = await progressRes.json();
      if (progressData.success) {
        setProgress(progressData.data);
      }
    } catch (error) {
      console.error('加载故事模式失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScenarioPress = (scenario: Scenario) => {
    router.push('/scenario-detail', { scenarioId: scenario.id });
  };

  if (loading) {
    return (
      <Screen backgroundColor={theme.backgroundRoot} statusBarStyle="light">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <ThemedText variant="body" color={theme.textSecondary} style={styles.loadingText}>
            加载中...
          </ThemedText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle="light">
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.heroHeader}>
            <View style={styles.heroTitleContainer}>
              <ThemedText variant="caption" color="#C9A96E" style={styles.heroSubtitle}>
                STORY MODE
              </ThemedText>
              <ThemedText variant="h1" color="#FFFFFF" style={styles.heroTitle}>
                故事模式
              </ThemedText>
            </View>
          </View>
          <View style={styles.heroDivider} />

          {progress && (
            <View style={styles.progressContainer}>
              <ThemedText variant="caption" color="#C9A96E" style={styles.progressLabel}>
                当前星数
              </ThemedText>
              <ThemedText variant="h3" color="#FFFFFF" style={styles.progressValue}>
                {progress.totalStars}
              </ThemedText>
            </View>
          )}
        </View>

        <View style={styles.scenariosContainer}>
          <ThemedText variant="h3" color={theme.textPrimary} style={styles.sectionTitle}>
            当前仅开放一个剧本
          </ThemedText>
          {scenarios.map((scenario) => (
            <TouchableOpacity
              key={scenario.id}
              style={styles.scenarioCard}
              onPress={() => handleScenarioPress(scenario)}
              activeOpacity={0.7}
            >
              <View style={styles.yearBadge}>
                <ThemedText variant="caption" color="#FFFFFF" style={styles.yearText}>
                  {scenario.year}
                </ThemedText>
              </View>

              <View style={styles.scenarioContent}>
                <View style={styles.scenarioHeader}>
                  <ThemedText variant="h3" color={theme.textPrimary} style={styles.scenarioName}>
                    {scenario.name}
                  </ThemedText>
                  <View style={styles.eraBadge}>
                    <ThemedText variant="caption" color="#C9A96E">
                      {scenario.era}
                    </ThemedText>
                  </View>
                </View>

                <ThemedText
                  variant="body"
                  color={theme.textSecondary}
                  style={styles.scenarioDescription}
                  numberOfLines={2}
                >
                  {scenario.description}
                </ThemedText>

                <ThemedText
                  variant="small"
                  color={theme.textMuted}
                  style={styles.scenarioBackground}
                  numberOfLines={1}
                >
                  {scenario.historicalBackground}
                </ThemedText>

                <View style={styles.scenarioMeta}>
                  <View style={styles.metaItem}>
                    <FontAwesome6 name="scroll" size={14} color={theme.textMuted} />
                    <ThemedText variant="caption" color={theme.textMuted}>
                      {scenario.chapters.length} 章节
                    </ThemedText>
                  </View>

                  {scenario.recommendedFaction && (
                    <View style={styles.metaItem}>
                      <FontAwesome6 name="flag" size={14} color="#C9A96E" />
                      <ThemedText variant="caption" color={theme.textSecondary}>
                        推荐阵营
                      </ThemedText>
                    </View>
                  )}
                </View>
              </View>

              <FontAwesome6 name="chevron-right" size={20} color={theme.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}
