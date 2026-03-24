import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { createStyles } from './styles';

// 剧本接口
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

// 战役进度接口
interface CampaignProgress {
  currentChapter: string;
  completedLevels: any[];
  totalStars: number;
  unlockedChapters: string[];
}

export default function CampaignScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();

  const [loading, setLoading] = useState(true);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [progress, setProgress] = useState<CampaignProgress | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 获取所有剧本
      const scenariosRes = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/campaign/scenarios`);
      const scenariosData = await scenariosRes.json();
      
      if (scenariosData.success) {
        setScenarios(scenariosData.data);
      }

      // 获取玩家进度
      const userId = 'user_default';
      const progressRes = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/campaign/progress/${userId}`);
      const progressData = await progressRes.json();
      
      if (progressData.success) {
        setProgress(progressData.data);
      }
    } catch (error) {
      console.error('加载战役数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScenarioPress = (scenario: Scenario) => {
    // 跳转到剧本详情/章节选择页面
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 标题区域 - 克莱因蓝底 */}
        <View style={styles.heroSection}>
          <View style={styles.heroHeader}>
            <View style={styles.heroTitleContainer}>
              <ThemedText variant="caption" color="#C9A96E" style={styles.heroSubtitle}>
                CAMPAIGN
              </ThemedText>
              <ThemedText variant="h1" color="#FFFFFF" style={styles.heroTitle}>
                战役模式
              </ThemedText>
            </View>
          </View>
          <View style={styles.heroDivider} />
          
          {/* 总进度 */}
          {progress && (
            <View style={styles.progressContainer}>
              <ThemedText variant="caption" color="#C9A96E" style={styles.progressLabel}>
                总星数
              </ThemedText>
              <ThemedText variant="h3" color="#FFFFFF" style={styles.progressValue}>
                {progress.totalStars}
              </ThemedText>
            </View>
          )}
        </View>

        {/* 剧本列表 */}
        <View style={styles.scenariosContainer}>
          <ThemedText variant="h3" color={theme.textPrimary} style={styles.sectionTitle}>
            选择剧本
          </ThemedText>
          {scenarios.map((scenario) => {
            const scenarioChapters = scenario.chapters || [];
            const totalChapters = scenarioChapters.length;
            
            return (
              <TouchableOpacity
                key={scenario.id}
                style={styles.scenarioCard}
                onPress={() => handleScenarioPress(scenario)}
                activeOpacity={0.7}
              >
                {/* 剧本年份徽章 */}
                <View style={styles.yearBadge}>
                  <ThemedText variant="caption" color="#FFFFFF" style={styles.yearText}>
                    {scenario.year}
                  </ThemedText>
                </View>

                {/* 剧本内容 */}
                <View style={styles.scenarioContent}>
                  {/* 剧本名称和年代 */}
                  <View style={styles.scenarioHeader}>
                    <ThemedText 
                      variant="h3" 
                      color={theme.textPrimary}
                      style={styles.scenarioName}
                    >
                      {scenario.name}
                    </ThemedText>
                    <View style={styles.eraBadge}>
                      <ThemedText variant="caption" color="#C9A96E">
                        {scenario.era}
                      </ThemedText>
                    </View>
                  </View>

                  {/* 剧本描述 */}
                  <ThemedText 
                    variant="body" 
                    color={theme.textSecondary} 
                    style={styles.scenarioDescription}
                    numberOfLines={2}
                  >
                    {scenario.description}
                  </ThemedText>

                  {/* 历史背景预览 */}
                  <ThemedText 
                    variant="small" 
                    color={theme.textMuted} 
                    style={styles.scenarioBackground}
                    numberOfLines={1}
                  >
                    {scenario.historicalBackground}
                  </ThemedText>

                  {/* 剧本信息 */}
                  <View style={styles.scenarioMeta}>
                    <View style={styles.metaItem}>
                      <FontAwesome6 
                        name="scroll" 
                        size={14} 
                        color={theme.textMuted} 
                      />
                      <ThemedText variant="caption" color={theme.textMuted}>
                        {totalChapters} 章节
                      </ThemedText>
                    </View>
                    {scenario.recommendedFaction && (
                      <View style={styles.metaItem}>
                        <FontAwesome6 
                          name="flag" 
                          size={14} 
                          color="#C9A96E" 
                        />
                        <ThemedText variant="caption" color={theme.textSecondary}>
                          推荐阵营
                        </ThemedText>
                      </View>
                    )}
                  </View>
                </View>

                {/* 右侧箭头 */}
                <FontAwesome6 
                  name="chevron-right" 
                  size={20} 
                  color={theme.textMuted} 
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}
