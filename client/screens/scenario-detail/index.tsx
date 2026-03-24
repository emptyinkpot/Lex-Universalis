import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeRouter, useSafeSearchParams } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FactionIcon } from '@/components/FactionIcon';
import { createStyles } from './styles';

// 剧本接口
interface Scenario {
  id: string;
  name: string;
  year: number;
  era: string;
  description: string;
  historicalBackground: string;
}

// 章节接口
interface Chapter {
  id: string;
  name: string;
  description: string;
  storyIntro: string;
  levels: Level[];
  order: number;
}

// 关卡接口
interface Level {
  id: string;
  chapterId: string;
  name: string;
  description: string;
  difficulty: string;
  storyText: string;
  enemyFaction: string;
  rewards: any[];
  victoryCondition: string;
  defeatCondition: string;
  order: number;
}

// 战役进度接口
interface CampaignProgress {
  completedLevels: any[];
}

// 难度配置
const DIFFICULTY_CONFIG = {
  NORMAL: {
    color: '#10B981', // 绿色
    label: '普通',
  },
  HARD: {
    color: '#F59E0B', // 橙色
    label: '困难',
  },
  EXPERT: {
    color: '#EF4444', // 红色
    label: '专家',
  },
};

export default function ScenarioDetailScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const { scenarioId } = useSafeSearchParams<{ scenarioId: string }>();

  const [loading, setLoading] = useState(true);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [progress, setProgress] = useState<CampaignProgress | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [showStoryModal, setShowStoryModal] = useState(false);

  useEffect(() => {
    if (scenarioId) {
      loadData();
    }
  }, [scenarioId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // 获取剧本详情
      const scenarioRes = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/campaign/scenarios/${scenarioId}`
      );
      const scenarioData = await scenarioRes.json();

      if (scenarioData.success) {
        setScenario(scenarioData.data);
      }

      // 获取剧本下的章节
      const chaptersRes = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/campaign/scenarios/${scenarioId}/chapters`
      );
      const chaptersData = await chaptersRes.json();

      if (chaptersData.success) {
        setChapters(chaptersData.data);
      }

      // 获取玩家进度
      const userId = 'user_default';
      const progressRes = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/campaign/progress/${userId}`
      );
      const progressData = await progressRes.json();

      if (progressData.success) {
        setProgress(progressData.data);
      }
    } catch (error) {
      console.error('加载剧本数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const isLevelCompleted = (levelId: string) => {
    return progress?.completedLevels?.some((cl: any) => cl.levelId === levelId) || false;
  };

  const getLevelStars = (levelId: string) => {
    const completedLevel = progress?.completedLevels?.find((cl: any) => cl.levelId === levelId);
    return completedLevel?.stars || 0;
  };

  const isLevelUnlocked = (level: Level, chapterLevels: Level[]) => {
    // 第一关总是解锁
    if (level.order === 1) return true;

    // 检查前一关是否完成
    const prevLevel = chapterLevels.find((l) => l.order === level.order - 1);
    if (prevLevel) {
      return isLevelCompleted(prevLevel.id);
    }

    return false;
  };

  const handleLevelPress = (level: Level, chapterLevels: Level[]) => {
    if (!isLevelUnlocked(level, chapterLevels)) return;

    setSelectedLevel(level);
    setShowStoryModal(true);
  };

  const handleStartBattle = () => {
    if (!selectedLevel) return;

    setShowStoryModal(false);
    // 跳转到对战页面，传递关卡信息
    router.push('/battle', {
      levelId: selectedLevel.id,
      enemyFaction: selectedLevel.enemyFaction,
      enemyDeck: JSON.stringify(selectedLevel.enemyFaction),
    });
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

  if (!scenario) {
    return (
      <Screen backgroundColor={theme.backgroundRoot} statusBarStyle="light">
        <View style={styles.loadingContainer}>
          <ThemedText variant="body" color={theme.textSecondary}>
            剧本不存在
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
        {/* 标题区域 */}
        <View style={styles.headerSection}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <FontAwesome6 name="arrow-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <ThemedText variant="caption" color="#C9A96E" style={styles.headerSubtitle}>
                {scenario.year} - {scenario.era}
              </ThemedText>
              <ThemedText variant="h2" color="#FFFFFF" style={styles.headerTitle}>
                {scenario.name}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* 剧本介绍 */}
        <View style={styles.introSection}>
          <ThemedView level="default" style={styles.introCard}>
            <View style={styles.introHeader}>
              <FontAwesome6 name="scroll" size={20} color="#C9A96E" />
              <ThemedText variant="h3" color={theme.textPrimary}>
                历史背景
              </ThemedText>
            </View>
            <ThemedText variant="body" color={theme.textSecondary} style={styles.introText}>
              {scenario.historicalBackground}
            </ThemedText>
          </ThemedView>
        </View>

        {/* 章节和关卡列表 */}
        <View style={styles.chaptersSection}>
          <ThemedText variant="h3" color={theme.textPrimary} style={styles.sectionTitle}>
            章节列表
          </ThemedText>
          {chapters.map((chapter) => (
            <View key={chapter.id} style={styles.chapterSection}>
              <View style={styles.chapterHeader}>
                <ThemedText variant="h4" color={theme.textPrimary}>
                  {chapter.name}
                </ThemedText>
                <ThemedText variant="caption" color={theme.textMuted}>
                  {chapter.levels.length} 关
                </ThemedText>
              </View>

              {/* 关卡列表 */}
              <View style={styles.levelsList}>
                {chapter.levels.map((level, index) => {
                  const completed = isLevelCompleted(level.id);
                  const unlocked = isLevelUnlocked(level, chapter.levels);
                  const stars = getLevelStars(level.id);
                  const difficultyConfig = DIFFICULTY_CONFIG[level.difficulty as keyof typeof DIFFICULTY_CONFIG];

                  return (
                    <TouchableOpacity
                      key={level.id}
                      style={[
                        styles.levelCard,
                        !unlocked && styles.levelCardLocked,
                        completed && styles.levelCardCompleted,
                      ]}
                      onPress={() => handleLevelPress(level, chapter.levels)}
                      activeOpacity={unlocked ? 0.7 : 1}
                      disabled={!unlocked}
                    >
                      {/* 关卡序号 */}
                      <View style={[
                        styles.levelNumber,
                        !unlocked && styles.levelNumberLocked,
                        completed && styles.levelNumberCompleted,
                      ]}>
                        <ThemedText 
                          variant="h3" 
                          color={completed ? '#FFFFFF' : (unlocked ? theme.textPrimary : theme.textMuted)}
                        >
                          {index + 1}
                        </ThemedText>
                      </View>

                      {/* 关卡内容 */}
                      <View style={styles.levelContent}>
                        <View style={styles.levelHeader}>
                          <ThemedText 
                            variant="h4" 
                            color={unlocked ? theme.textPrimary : theme.textMuted}
                            style={styles.levelName}
                          >
                            {level.name}
                          </ThemedText>
                          {!unlocked && (
                            <FontAwesome6 
                              name="lock" 
                              size={14} 
                              color={theme.textMuted} 
                            />
                          )}
                        </View>

                        <ThemedText 
                          variant="caption" 
                          color={theme.textSecondary} 
                          style={styles.levelDescription}
                          numberOfLines={2}
                        >
                          {level.description}
                        </ThemedText>

                        {/* 难度和星星 */}
                        {unlocked && (
                          <View style={styles.levelMeta}>
                            <View style={styles.difficultyBadge}>
                              <FontAwesome6 
                                name="star" 
                                size={12} 
                                color={difficultyConfig?.color || theme.textMuted} 
                              />
                              <ThemedText 
                                variant="caption" 
                                color={difficultyConfig?.color || theme.textMuted}
                                style={styles.difficultyText}
                              >
                                {difficultyConfig?.label || '普通'}
                              </ThemedText>
                            </View>

                            {/* 敌人阵营 */}
                            <View style={styles.factionBadge}>
                              <FactionIcon faction={level.enemyFaction as any} size={20} />
                            </View>

                            {/* 星星 */}
                            <View style={styles.starsContainer}>
                              {[1, 2, 3].map((starIndex) => (
                                <FontAwesome6
                                  key={starIndex}
                                  name="star"
                                  size={14}
                                  color={starIndex <= stars ? '#FFD700' : theme.border}
                                />
                              ))}
                            </View>
                          </View>
                        )}
                      </View>

                      {/* 锁定遮罩 */}
                      {!unlocked && <View style={styles.lockOverlay} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 剧情弹窗 */}
      <Modal
        visible={showStoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* 弹窗标题 */}
            <View style={styles.modalHeader}>
              <ThemedText variant="h3" color={theme.textPrimary}>
                {selectedLevel?.name}
              </ThemedText>
              <TouchableOpacity onPress={() => setShowStoryModal(false)}>
                <FontAwesome6 name="xmark" size={24} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            {/* 剧情文本 */}
            <ScrollView style={styles.modalBody}>
              <ThemedView level="tertiary" style={styles.storyCard}>
                <View style={styles.storyIconContainer}>
                  <FontAwesome6 name="book-open" size={24} color="#C9A96E" />
                </View>
                <ThemedText variant="body" color={theme.textPrimary} style={styles.storyText}>
                  {selectedLevel?.storyText}
                </ThemedText>
              </ThemedView>

              {/* 战斗条件 */}
              <View style={styles.conditionsContainer}>
                <ThemedView level="tertiary" style={styles.conditionCard}>
                  <FontAwesome6 name="trophy" size={18} color="#10B981" />
                  <View style={styles.conditionTextContainer}>
                    <ThemedText variant="caption" color={theme.textSecondary}>
                      胜利条件
                    </ThemedText>
                    <ThemedText variant="small" color={theme.textPrimary}>
                      {selectedLevel?.victoryCondition}
                    </ThemedText>
                  </View>
                </ThemedView>

                <ThemedView level="tertiary" style={styles.conditionCard}>
                  <FontAwesome6 name="skull" size={18} color="#EF4444" />
                  <View style={styles.conditionTextContainer}>
                    <ThemedText variant="caption" color={theme.textSecondary}>
                      失败条件
                    </ThemedText>
                    <ThemedText variant="small" color={theme.textPrimary}>
                      {selectedLevel?.defeatCondition}
                    </ThemedText>
                  </View>
                </ThemedView>
              </View>

              {/* 奖励 */}
              <View style={styles.rewardsContainer}>
                <ThemedText variant="h4" color={theme.textPrimary} style={styles.rewardsTitle}>
                  战利品
                </ThemedText>
                {selectedLevel?.rewards.map((reward, index) => (
                  <View key={index} style={styles.rewardItem}>
                    <FontAwesome6 
                      name={reward.type === 'gold' ? 'coins' : 'gift'} 
                      size={16} 
                      color="#C9A96E" 
                    />
                    <ThemedText variant="small" color={theme.textSecondary}>
                      {reward.description}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* 底部按钮 */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowStoryModal(false)}
              >
                <ThemedText variant="smallMedium" color={theme.textMuted}>
                  返回
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.startButton]}
                onPress={handleStartBattle}
              >
                <FontAwesome6 name="mask" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                <ThemedText variant="smallMedium" color="#FFFFFF">
                  开始战斗
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
