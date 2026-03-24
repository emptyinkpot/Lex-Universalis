import React, { useMemo } from 'react';
import { View, ScrollView, useWindowDimensions } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { AnimatedTiltSurface } from '@/components/AnimatedTiltSurface';
import { createStyles } from './styles';

type MenuItem = {
  title: string;
  subtitle: string;
  icon: string;
  iconColor: string;
  route: string;
};

export default function HomeScreen() {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const styles = useMemo(() => createStyles(theme, width), [theme, width]);
  const router = useSafeRouter();
  const isDesktop = width >= 1100;

  const menuItems: MenuItem[] = [
    { title: '故事模式', subtitle: '单剧本剧情与战斗', icon: 'scroll', iconColor: '#d6b36a', route: '/campaign' },
    { title: '对战模式', subtitle: '多人 PvP 竞技', icon: 'swords', iconColor: '#c65a49', route: '/battle-select' },
    { title: '卡组编辑', subtitle: '构建你的卡组', icon: 'cards', iconColor: '#d0c3a2', route: '/deck-builder' },
    { title: '阵营选择', subtitle: '选择你的国家', icon: 'flag', iconColor: '#8f6f45', route: '/faction-select' },
    { title: '主题设置', subtitle: '自定义游戏外观', icon: 'palette', iconColor: '#836c56', route: '/theme-settings' },
    { title: '卡牌编辑', subtitle: '编辑卡牌、模板与素材', icon: 'wand-magic-sparkles', iconColor: '#c99e52', route: '/card-editor' },
    { title: '规则与设定', subtitle: '查看规则与世界观', icon: 'book-open', iconColor: '#d77f42', route: '/lore-library' },
  ];

  return (
    <Screen backgroundColor="#0b0907" statusBarStyle="light">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isDesktop}
      >
        <View style={styles.heroSection}>
          <View style={styles.heroGlow} />
          <View style={styles.heroDustLeft} />
          <View style={styles.heroDustRight} />
          <ThemedText variant="caption" color="#d6b36a" style={styles.heroSubtitle}>
            LEX UNIVERSALIS
          </ThemedText>
          <ThemedText variant="h1" color="#f3e7c8" style={styles.heroTitle}>
            我即真理
          </ThemedText>
          <ThemedText variant="small" color="#b9a98d" style={styles.heroDescription}>
            仪式、法则、献祭与审判，在一张张卡牌之间被重新书写。
          </ThemedText>
          <View style={styles.heroDivider} />
          <View style={styles.heroSealRow}>
            <View style={styles.heroSeal}>
              <FontAwesome6 name="eye" size={14} color="#2d160f" />
            </View>
            <ThemedText variant="tiny" color="#8e7b61" style={styles.heroSealText}>
              桌面原型 / 邪典卡牌 / 叙事战斗
            </ThemedText>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <AnimatedTiltSurface
              key={index}
              onPress={() => router.push(item.route)}
              style={styles.menuItemWrap}
              contentStyle={styles.menuItem}
              glowColor="rgba(215,178,109,0.26)"
            >
              <View style={styles.menuEtching} />
              <View style={[styles.menuIconContainer, { borderColor: item.iconColor }]}>
                <FontAwesome6 name={item.icon as any} size={26} color={item.iconColor} />
              </View>
              <View style={styles.menuTextContainer}>
                <ThemedText variant="h3" color="#f1e4c3">
                  {item.title}
                </ThemedText>
                <ThemedText variant="small" color="#a99679" style={styles.menuSubtitle}>
                  {item.subtitle}
                </ThemedText>
              </View>
              <FontAwesome6 name="chevron-right" size={18} color="#8f7a57" />
            </AnimatedTiltSurface>
          ))}
        </View>

        <View style={styles.footer}>
          <ThemedText variant="caption" color="#7d6b53" style={styles.footerText}>
            v1.0.0 | Lex Universalis | occult table prototype
          </ThemedText>
        </View>
      </ScrollView>
    </Screen>
  );
}
