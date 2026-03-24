import React, { useMemo } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { createStyles } from './styles';

export default function HomeScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();

  const menuItems = [
    {
      title: '战役模式',
      subtitle: '单人 Roguelike 冒险',
      icon: 'scroll',
      iconColor: '#C9A96E',
      route: '/campaign',
    },
    {
      title: '对战模式',
      subtitle: '多人 PvP 竞技',
      icon: 'swords',
      iconColor: '#C8102E',
      route: '/battle-select',
    },
    {
      title: '卡组编辑',
      subtitle: '构建你的卡组',
      icon: 'cards',
      iconColor: '#002FA7',
      route: '/deck-builder',
    },
    {
      title: '阵营选择',
      subtitle: '选择你的国家',
      icon: 'flag',
      iconColor: '#10B981',
      route: '/faction-select',
    },
    {
      title: '主题设置',
      subtitle: '自定义游戏外观',
      icon: 'palette',
      iconColor: '#9333EA',
      route: '/theme-settings',
    },
    {
      title: '规则与设定',
      subtitle: '查看规则与世界观设定',
      icon: 'book-open',
      iconColor: '#F59E0B',
      route: '/lore-library',
    },
  ];

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle="light">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <ThemedText variant="caption" color="#C9A96E" style={styles.heroSubtitle}>
            Lex Universalis
          </ThemedText>
          <ThemedText variant="h1" color="#FFFFFF" style={styles.heroTitle}>
            我即真理
          </ThemedText>
          <View style={styles.heroDivider} />
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => router.push(item.route)}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconContainer}>
                <FontAwesome6
                  name={item.icon as any}
                  size={32}
                  color={item.iconColor}
                />
              </View>
              <View style={styles.menuTextContainer}>
                <ThemedText variant="h3" color={theme.textPrimary}>
                  {item.title}
                </ThemedText>
                <ThemedText variant="small" color={theme.textSecondary} style={styles.menuSubtitle}>
                  {item.subtitle}
                </ThemedText>
              </View>
              <FontAwesome6
                name="chevron-right"
                size={20}
                color={theme.textMuted}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <ThemedText variant="caption" color={theme.textMuted} style={styles.footerText}>
            v1.0.0 | Lex Universalis | 规则与设定已入 UI
          </ThemedText>
        </View>
      </ScrollView>
    </Screen>
  );
}
