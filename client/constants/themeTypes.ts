/**
 * 主题配置类型定义
 * 支持从 JSON 配置文件加载主题
 */

/**
 * 主题配置接口
 */
export interface ThemeConfig {
  id: string;
  name: string;
  description?: string;
  colors: ColorTheme;
  typography: TypographyTheme;
  spacing: SpacingTheme;
  borderRadius: BorderRadiusTheme;
  assets?: ThemeAssets;
}

/**
 * 颜色主题
 */
export interface ColorTheme {
  // 文本颜色
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // 品牌色
  primary: string;
  accent: string;

  // 状态色
  success: string;
  error: string;
  warning: string;
  info: string;

  // 背景色
  backgroundRoot: string;
  backgroundDefault: string;
  backgroundTertiary: string;

  // 按钮文字
  buttonPrimaryText: string;
  buttonSecondaryText?: string;

  // Tab 图标
  tabIconSelected: string;
  tabIconUnselected?: string;

  // 边框
  border: string;
  borderLight: string;

  // 阴影
  shadow?: string;
  shadowLight?: string;
}

/**
 * 字体主题
 */
export interface TypographyTheme {
  display: TextStyle;
  displayLarge: TextStyle;
  displayMedium: TextStyle;
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  title: TextStyle;
  body: TextStyle;
  bodyMedium: TextStyle;
  small: TextStyle;
  smallMedium: TextStyle;
  caption: TextStyle;
  captionMedium: TextStyle;
  label: TextStyle;
  labelSmall: TextStyle;
  labelTitle: TextStyle;
  link: TextStyle;
  stat: TextStyle;
  tiny: TextStyle;
  navLabel: TextStyle;
}

/**
 * 文本样式
 */
export interface TextStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: FontWeight;
  letterSpacing?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

/**
 * 字重类型
 */
export type FontWeight =
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | 'normal'
  | 'bold';

/**
 * 间距主题
 */
export interface SpacingTheme {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
  '5xl': number;
  '6xl': number;
}

/**
 * 圆角主题
 */
export interface BorderRadiusTheme {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
  full: number;
}

/**
 * 资源主题（对应 theme-settings.json 中的资源路径）
 */
export interface ThemeAssets {
  // 背景资源
  backgroundImage?: string;

  // Logo 资源
  logoImage?: string;

  // 图标资源
  appIcon?: string;
  taskbarIcon?: string;

  // 字体资源
  customFonts?: {
    regular?: string;
    bold?: string;
    medium?: string;
  };
}

/**
 * 主题模式
 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * 主题设置接口
 */
export interface ThemeSettings {
  mode: ThemeMode;
  customThemeId?: string;
  useSystemTheme: boolean;
  fontSizeScale: number; // 字体缩放比例 (0.5 - 2.0)
}

/**
 * 主题预设接口
 */
export interface ThemePreset {
  id: string;
  name: string;
  preview: {
    primary: string;
    background: string;
  };
}
