import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeConfig, ThemeSettings, ThemeMode } from '../constants/themeTypes';
import { defaultThemes, getThemeById, defaultLightTheme } from '../constants/defaultThemes';

const THEME_SETTINGS_KEY = '@kingdom_quest:theme_settings';
const CUSTOM_THEMES_KEY = '@kingdom_quest:custom_themes';

/**
 * 默认主题设置
 */
export const defaultThemeSettings: ThemeSettings = {
  mode: 'light',
  useSystemTheme: true,
  fontSizeScale: 1.0,
};

/**
 * 主题配置管理器
 */
export class ThemeConfigManager {
  /**
   * 加载主题设置
   */
  static async loadThemeSettings(): Promise<ThemeSettings> {
    try {
      const settingsJson = await AsyncStorage.getItem(THEME_SETTINGS_KEY);
      if (settingsJson) {
        const settings = JSON.parse(settingsJson) as ThemeSettings;
        return { ...defaultThemeSettings, ...settings };
      }
    } catch (error) {
      console.error('加载主题设置失败', error);
    }
    return defaultThemeSettings;
  }

  /**
   * 保存主题设置
   */
  static async saveThemeSettings(settings: ThemeSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(THEME_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('保存主题设置失败', error);
      throw error;
    }
  }

  /**
   * 加载自定义主题
   */
  static async loadCustomThemes(): Promise<ThemeConfig[]> {
    try {
      const themesJson = await AsyncStorage.getItem(CUSTOM_THEMES_KEY);
      if (themesJson) {
        return JSON.parse(themesJson) as ThemeConfig[];
      }
    } catch (error) {
      console.error('加载自定义主题失败', error);
    }
    return [];
  }

  /**
   * 保存自定义主题
   */
  static async saveCustomTheme(theme: ThemeConfig): Promise<void> {
    try {
      const customThemes = await this.loadCustomThemes();
      const existingIndex = customThemes.findIndex(t => t.id === theme.id);

      if (existingIndex >= 0) {
        // 更新现有主题
        customThemes[existingIndex] = theme;
      } else {
        // 添加新主题
        customThemes.push(theme);
      }

      await AsyncStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(customThemes));
    } catch (error) {
      console.error('保存自定义主题失败', error);
      throw error;
    }
  }

  /**
   * 删除自定义主题
   */
  static async deleteCustomTheme(themeId: string): Promise<void> {
    try {
      const customThemes = await this.loadCustomThemes();
      const filtered = customThemes.filter(t => t.id !== themeId);
      await AsyncStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('删除自定义主题失败', error);
      throw error;
    }
  }

  /**
   * 获取所有可用主题（默认 + 自定义）
   */
  static async getAllThemes(): Promise<ThemeConfig[]> {
    const customThemes = await this.loadCustomThemes();
    return [...defaultThemes, ...customThemes];
  }

  /**
   * 根据ID获取主题（默认或自定义）
   */
  static async getThemeById(id: string): Promise<ThemeConfig | undefined> {
    // 先从默认主题查找
    let theme = getThemeById(id);

    // 如果没找到，从自定义主题查找
    if (!theme) {
      const customThemes = await this.loadCustomThemes();
      theme = customThemes.find(t => t.id === id);
    }

    return theme;
  }

  /**
   * 从 JSON 配置导入主题
   */
  static importThemeFromJSON(config: any): ThemeConfig {
    // 验证必需字段
    if (!config.id || !config.name) {
      throw new Error('主题配置必须包含 id 和 name 字段');
    }

    // 构建主题配置
    const theme: ThemeConfig = {
      id: config.id,
      name: config.name,
      description: config.description,
      colors: {
        textPrimary: config.colors?.textPrimary || '#1A1A2E',
        textSecondary: config.colors?.textSecondary || '#4A4A5E',
        textMuted: config.colors?.textMuted || '#9CA3AF',
        primary: config.colors?.primary || '#002FA7',
        accent: config.colors?.accent || '#C9A96E',
        success: config.colors?.success || '#10B981',
        error: config.colors?.error || '#DC2626',
        warning: config.colors?.warning || '#F59E0B',
        info: config.colors?.info || '#3B82F6',
        backgroundRoot: config.colors?.backgroundRoot || '#F8F6F2',
        backgroundDefault: config.colors?.backgroundDefault || '#FFFFFF',
        backgroundTertiary: config.colors?.backgroundTertiary || '#FAF9F6',
        buttonPrimaryText: config.colors?.buttonPrimaryText || '#FFFFFF',
        buttonSecondaryText: config.colors?.buttonSecondaryText,
        tabIconSelected: config.colors?.tabIconSelected || '#002FA7',
        tabIconUnselected: config.colors?.tabIconUnselected || '#9CA3AF',
        border: config.colors?.border || 'rgba(0,47,167,0.15)',
        borderLight: config.colors?.borderLight || 'rgba(0,47,167,0.08)',
      },
      typography: config.typography || defaultLightTheme.typography,
      spacing: config.spacing || defaultLightTheme.spacing,
      borderRadius: config.borderRadius || defaultLightTheme.borderRadius,
      assets: config.assets,
    };

    return theme;
  }

  /**
   * 导出主题为 JSON
   */
  static exportThemeToJSON(theme: ThemeConfig): string {
    return JSON.stringify(theme, null, 2);
  }

  /**
   * 生成唯一主题 ID
   */
  static generateThemeId(prefix: string = 'custom'): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * 验证主题配置
   */
  static validateTheme(theme: Partial<ThemeConfig>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!theme.id) {
      errors.push('缺少主题 ID');
    }

    if (!theme.name) {
      errors.push('缺少主题名称');
    }

    if (!theme.colors) {
      errors.push('缺少颜色配置');
    } else {
      const requiredColors = [
        'textPrimary',
        'textSecondary',
        'textMuted',
        'primary',
        'accent',
        'success',
        'error',
        'backgroundRoot',
        'backgroundDefault',
        'backgroundTertiary',
      ];

      requiredColors.forEach(colorKey => {
        if (!theme.colors![colorKey as keyof typeof theme.colors]) {
          errors.push(`缺少必需颜色: ${colorKey}`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
