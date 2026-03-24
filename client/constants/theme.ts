export const Colors = {
  light: {
    textPrimary: "#1A1A2E", // 深蓝黑
    textSecondary: "#4A4A5E",
    textMuted: "#9CA3AF",
    primary: "#002FA7", // 克莱因蓝 - 品牌主色
    accent: "#C9A96E", // 香槟金 - 辅助色，奢华感
    success: "#10B981", // Emerald-500
    error: "#C8102E", // 编辑红，符合中世纪风格
    backgroundRoot: "#F8F6F2", // 米金白背景
    backgroundDefault: "#FFFFFF", // 纯白卡片
    backgroundTertiary: "#FAF9F6", // 更浅的背景色，用于去线留白
    buttonPrimaryText: "#FFFFFF", // 蓝底按钮文字
    tabIconSelected: "#002FA7",
    border: "rgba(0,47,167,0.15)", // 带克莱因蓝色调的边框
    borderLight: "rgba(0,47,167,0.08)",
  },
  dark: {
    textPrimary: "#FAFAF9",
    textSecondary: "#A8A29E",
    textMuted: "#6F767E",
    primary: "#002FA7", // 保持克莱因蓝
    accent: "#C9A96E", // 保持香槟金
    success: "#34D399",
    error: "#F87171",
    backgroundRoot: "#0A0A0F", // 纯黑底
    backgroundDefault: "#12121A", // 微亮黑
    backgroundTertiary: "#1F1F22", // 暗色模式去线留白背景
    buttonPrimaryText: "#FFFFFF",
    tabIconSelected: "#002FA7",
    border: "rgba(0,47,167,0.3)",
    borderLight: "rgba(0,47,167,0.15)",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 28,
  "4xl": 32,
  full: 9999,
};

export const Typography = {
  display: {
    fontSize: 112,
    lineHeight: 112,
    fontWeight: "200" as const,
    letterSpacing: -4,
  },
  displayLarge: {
    fontSize: 112,
    lineHeight: 112,
    fontWeight: "200" as const,
    letterSpacing: -2,
  },
  displayMedium: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: "200" as const,
  },
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "300" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  bodyMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  smallMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500" as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
  },
  captionMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500" as const,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500" as const,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
  },
  labelSmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500" as const,
    letterSpacing: 1,
    textTransform: "uppercase" as const,
  },
  labelTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700" as const,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  stat: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "300" as const,
  },
  tiny: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "400" as const,
  },
  navLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "500" as const,
  },
};

export type Theme = typeof Colors.light;
