/**
 * 塔罗牌示例页面
 * 展示塔罗牌卡片组件的使用方法
 */

import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TarotCard } from '@/components/TarotCard';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export default function TarotCardExampleScreen() {
  const { theme } = useTheme();

  // 愚人插图（简化版）
  const foolIllustration = (
    <View style={localStyles.illustration}>
      <View style={localStyles.figure}>
        <View style={localStyles.head} />
        <View style={localStyles.body} />
        <View style={localStyles.legs} />
      </View>
      <View style={localStyles.wolf} />
    </View>
  );

  // 魔术师插图
  const magicianIllustration = (
    <View style={localStyles.illustration}>
      <View style={localStyles.figure}>
        <View style={localStyles.head} />
        <View style={[localStyles.body, { backgroundColor: '#4A6FA5' }]} />
      </View>
      <View style={localStyles.table} />
    </View>
  );

  // 女祭司插图
  const priestessIllustration = (
    <View style={localStyles.illustration}>
      <View style={localStyles.figure}>
        <View style={[localStyles.head, { backgroundColor: '#E84A4A' }]} />
        <View style={[localStyles.body, { backgroundColor: '#8B7355' }]} />
      </View>
      <View style={localStyles.pillars} />
    </View>
  );

  return (
    <Screen backgroundColor={theme.backgroundRoot}>
      <ScrollView contentContainerStyle={localStyles.scrollContent}>
        {/* 标题 */}
        <View style={localStyles.header}>
          <ThemedText variant="h2" color={theme.textPrimary}>
            塔罗牌卡片组件
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary}>
            基于 &quot;The Fool&quot; 塔罗牌设计的可复用卡片模板
          </ThemedText>
        </View>

        {/* 基础示例 */}
        <ThemedView level="default" style={localStyles.section}>
          <ThemedText variant="h3" color={theme.textPrimary} style={localStyles.sectionTitle}>
            基础示例
          </ThemedText>
          <View style={localStyles.cardRow}>
            <TarotCard
              number="0"
              title="THE FOOL"
              illustration={foolIllustration}
              showSun={true}
            />
          </View>
        </ThemedView>

        {/* 不同尺寸 */}
        <ThemedView level="default" style={localStyles.section}>
          <ThemedText variant="h3" color={theme.textPrimary} style={localStyles.sectionTitle}>
            不同尺寸
          </ThemedText>
          <View style={localStyles.cardRow}>
            <TarotCard
              number="I"
              title="THE MAGICIAN"
              illustration={magicianIllustration}
              style={{ width: 200, height: 360 }}
              showSun={true}
            />
            <TarotCard
              number="II"
              title="THE PRIESTESS"
              illustration={priestessIllustration}
              showSun={true}
            />
          </View>
        </ThemedView>

        {/* 逆位示例 */}
        <ThemedView level="default" style={localStyles.section}>
          <ThemedText variant="h3" color={theme.textPrimary} style={localStyles.sectionTitle}>
            逆位（Reversed）
          </ThemedText>
          <View style={localStyles.cardRow}>
            <TarotCard
              number="0"
              title="THE FOOL"
              illustration={foolIllustration}
              variant="reversed"
              showSun={true}
            />
          </View>
        </ThemedView>

        {/* 卡片网格 */}
        <ThemedView level="default" style={localStyles.section}>
          <ThemedText variant="h3" color={theme.textPrimary} style={localStyles.sectionTitle}>
            卡片网格
          </ThemedText>
          <View style={localStyles.cardGrid}>
            {[...Array(6)].map((_, index) => (
              <TarotCard
                key={index}
                number={index === 0 ? '0' : romanNumerals[index]}
                title={['THE FOOL', 'THE MAGICIAN', 'THE PRIESTESS', 'THE EMPRESS', 'THE EMPEROR', 'THE HIEROPHANT'][index]}
                illustration={index % 2 === 0 ? foolIllustration : magicianIllustration}
                showSun={true}
              />
            ))}
          </View>
        </ThemedView>

        {/* 设计说明 */}
        <ThemedView level="default" style={localStyles.section}>
          <ThemedText variant="h3" color={theme.textPrimary} style={localStyles.sectionTitle}>
            设计说明
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={localStyles.description}>
            基于塔罗牌 &quot;The Fool&quot; 的视觉设计分析，提取了以下可模块化成分：
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={localStyles.description}>
            • 卡牌框架：外框、顶部数字位、底部标题位
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={localStyles.description}>
            • 配色方案：大地色系 + 撞色点缀
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={localStyles.description}>
            • 排版样式：简洁克制，居中对齐
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={localStyles.description}>
            • 装饰元素：太阳、动态线条、扁平插画风格
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </Screen>
  );
}

// 罗马数字
const romanNumerals = ['I', 'II', 'III', 'IV', 'V'];

const localStyles = StyleSheet.create({
  scrollContent: {
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing['2xl'],
  },
  section: {
    marginBottom: Spacing['2xl'],
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
  },
  description: {
    marginBottom: Spacing.sm,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  illustration: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  figure: {
    width: 60,
    height: 120,
    position: 'relative',
  },
  head: {
    width: 20,
    height: 20,
    backgroundColor: '#E84A4A',
    borderRadius: 10,
    position: 'absolute',
    top: 0,
    left: 20,
  },
  body: {
    width: 40,
    height: 60,
    backgroundColor: '#D4A574',
    borderRadius: 8,
    position: 'absolute',
    top: 20,
    left: 10,
  },
  legs: {
    width: 40,
    height: 40,
    backgroundColor: '#8B7355',
    borderRadius: 6,
    position: 'absolute',
    top: 80,
    left: 10,
  },
  wolf: {
    width: 30,
    height: 20,
    backgroundColor: '#F5F5DC',
    borderRadius: 6,
    position: 'absolute',
    bottom: 20,
    right: 40,
  },
  table: {
    width: 80,
    height: 30,
    backgroundColor: '#8B7355',
    borderRadius: 4,
    position: 'absolute',
    bottom: 40,
    left: 20,
  },
  pillars: {
    flexDirection: 'row',
    gap: 40,
    position: 'absolute',
    bottom: 40,
  },
});
