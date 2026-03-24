import { ThemeConfig, ThemePreset, ThemeSettings } from './themeTypes';

/**
 * 默认主题设置
 */
export const defaultThemeSettings: ThemeSettings = {
  mode: 'light',
  useSystemTheme: true,
  fontSizeScale: 1.0,
};

/**
 * 默认主题：克莱因蓝高定风（亮色）
 */
export const defaultLightTheme: ThemeConfig = {
  id: 'light',
  name: '克莱因蓝高定',
  description: '中世纪奢华风格，克莱因蓝 + 香槟金配色',
  colors: {
    textPrimary: '#1A1A2E',
    textSecondary: '#4A4A5E',
    textMuted: '#9CA3AF',
    primary: '#002FA7', // 克莱因蓝
    accent: '#C9A96E', // 香槟金
    success: '#10B981',
    error: '#C8102E',
    warning: '#F59E0B',
    info: '#3B82F6',
    backgroundRoot: '#F8F6F2', // 米金白背景
    backgroundDefault: '#FFFFFF',
    backgroundTertiary: '#FAF9F6',
    buttonPrimaryText: '#FFFFFF',
    buttonSecondaryText: '#002FA7',
    tabIconSelected: '#002FA7',
    tabIconUnselected: '#9CA3AF',
    border: 'rgba(0,47,167,0.15)',
    borderLight: 'rgba(0,47,167,0.08)',
  },
  typography: {
    display: { fontSize: 112, lineHeight: 112, fontWeight: '200', letterSpacing: -4 },
    displayLarge: { fontSize: 112, lineHeight: 112, fontWeight: '200', letterSpacing: -2 },
    displayMedium: { fontSize: 48, lineHeight: 56, fontWeight: '200' },
    h1: { fontSize: 32, lineHeight: 40, fontWeight: '700' },
    h2: { fontSize: 28, lineHeight: 36, fontWeight: '700' },
    h3: { fontSize: 24, lineHeight: 32, fontWeight: '300' },
    h4: { fontSize: 20, lineHeight: 28, fontWeight: '600' },
    title: { fontSize: 18, lineHeight: 24, fontWeight: '700' },
    body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
    bodyMedium: { fontSize: 16, lineHeight: 24, fontWeight: '500' },
    small: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
    smallMedium: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
    caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
    captionMedium: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
    label: { fontSize: 14, lineHeight: 20, fontWeight: '500', letterSpacing: 2, textTransform: 'uppercase' },
    labelSmall: { fontSize: 12, lineHeight: 16, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase' },
    labelTitle: { fontSize: 14, lineHeight: 20, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' },
    link: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
    stat: { fontSize: 30, lineHeight: 36, fontWeight: '300' },
    tiny: { fontSize: 10, lineHeight: 14, fontWeight: '400' },
    navLabel: { fontSize: 10, lineHeight: 14, fontWeight: '500' },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    '6xl': 64,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    full: 9999,
  },
};

/**
 * 默认主题：克莱因蓝高定风（暗色）
 */
export const defaultDarkTheme: ThemeConfig = {
  id: 'dark',
  name: '暗夜克莱因',
  description: '暗黑奢华风格，保留克莱因蓝与香槟金',
  colors: {
    textPrimary: '#FAFAF9',
    textSecondary: '#A8A29E',
    textMuted: '#6F767E',
    primary: '#002FA7',
    accent: '#C9A96E',
    success: '#34D399',
    error: '#F87171',
    warning: '#FBBF24',
    info: '#60A5FA',
    backgroundRoot: '#0A0A0F', // 纯黑底
    backgroundDefault: '#12121A', // 微亮黑
    backgroundTertiary: '#1F1F22',
    buttonPrimaryText: '#FFFFFF',
    buttonSecondaryText: '#002FA7',
    tabIconSelected: '#002FA7',
    tabIconUnselected: '#6F767E',
    border: 'rgba(0,47,167,0.3)',
    borderLight: 'rgba(0,47,167,0.15)',
  },
  typography: {
    display: { fontSize: 112, lineHeight: 112, fontWeight: '200', letterSpacing: -4 },
    displayLarge: { fontSize: 112, lineHeight: 112, fontWeight: '200', letterSpacing: -2 },
    displayMedium: { fontSize: 48, lineHeight: 56, fontWeight: '200' },
    h1: { fontSize: 32, lineHeight: 40, fontWeight: '700' },
    h2: { fontSize: 28, lineHeight: 36, fontWeight: '700' },
    h3: { fontSize: 24, lineHeight: 32, fontWeight: '300' },
    h4: { fontSize: 20, lineHeight: 28, fontWeight: '600' },
    title: { fontSize: 18, lineHeight: 24, fontWeight: '700' },
    body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
    bodyMedium: { fontSize: 16, lineHeight: 24, fontWeight: '500' },
    small: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
    smallMedium: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
    caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
    captionMedium: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
    label: { fontSize: 14, lineHeight: 20, fontWeight: '500', letterSpacing: 2, textTransform: 'uppercase' },
    labelSmall: { fontSize: 12, lineHeight: 16, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase' },
    labelTitle: { fontSize: 14, lineHeight: 20, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' },
    link: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
    stat: { fontSize: 30, lineHeight: 36, fontWeight: '300' },
    tiny: { fontSize: 10, lineHeight: 14, fontWeight: '400' },
    navLabel: { fontSize: 10, lineHeight: 14, fontWeight: '500' },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    '6xl': 64,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    full: 9999,
  },
};

/**
 * 英格兰王室主题
 */
export const englandTheme: ThemeConfig = {
  id: 'england',
  name: '英格兰王室',
  description: '英格兰风格，深红 + 皇家蓝',
  colors: {
    textPrimary: '#1A1A2E',
    textSecondary: '#4A4A5E',
    textMuted: '#9CA3AF',
    primary: '#0000CD', // 皇家蓝
    accent: '#8B0000', // 深红
    success: '#10B981',
    error: '#DC2626',
    warning: '#F59E0B',
    info: '#3B82F6',
    backgroundRoot: '#FEFEFE',
    backgroundDefault: '#FFFFFF',
    backgroundTertiary: '#F8F9FA',
    buttonPrimaryText: '#FFFFFF',
    buttonSecondaryText: '#0000CD',
    tabIconSelected: '#0000CD',
    tabIconUnselected: '#9CA3AF',
    border: 'rgba(0,0,205,0.15)',
    borderLight: 'rgba(0,0,205,0.08)',
  },
  typography: {
    display: { fontSize: 112, lineHeight: 112, fontWeight: '200', letterSpacing: -4 },
    displayLarge: { fontSize: 112, lineHeight: 112, fontWeight: '200', letterSpacing: -2 },
    displayMedium: { fontSize: 48, lineHeight: 56, fontWeight: '200' },
    h1: { fontSize: 32, lineHeight: 40, fontWeight: '700' },
    h2: { fontSize: 28, lineHeight: 36, fontWeight: '700' },
    h3: { fontSize: 24, lineHeight: 32, fontWeight: '300' },
    h4: { fontSize: 20, lineHeight: 28, fontWeight: '600' },
    title: { fontSize: 18, lineHeight: 24, fontWeight: '700' },
    body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
    bodyMedium: { fontSize: 16, lineHeight: 24, fontWeight: '500' },
    small: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
    smallMedium: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
    caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
    captionMedium: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
    label: { fontSize: 14, lineHeight: 20, fontWeight: '500', letterSpacing: 2, textTransform: 'uppercase' },
    labelSmall: { fontSize: 12, lineHeight: 16, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase' },
    labelTitle: { fontSize: 14, lineHeight: 20, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' },
    link: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
    stat: { fontSize: 30, lineHeight: 36, fontWeight: '300' },
    tiny: { fontSize: 10, lineHeight: 14, fontWeight: '400' },
    navLabel: { fontSize: 10, lineHeight: 14, fontWeight: '500' },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    '6xl': 64,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    full: 9999,
  },
};

/**
 * 法兰西宫廷主题
 */
export const franceTheme: ThemeConfig = {
  id: 'france',
  name: '法兰西宫廷',
  description: '法兰西风格，金粉 + 天蓝',
  colors: {
    textPrimary: '#1A1A2E',
    textSecondary: '#4A4A5E',
    textMuted: '#9CA3AF',
    primary: '#0072BB', // 法国蓝
    accent: '#FFD700', // 金色
    success: '#10B981',
    error: '#DC2626',
    warning: '#F59E0B',
    info: '#3B82F6',
    backgroundRoot: '#FFFBF0',
    backgroundDefault: '#FFFFFF',
    backgroundTertiary: '#FFF9E6',
    buttonPrimaryText: '#FFFFFF',
    buttonSecondaryText: '#0072BB',
    tabIconSelected: '#0072BB',
    tabIconUnselected: '#9CA3AF',
    border: 'rgba(0,114,187,0.15)',
    borderLight: 'rgba(0,114,187,0.08)',
  },
  typography: {
    display: { fontSize: 112, lineHeight: 112, fontWeight: '200', letterSpacing: -4 },
    displayLarge: { fontSize: 112, lineHeight: 112, fontWeight: '200', letterSpacing: -2 },
    displayMedium: { fontSize: 48, lineHeight: 56, fontWeight: '200' },
    h1: { fontSize: 32, lineHeight: 40, fontWeight: '700' },
    h2: { fontSize: 28, lineHeight: 36, fontWeight: '700' },
    h3: { fontSize: 24, lineHeight: 32, fontWeight: '300' },
    h4: { fontSize: 20, lineHeight: 28, fontWeight: '600' },
    title: { fontSize: 18, lineHeight: 24, fontWeight: '700' },
    body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
    bodyMedium: { fontSize: 16, lineHeight: 24, fontWeight: '500' },
    small: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
    smallMedium: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
    caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
    captionMedium: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
    label: { fontSize: 14, lineHeight: 20, fontWeight: '500', letterSpacing: 2, textTransform: 'uppercase' },
    labelSmall: { fontSize: 12, lineHeight: 16, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase' },
    labelTitle: { fontSize: 14, lineHeight: 20, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' },
    link: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
    stat: { fontSize: 30, lineHeight: 36, fontWeight: '300' },
    tiny: { fontSize: 10, lineHeight: 14, fontWeight: '400' },
    navLabel: { fontSize: 10, lineHeight: 14, fontWeight: '500' },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    '6xl': 64,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    full: 9999,
  },
};

/**
 * 神圣罗马帝国主题
 */
export const hreTheme: ThemeConfig = {
  id: 'hre',
  name: '神圣罗马',
  description: '神圣罗马帝国风格，金色 + 帝国黑',
  colors: {
    textPrimary: '#1A1A2E',
    textSecondary: '#4A4A5E',
    textMuted: '#9CA3AF',
    primary: '#FFD700', // 帝国金
    accent: '#000000', // 帝国黑
    success: '#10B981',
    error: '#DC2626',
    warning: '#F59E0B',
    info: '#3B82F6',
    backgroundRoot: '#F5F5DC', // 米色
    backgroundDefault: '#FFFFFF',
    backgroundTertiary: '#FAF8F0',
    buttonPrimaryText: '#000000',
    buttonSecondaryText: '#FFD700',
    tabIconSelected: '#FFD700',
    tabIconUnselected: '#9CA3AF',
    border: 'rgba(255,215,0,0.2)',
    borderLight: 'rgba(255,215,0,0.1)',
  },
  typography: {
    display: { fontSize: 112, lineHeight: 112, fontWeight: '200', letterSpacing: -4 },
    displayLarge: { fontSize: 112, lineHeight: 112, fontWeight: '200', letterSpacing: -2 },
    displayMedium: { fontSize: 48, lineHeight: 56, fontWeight: '200' },
    h1: { fontSize: 32, lineHeight: 40, fontWeight: '700' },
    h2: { fontSize: 28, lineHeight: 36, fontWeight: '700' },
    h3: { fontSize: 24, lineHeight: 32, fontWeight: '300' },
    h4: { fontSize: 20, lineHeight: 28, fontWeight: '600' },
    title: { fontSize: 18, lineHeight: 24, fontWeight: '700' },
    body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
    bodyMedium: { fontSize: 16, lineHeight: 24, fontWeight: '500' },
    small: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
    smallMedium: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
    caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
    captionMedium: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
    label: { fontSize: 14, lineHeight: 20, fontWeight: '500', letterSpacing: 2, textTransform: 'uppercase' },
    labelSmall: { fontSize: 12, lineHeight: 16, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase' },
    labelTitle: { fontSize: 14, lineHeight: 20, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' },
    link: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
    stat: { fontSize: 30, lineHeight: 36, fontWeight: '300' },
    tiny: { fontSize: 10, lineHeight: 14, fontWeight: '400' },
    navLabel: { fontSize: 10, lineHeight: 14, fontWeight: '500' },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    '6xl': 64,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    full: 9999,
  },
};

/**
 * 默认主题集合
 */
export const defaultThemes: ThemeConfig[] = [
  defaultLightTheme,
  defaultDarkTheme,
  englandTheme,
  franceTheme,
  hreTheme,
];

/**
 * 主题预设（用于快速切换）
 */
export const themePresets: ThemePreset[] = [
  {
    id: 'light',
    name: '克莱因蓝高定',
    preview: {
      primary: '#002FA7',
      background: '#F8F6F2',
    },
  },
  {
    id: 'dark',
    name: '暗夜克莱因',
    preview: {
      primary: '#002FA7',
      background: '#0A0A0F',
    },
  },
  {
    id: 'england',
    name: '英格兰王室',
    preview: {
      primary: '#0000CD',
      background: '#FEFEFE',
    },
  },
  {
    id: 'france',
    name: '法兰西宫廷',
    preview: {
      primary: '#0072BB',
      background: '#FFFBF0',
    },
  },
  {
    id: 'hre',
    name: '神圣罗马',
    preview: {
      primary: '#FFD700',
      background: '#F5F5DC',
    },
  },
];

/**
 * 根据ID获取主题
 */
export function getThemeById(id: string): ThemeConfig | undefined {
  return defaultThemes.find(theme => theme.id === id);
}

/**
 * 根据预设ID获取主题
 */
export function getThemeByPresetId(presetId: string): ThemeConfig | undefined {
  return getThemeById(presetId);
}
