# 主题配置系统使用指南

## 📋 概述

《王国征途》主题配置系统支持从 JSON 配置文件加载主题，并允许玩家自定义和保存主题。

---

## 🎨 核心功能

### 1. 主题预设

内置 5 个预设主题：

| 主题 ID | 名称 | 风格 | 主色 | 背景色 |
|---------|------|------|------|--------|
| `light` | 克莱因蓝高定 | 中世纪奢华 | #002FA7 | #F8F6F2 |
| `dark` | 暗夜克莱因 | 暗黑奢华 | #002FA7 | #0A0A0F |
| `england` | 英格兰王室 | 英格兰风格 | #0000CD | #FEFEFE |
| `france` | 法兰西宫廷 | 法兰西风格 | #0072BB | #FFFBF0 |
| `hre` | 神圣罗马 | 神圣罗马帝国 | #FFD700 | #F5F5DC |

### 2. 主题模式

支持三种主题模式：

- **亮色模式**：强制使用亮色主题
- **暗色模式**：强制使用暗色主题
- **跟随系统**：根据系统设置自动切换

### 3. 自定义主题

- 从 JSON 文件导入主题配置
- 保存自定义主题到本地
- 删除自定义主题
- 主题预览和快速切换

---

## 📁 文件结构

```
client/
├── constants/
│   ├── theme.ts                  # 旧主题系统（向后兼容）
│   ├── themeTypes.ts             # 主题类型定义
│   └── defaultThemes.ts          # 默认主题配置
├── utils/
│   └── themeConfigManager.ts     # 主题配置管理器
├── screens/
│   └── theme-settings/           # 主题设置页面
│       ├── index.tsx
│       └── styles.ts
└── app/
    └── theme-settings.tsx        # 路由文件
```

---

## 🚀 使用方式

### 方式 1：主题设置页面（推荐）

导航到主题设置页面：

```typescript
import { useSafeRouter } from '@/hooks/useSafeRouter';

const router = useSafeRouter();

// 导航到主题设置
router.push('/theme-settings');
```

### 方式 2：编程式控制

使用主题配置管理器：

```typescript
import { ThemeConfigManager } from '@/utils/themeConfigManager';
import { ThemeSettings, ThemeMode } from '@/constants/themeTypes';

// 加载主题设置
const settings = await ThemeConfigManager.loadThemeSettings();

// 保存主题设置
const newSettings: ThemeSettings = {
  mode: 'dark',
  customThemeId: 'england',
  useSystemTheme: false,
  fontSizeScale: 1.0,
};
await ThemeConfigManager.saveThemeSettings(newSettings);

// 获取所有可用主题
const themes = await ThemeConfigManager.getAllThemes();

// 根据 ID 获取主题
const theme = await ThemeConfigManager.getThemeById('england');

// 保存自定义主题
import { defaultLightTheme } from '@/constants/defaultThemes';
await ThemeConfigManager.saveCustomTheme(defaultLightTheme);

// 删除自定义主题
await ThemeConfigManager.deleteCustomTheme('custom_123');
```

### 方式 3：从 JSON 导入主题

```typescript
import { ThemeConfigManager } from '@/utils/themeConfigManager';

// 从 JSON 配置导入主题
const themeConfig = {
  id: 'my_custom_theme',
  name: '我的主题',
  description: '自定义主题描述',
  colors: {
    primary: '#FF0000',
    accent: '#00FF00',
    backgroundRoot: '#FFFFFF',
    // ... 其他颜色
  },
  // ... 其他配置
};

const theme = ThemeConfigManager.importThemeFromJSON(themeConfig);
await ThemeConfigManager.saveCustomTheme(theme);
```

---

## 📝 主题配置格式

### 完整配置示例

```json
{
  "id": "my_theme",
  "name": "我的主题",
  "description": "主题描述",
  "colors": {
    "textPrimary": "#1A1A2E",
    "textSecondary": "#4A4A5E",
    "textMuted": "#9CA3AF",
    "primary": "#002FA7",
    "accent": "#C9A96E",
    "success": "#10B981",
    "error": "#C8102E",
    "warning": "#F59E0B",
    "info": "#3B82F6",
    "backgroundRoot": "#F8F6F2",
    "backgroundDefault": "#FFFFFF",
    "backgroundTertiary": "#FAF9F6",
    "buttonPrimaryText": "#FFFFFF",
    "tabIconSelected": "#002FA7",
    "border": "rgba(0,47,167,0.15)",
    "borderLight": "rgba(0,47,167,0.08)"
  },
  "typography": {
    "h1": {
      "fontSize": 32,
      "lineHeight": 40,
      "fontWeight": "700"
    },
    "body": {
      "fontSize": 16,
      "lineHeight": 24,
      "fontWeight": "400"
    }
  },
  "spacing": {
    "xs": 4,
    "sm": 8,
    "md": 12,
    "lg": 16,
    "xl": 20
  },
  "borderRadius": {
    "xs": 4,
    "sm": 8,
    "md": 12,
    "lg": 16,
    "xl": 20
  }
}
```

---

## 🎯 从 theme-settings.json 转换

### 原始 JSON 格式

```json
{
  "background": {
    "backgroundImage": "app-background.png"
  },
  "logo": {
    "imagePath": "game-logo.png"
  },
  "button": {
    "backgroundImage": "button.png",
    "color": "#ffffff",
    "fontSize": 24,
    "fontPath": "font.ttf"
  },
  "buttonHover": {
    "color": "#999999"
  },
  "appTaskbarIcon": {
    "appIconPath": "icon.ico"
  },
  "appIcon": {
    "appIconPath": "icon.png"
  }
}
```

### 转换后的主题配置

```json
{
  "id": "legacy_theme",
  "name": "Legacy Theme",
  "description": "从 theme-settings.json 转换的主题",
  "colors": {
    "primary": "#002FA7",
    "accent": "#C9A96E",
    "backgroundRoot": "#F8F6F2",
    "buttonPrimaryText": "#ffffff"
  },
  "assets": {
    "backgroundImage": "app-background.png",
    "logoImage": "game-logo.png",
    "appIcon": "icon.png",
    "taskbarIcon": "icon.ico",
    "customFonts": {
      "regular": "font.ttf"
    }
  }
}
```

### 转换代码示例

```typescript
import { ThemeConfigManager } from '@/utils/themeConfigManager';

function convertLegacyTheme(legacyConfig: any) {
  const themeConfig = {
    id: 'legacy_theme',
    name: 'Legacy Theme',
    colors: {
      primary: legacyConfig.button?.color || '#002FA7',
      backgroundRoot: legacyConfig.background?.backgroundImage ? '#F8F6F2' : '#F8F6F2',
      buttonPrimaryText: legacyConfig.button?.color || '#ffffff',
    },
    assets: {
      backgroundImage: legacyConfig.background?.backgroundImage,
      logoImage: legacyConfig.logo?.imagePath,
      appIcon: legacyConfig.appIcon?.appIconPath,
      taskbarIcon: legacyConfig.appTaskbarIcon?.appIconPath,
      customFonts: {
        regular: legacyConfig.button?.fontPath,
      },
    },
  };

  return ThemeConfigManager.importThemeFromJSON(themeConfig);
}
```

---

## 🔧 高级功能

### 1. 导出主题为 JSON

```typescript
import { ThemeConfigManager } from '@/utils/themeConfigManager';
import { getThemeById } from '@/constants/defaultThemes';

const theme = getThemeById('england');
const json = ThemeConfigManager.exportThemeToJSON(theme);
console.log(json);
```

### 2. 验证主题配置

```typescript
import { ThemeConfigManager } from '@/utils/themeConfigManager';

const validation = ThemeConfigManager.validateTheme(partialTheme);

if (!validation.valid) {
  console.error('主题配置错误:', validation.errors);
}
```

### 3. 生成唯一主题 ID

```typescript
import { ThemeConfigManager } from '@/utils/themeConfigManager';

const themeId = ThemeConfigManager.generateThemeId('my_theme');
// 输出: my_theme_1710678900000_1234
```

---

## 📊 本地存储

主题设置和自定义主题存储在 AsyncStorage 中：

| 键名 | 类型 | 说明 |
|------|------|------|
| `@kingdom_quest:theme_settings` | ThemeSettings | 主题设置（模式、字体缩放等） |
| `@kingdom_quest:custom_themes` | ThemeConfig[] | 自定义主题列表 |

---

## ⚠️ 注意事项

1. **主题切换刷新**：切换主题后需要刷新组件才能看到效果（后续可集成到主题系统中）
2. **JSON 格式验证**：导入 JSON 主题时需要确保格式正确
3. **资源路径**：资源路径需要适配 RN 项目的要求（使用 `@/assets/...`）
4. **颜色格式**：颜色值必须使用十六进制格式（如 `#002FA7`）
5. **向后兼容**：旧主题系统（`theme.ts`）仍然可用，新系统与之兼容

---

## 🎨 创建自定义主题建议

### 颜色选择建议

- **主色**：品牌色，通常用于按钮、链接、选中状态
- **辅助色**：强调色，用于高亮和装饰
- **文本色**：确保与背景有足够的对比度
- **背景色**：根据主题风格选择暖色或冷色背景

### 字体大小建议

- **标题**：24-32px
- **正文**：16px
- **说明文字**：12-14px

### 间距建议

- **小间距**：4-8px
- **中等间距**：12-16px
- **大间距**：20-24px

---

## 🔗 相关文档

- [主题类型定义](../client/constants/themeTypes.ts)
- [默认主题配置](../client/constants/defaultThemes.ts)
- [主题配置管理器](../client/utils/themeConfigManager.ts)
- [theme-settings.json 原始文件](./config/theme-settings.json)

---

## 📞 技术支持

如需帮助或反馈问题，请联系开发团队。
