import React, { useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { createStyles } from './styles';

type TabKey = 'rules' | 'world';

const RULES = [
  {
    title: '角色牌',
    icon: 'person-chalkboard',
    points: [
      '每名角色的血与蓝总计 15。',
      '血量归零后退场，蓝量用于抽法术和发动角色技能。',
      '法术系别固定，通常是一到两种属性。',
    ],
  },
  {
    title: '法术牌',
    icon: 'wand-magic-sparkles',
    points: [
      '消耗蓝量抽取。',
      '分为风、林、火、山四系。',
      '风偏机制与反制，林偏状态，火偏伤害，山偏防御。',
    ],
  },
  {
    title: '普通牌',
    icon: 'layer-group',
    points: [
      '包含行动、道具、诡计、事件、通用五类。',
      '道具区、诡计区、状态区等都有明确放置规则。',
      '通用卡是简化版法术卡，承担过渡和补位功能。',
    ],
  },
  {
    title: '特殊机制',
    icon: 'shield-halved',
    points: [
      '反制卡可在被选为目标后打断结算。',
      '月相卡会在全局阶段影响所有角色。',
      '效果按声明、施行、结束三个阶段理解更清晰。',
    ],
  },
];

const WORLD = [
  {
    title: '校准钟表',
    subtitle: '1799 年末的时代拐点',
    text: '理性曾织出伟大的蛛网，但现在它承受不了自己的重力而瓦解。新时代就在夜晚抵达。',
  },
  {
    title: '叙事气质',
    subtitle: '历史、神秘、政治并置',
    text: '世界观不是纯历史复刻，而是带有超现实、象征和博弈感的卡牌叙事。',
  },
  {
    title: '阅读方式',
    subtitle: '从卡到世界，再回到卡',
    text: '规则决定卡的交互，设定决定卡的气质。UI 里两者应该并排呈现，而不是散落在文档里。',
  },
];

function SectionCard({
  title,
  icon,
  points,
}: {
  title: string;
  icon: string;
  points: string[];
}) {
  const { theme } = useTheme();
  return (
    <ThemedView level="tertiary" style={{ padding: 16, borderRadius: 24, gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.backgroundTertiary }}>
          <FontAwesome6 name={icon as any} size={16} color={theme.primary} />
        </View>
        <ThemedText variant="h3" color={theme.textPrimary}>
          {title}
        </ThemedText>
      </View>
      <View style={{ gap: 8 }}>
        {points.map((point) => (
          <View key={point} style={{ flexDirection: 'row', gap: 8 }}>
            <ThemedText variant="bodyMedium" color={theme.primary}>
              •
            </ThemedText>
            <ThemedText variant="small" color={theme.textSecondary} style={{ flex: 1, lineHeight: 22 }}>
              {point}
            </ThemedText>
          </View>
        ))}
      </View>
    </ThemedView>
  );
}

export default function LoreLibraryScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const [tab, setTab] = useState<TabKey>('rules');

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle="light">
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
            <FontAwesome6 name="chevron-left" size={14} color={theme.textPrimary} />
            <ThemedText variant="smallMedium" color={theme.textPrimary}>
              返回
            </ThemedText>
          </TouchableOpacity>

          <View style={styles.heroBlock}>
            <ThemedText variant="caption" color="#C9A96E">
              规则与设定
            </ThemedText>
            <ThemedText variant="h1" color="#FFFFFF" style={styles.heroTitle}>
              Lex Universalis
            </ThemedText>
            <ThemedText variant="bodyMedium" color="#E5E7EB" style={styles.heroCopy}>
              把规则、世界观和卡牌体系统一放在一个可浏览的入口里，避免文档散落。
            </ThemedText>
          </View>

          <View style={styles.tabRow}>
            <TouchableOpacity
              onPress={() => setTab('rules')}
              style={[styles.tabChip, tab === 'rules' && styles.tabChipActive]}
              activeOpacity={0.8}
            >
              <FontAwesome6 name="scroll" size={14} color={tab === 'rules' ? '#FFFFFF' : theme.textPrimary} />
              <ThemedText variant="smallMedium" color={tab === 'rules' ? '#FFFFFF' : theme.textPrimary}>
                规则
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTab('world')}
              style={[styles.tabChip, tab === 'world' && styles.tabChipActive]}
              activeOpacity={0.8}
            >
              <FontAwesome6 name="globe" size={14} color={tab === 'world' ? '#FFFFFF' : theme.textPrimary} />
              <ThemedText variant="smallMedium" color={tab === 'world' ? '#FFFFFF' : theme.textPrimary}>
                世界观
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {tab === 'rules' ? (
          <View style={styles.sectionStack}>
            <ThemedView level="default" style={styles.calloutCard}>
              <FontAwesome6 name="book-open" size={18} color={theme.primary} />
              <View style={{ flex: 1, gap: 4 }}>
                <ThemedText variant="bodyMedium" color={theme.textPrimary}>
                  核心规则
                </ThemedText>
                <ThemedText variant="small" color={theme.textSecondary}>
                  这里是对战系统的简版总览，方便在 UI 中快速查阅。
                </ThemedText>
              </View>
            </ThemedView>
            {RULES.map((item) => (
              <SectionCard key={item.title} title={item.title} icon={item.icon} points={item.points} />
            ))}
          </View>
        ) : (
          <View style={styles.sectionStack}>
            <ThemedView level="default" style={styles.calloutCard}>
              <FontAwesome6 name="hourglass-half" size={18} color={theme.primary} />
              <View style={{ flex: 1, gap: 4 }}>
                <ThemedText variant="bodyMedium" color={theme.textPrimary}>
                  世界观设定
                </ThemedText>
                <ThemedText variant="small" color={theme.textSecondary}>
                  这是项目叙事基调和时代锚点的简版视图。
                </ThemedText>
              </View>
            </ThemedView>

            {WORLD.map((item) => (
              <ThemedView key={item.title} level="tertiary" style={styles.worldCard}>
                <View style={{ gap: 6 }}>
                  <ThemedText variant="h3" color={theme.textPrimary}>
                    {item.title}
                  </ThemedText>
                  <ThemedText variant="smallMedium" color={theme.primary}>
                    {item.subtitle}
                  </ThemedText>
                </View>
                <ThemedText variant="small" color={theme.textSecondary} style={styles.worldCopy}>
                  {item.text}
                </ThemedText>
              </ThemedView>
            ))}

            <ThemedView level="tertiary" style={styles.quoteCard}>
              <FontAwesome6 name="quote-left" size={18} color={theme.primary} />
              <ThemedText variant="bodyMedium" color={theme.textPrimary} style={styles.quoteText}>
                现在是 1799 年 12 月 30 日夜晚，新时代就要降临。
              </ThemedText>
            </ThemedView>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
