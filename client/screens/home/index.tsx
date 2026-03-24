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
      title: '鎴樺焦妯″紡',
      subtitle: '鍗曚汉Roguelike鍐掗櫓',
      icon: 'scroll',
      iconColor: '#C9A96E',
      route: '/campaign',
    },
    {
      title: '瀵规垬妯″紡',
      subtitle: '澶氫汉PvP绔炴妧',
      icon: 'swords',
      iconColor: '#C8102E',
      route: '/battle-select',
    },
    {
      title: '鍗＄粍缂栬緫',
      subtitle: '鏋勫缓浣犵殑鍗＄粍',
      icon: 'cards',
      iconColor: '#002FA7',
      route: '/deck-builder',
    },
    {
      title: '闃佃惀閫夋嫨',
      subtitle: '閫夋嫨浣犵殑鍥藉',
      icon: 'flag',
      iconColor: '#10B981',
      route: '/faction-select',
    },
    {
      title: '涓婚璁剧疆',
      subtitle: '自定义游戏外观',
      icon: 'palette',
      iconColor: '#9333EA',
      route: '/theme-settings',
    },
  ];

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle="light">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 鏍囬鍖哄煙 - 鍏嬭幈鍥犺摑搴?*/}
        <View style={styles.heroSection}>
          <ThemedText variant="caption" color="#C9A96E" style={styles.heroSubtitle}>
            我即真理 Lex Universalis
          </ThemedText>
          <ThemedText variant="h1" color="#FFFFFF" style={styles.heroTitle}>
            我即真理 Lex Universalis
          </ThemedText>
          <View style={styles.heroDivider} />
        </View>

        {/* 鑿滃崟椤?*/}
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

        {/* 搴曢儴淇℃伅 */}
        <View style={styles.footer}>
          <ThemedText variant="caption" color={theme.textMuted} style={styles.footerText}>
            v1.0.0 | 涓笘绾瓥鐣ュ崱鐗屽鎴?          </ThemedText>
        </View>
      </ScrollView>
    </Screen>
  );
}

