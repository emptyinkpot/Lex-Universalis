import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
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

  // 涓婚璁剧疆
  const [settings, setSettings] = useState<ThemeSettings>(defaultThemeSettings);
  const [availableThemes, setAvailableThemes] = useState<ThemeConfig[]>([]);
  const [selectedThemeId, setSelectedThemeId] = useState<string>('light');

  // 鍔犺浇涓婚璁剧疆
  const loadSettings = async () => {
    try {
      const loadedSettings = await ThemeConfigManager.loadThemeSettings();
      setSettings(loadedSettings);

      // 加载所有可用主题
      const themes = await ThemeConfigManager.getAllThemes();
      setAvailableThemes(themes);

      // 璁剧疆褰撳墠涓婚
      const currentThemeId = loadedSettings.customThemeId || loadedSettings.mode;
      setSelectedThemeId(currentThemeId);
    } catch (error) {
      console.error('鍔犺浇涓婚璁剧疆澶辫触', error);
    }
  };

  useEffect(() => {
    // 鍖呰涓哄紓姝ュ嚱鏁伴伩鍏?setState 璀﹀憡
    const init = async () => {
      await loadSettings();
    };
    init();
  }, []);

  // 淇濆瓨涓婚璁剧疆
  const saveSettings = async (newSettings: ThemeSettings) => {
    try {
      await ThemeConfigManager.saveThemeSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('淇濆瓨涓婚璁剧疆澶辫触', error);
      Alert.alert('閿欒', '淇濆瓨涓婚璁剧疆澶辫触');
    }
  };

  // 鍒囨崲涓婚妯″紡
  const handleModeChange = async (mode: ThemeMode) => {
    const newSettings = { ...settings, mode };
    await saveSettings(newSettings);
    // TODO: 闆嗘垚鍒颁富棰樼郴缁熶互瀹炴椂鍒囨崲涓婚
    Alert.alert('提示', '主题模式已切换，重启应用后生效');
  };

  // 閫夋嫨涓婚
  const handleThemeSelect = async (themeId: string) => {
    setSelectedThemeId(themeId);

    const newSettings: ThemeSettings = {
      ...settings,
      customThemeId: themeId,
      mode: 'custom' as ThemeMode,
    };

    await saveSettings(newSettings);

    // 触发主题刷新（需要集成到主题系统）
    Alert.alert('成功', `已应用主题 ${themeId}`);
  };

  // 删除自定义主题
  const handleDeleteTheme = async (themeId: string) => {
    Alert.alert(
      '纭鍒犻櫎',
      '纭畾瑕佸垹闄よ繖涓嚜瀹氫箟涓婚鍚楋紵',
      [
        { text: '鍙栨秷', style: 'cancel' },
        {
          text: '鍒犻櫎',
          style: 'destructive',
          onPress: async () => {
            try {
              await ThemeConfigManager.deleteCustomTheme(themeId);
              // 閲嶆柊鍔犺浇涓婚鍒楄〃
              const themes = await ThemeConfigManager.getAllThemes();
              setAvailableThemes(themes);
              Alert.alert('成功', '主题已删除');
            } catch (error) {
              console.error('鍒犻櫎涓婚澶辫触', error);
              Alert.alert('閿欒', '鍒犻櫎涓婚澶辫触');
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
          <ThemedText variant="h2" color={theme.textPrimary}>涓婚璁剧疆</ThemedText>
          <ThemedText variant="small" color={theme.textMuted}>
            鑷畾涔夋父鎴忓瑙傚拰閰嶈壊
          </ThemedText>
        </ThemedView>

        {/* 涓婚妯″紡閫夋嫨 */}
        <ThemedView level="default" style={styles.section}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            涓婚妯″紡
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
                浜壊
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
                鏆楄壊
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
                璺熼殢绯荤粺
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>

        {/* 棰勮涓婚 */}
        <ThemedView level="default" style={styles.section}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            棰勮涓婚
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

        {/* 鑷畾涔変富棰樺垪琛?*/}
        {availableThemes.filter((t) => t.id.startsWith('custom')).length > 0 && (
          <ThemedView level="default" style={styles.section}>
            <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
              鑷畾涔変富棰?            </ThemedText>

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


      </ScrollView>
    </Screen>
  );
}

