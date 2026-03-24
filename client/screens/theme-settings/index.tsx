import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemeConfig, ThemeSettings, ThemeMode } from '@/constants/themeTypes';
import { ThemeConfigManager } from '@/utils/themeConfigManager';
import { themePresets, defaultThemeSettings } from '@/constants/defaultThemes';
import { Spacing } from '@/constants/theme';
import { createStyles } from './styles';
import { FontAwesome6 } from '@expo/vector-icons';

export default function ThemeSettingsScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();

  // 主题设置
  const [settings, setSettings] = useState<ThemeSettings>(defaultThemeSettings);
  const [availableThemes, setAvailableThemes] = useState<ThemeConfig[]>([]);
  const [selectedThemeId, setSelectedThemeId] = useState<string>('light');

  // 加载主题设置
  const loadSettings = async () => {
    try {
      const loadedSettings = await ThemeConfigManager.loadThemeSettings();
      setSettings(loadedSettings);

      // 加载所有可用主题
      const themes = await ThemeConfigManager.getAllThemes();
      setAvailableThemes(themes);

      // 设置当前主题
      const currentThemeId = loadedSettings.customThemeId || loadedSettings.mode;
      setSelectedThemeId(currentThemeId);
    } catch (error) {
      console.error('加载主题设置失败', error);
    }
  };

  useEffect(() => {
    // 包装为异步函数避免 setState 警告
    const init = async () => {
      await loadSettings();
    };
    init();
  }, []);

  // 保存主题设置
  const saveSettings = async (newSettings: ThemeSettings) => {
    try {
      await ThemeConfigManager.saveThemeSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('保存主题设置失败', error);
      Alert.alert('错误', '保存主题设置失败');
    }
  };

  // 切换主题模式
  const handleModeChange = async (mode: ThemeMode) => {
    const newSettings = { ...settings, mode };
    await saveSettings(newSettings);
    // TODO: 集成到主题系统以实时切换主题
    Alert.alert('提示', '主题模式已切换，重启应用后生效');
  };

  // 选择主题
  const handleThemeSelect = async (themeId: string) => {
    setSelectedThemeId(themeId);

    const newSettings: ThemeSettings = {
      ...settings,
      customThemeId: themeId,
      mode: 'custom' as ThemeMode,
    };

    await saveSettings(newSettings);

    // 触发主题刷新（需要集成到主题系统）
    Alert.alert('成功', `已应用主题: ${themeId}`);
  };

  // 删除自定义主题
  const handleDeleteTheme = async (themeId: string) => {
    Alert.alert(
      '确认删除',
      '确定要删除这个自定义主题吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              await ThemeConfigManager.deleteCustomTheme(themeId);
              // 重新加载主题列表
              const themes = await ThemeConfigManager.getAllThemes();
              setAvailableThemes(themes);
              Alert.alert('成功', '主题已删除');
            } catch (error) {
              console.error('删除主题失败', error);
              Alert.alert('错误', '删除主题失败');
            }
          },
        },
      ]
    );
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView level="root" style={styles.header}>
          <ThemedText variant="h2" color={theme.textPrimary}>主题设置</ThemedText>
          <ThemedText variant="small" color={theme.textMuted}>
            自定义游戏外观和配色
          </ThemedText>
        </ThemedView>

        {/* 主题模式选择 */}
        <ThemedView level="default" style={styles.section}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            主题模式
          </ThemedText>

          <View style={styles.modeOptions}>
            <TouchableOpacity
              style={[
                styles.modeOption,
                settings.mode === 'light' && styles.modeOptionActive,
                { backgroundColor: settings.mode === 'light' ? theme.primary : theme.backgroundTertiary },
              ]}
              onPress={() => handleModeChange('light')}
            >
              <FontAwesome6
                name="sun"
                size={24}
                color={settings.mode === 'light' ? '#FFFFFF' : theme.textMuted}
              />
              <ThemedText
                variant="body"
                color={settings.mode === 'light' ? '#FFFFFF' : theme.textPrimary}
                style={styles.modeOptionText}
              >
                亮色
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeOption,
                settings.mode === 'dark' && styles.modeOptionActive,
                { backgroundColor: settings.mode === 'dark' ? theme.primary : theme.backgroundTertiary },
              ]}
              onPress={() => handleModeChange('dark')}
            >
              <FontAwesome6
                name="moon"
                size={24}
                color={settings.mode === 'dark' ? '#FFFFFF' : theme.textMuted}
              />
              <ThemedText
                variant="body"
                color={settings.mode === 'dark' ? '#FFFFFF' : theme.textPrimary}
                style={styles.modeOptionText}
              >
                暗色
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeOption,
                settings.mode === 'auto' && styles.modeOptionActive,
                { backgroundColor: settings.mode === 'auto' ? theme.primary : theme.backgroundTertiary },
              ]}
              onPress={() => handleModeChange('auto')}
            >
              <FontAwesome6
                name="circle-half-stroke"
                size={24}
                color={settings.mode === 'auto' ? '#FFFFFF' : theme.textMuted}
              />
              <ThemedText
                variant="body"
                color={settings.mode === 'auto' ? '#FFFFFF' : theme.textPrimary}
                style={styles.modeOptionText}
              >
                跟随系统
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>

        {/* 预设主题 */}
        <ThemedView level="default" style={styles.section}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            预设主题
          </ThemedText>

          <View style={styles.themeList}>
            {themePresets.map((preset) => {
              const isSelected = selectedThemeId === preset.id;
              const themeConfig = availableThemes.find((t) => t.id === preset.id);

              return (
                <TouchableOpacity
                  key={preset.id}
                  style={[
                    styles.themeCard,
                    isSelected && styles.themeCardSelected,
                    { borderColor: isSelected ? theme.primary : theme.borderLight },
                  ]}
                  onPress={() => handleThemeSelect(preset.id)}
                >
                  <View style={styles.themePreview}>
                    <View
                      style={[styles.previewPrimary, { backgroundColor: preset.preview.primary }]}
                    />
                    <View
                      style={[styles.previewBackground, { backgroundColor: preset.preview.background }]}
                    />
                  </View>

                  <View style={styles.themeInfo}>
                    <ThemedText variant="title" color={theme.textPrimary}>
                      {preset.name}
                    </ThemedText>
                    {themeConfig?.description && (
                      <ThemedText variant="small" color={theme.textMuted}>
                        {themeConfig.description}
                      </ThemedText>
                    )}
                  </View>

                  {isSelected && (
                    <View style={styles.selectedIndicator}>
                      <FontAwesome6 name="circle-check" size={24} color={theme.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ThemedView>

        {/* 自定义主题列表 */}
        {availableThemes.filter((t) => t.id.startsWith('custom')).length > 0 && (
          <ThemedView level="default" style={styles.section}>
            <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
              自定义主题
            </ThemedText>

            <View style={styles.themeList}>
              {availableThemes
                .filter((t) => t.id.startsWith('custom'))
                .map((themeConfig) => {
                  const isSelected = selectedThemeId === themeConfig.id;

                  return (
                    <TouchableOpacity
                      key={themeConfig.id}
                      style={[
                        styles.themeCard,
                        isSelected && styles.themeCardSelected,
                        { borderColor: isSelected ? theme.primary : theme.borderLight },
                      ]}
                      onPress={() => handleThemeSelect(themeConfig.id)}
                    >
                      <View style={styles.themePreview}>
                        <View
                          style={[styles.previewPrimary, { backgroundColor: themeConfig.colors.primary }]}
                        />
                        <View
                          style={[styles.previewBackground, { backgroundColor: themeConfig.colors.backgroundRoot }]}
                        />
                      </View>

                      <View style={styles.themeInfo}>
                        <ThemedText variant="title" color={theme.textPrimary}>
                          {themeConfig.name}
                        </ThemedText>
                        {themeConfig.description && (
                          <ThemedText variant="small" color={theme.textMuted}>
                            {themeConfig.description}
                          </ThemedText>
                        )}
                      </View>

                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteTheme(themeConfig.id)}
                      >
                        <FontAwesome6 name="trash" size={20} color={theme.error} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                })}
            </View>
          </ThemedView>
        )}

        {/* 创建自定义主题按钮 */}
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: theme.primary }]}
          onPress={() => {
            // TODO: 导航到主题编辑器
            Alert.alert('提示', '主题编辑器功能开发中');
          }}
        >
          <FontAwesome6 name="plus" size={20} color="#FFFFFF" />
          <ThemedText variant="bodyMedium" color="#FFFFFF" style={styles.createButtonText}>
            创建自定义主题
          </ThemedText>
        </TouchableOpacity>

        {/* 卡牌编辑入口 */}
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: theme.accent, marginTop: Spacing.md }]}
          onPress={() => router.push('/card-editor')}
        >
          <FontAwesome6 name="wand-magic-sparkles" size={20} color="#FFFFFF" />
          <ThemedText variant="bodyMedium" color="#FFFFFF" style={styles.createButtonText}>
            卡牌编辑器
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}
