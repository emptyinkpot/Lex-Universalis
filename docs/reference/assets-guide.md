# 资源导入指南

本指南说明如何向《王国征途》项目导入外部资源，包括音效、图标、图片等。

## 1. 目录结构

```
client/assets/
├── fonts/           # 字体文件
│   └── SpaceMono-Regular.ttf
├── images/          # 图片资源
│   ├── adaptive-icon.png
│   ├── default-avatar.png
│   ├── favicon.png
│   ├── icon.png
│   ├── splash-icon.png
├── sounds/          # 音效文件（新建）
│   ├── card_draw.mp3
│   ├── card_play.mp3
│   ├── attack.mp3
│   ├── victory.mp3
│   └── defeat.mp3
└── icons/           # 自定义图标（新建）
    ├── faction_england.svg
    ├── faction_france.svg
    └── faction_hre.svg
```

## 2. 导入方式

### 2.1 图片资源

**支持的格式**：PNG, JPG, JPEG, GIF, WebP, SVG

**导入方式**：

```typescript
// ✅ 正确：使用 require 引入本地图片
import myImage from '@/assets/images/my-image.png';

<Image source={myImage} style={styles.image} />

// ✅ 正确：直接在 Image 组件中使用 require
<Image 
  source={require('@/assets/images/my-image.png')} 
  style={styles.image} 
/>
```

**注意事项**：
- Metro 打包器需要静态分析依赖，**必须使用 `require`**
- **禁止**使用字符串路径：`source={{ uri: '@/assets/my-image.png' }}`
- 使用前必须确认文件存在且路径正确，否则会导致打包失败

### 2.2 音效资源

**支持的格式**：MP3, WAV, M4A, AAC

**导入方式**：

```typescript
// 使用 expo-av 播放音效
import { Audio } from 'expo-av';

const playSound = async (soundFile: any) => {
  const { sound } = await Audio.Sound.createAsync(
    soundFile,
    { shouldPlay: true }
  );
  await sound.playAsync();
};

// 导入音效文件
import cardDrawSound from '@/assets/sounds/card_draw.mp3';
import attackSound from '@/assets/sounds/attack.mp3';

// 使用
playSound(cardDrawSound);
```

**注意事项**：
- 音效文件不宜过大（建议每个 < 100KB）
- 使用 `expo-av` 管理音效播放
- 记得在组件卸载时释放音效资源

### 2.3 字体文件

**支持的格式**：TTF, OTF, WOFF, WOFF2

**配置方式**：

1. 将字体文件放入 `client/assets/fonts/` 目录
2. 在 `app.config.ts` 中注册字体：

```typescript
import { FontSource } from 'expo-font';

export default {
  expo: {
    // ... 其他配置
    fonts: [
      {
        font: 'MyCustomFont',
        src: require('./assets/fonts/MyCustomFont-Regular.ttf'),
      },
      {
        font: 'MyCustomFont-Bold',
        src: require('./assets/fonts/MyCustomFont-Bold.ttf'),
      },
    ],
  },
};
```

3. 在组件中使用：

```typescript
import { useFonts } from 'expo-font';

export default function MyComponent() {
  const [fontsLoaded] = useFonts({
    'MyCustomFont': require('@/assets/fonts/MyCustomFont-Regular.ttf'),
    'MyCustomFont-Bold': require('@/assets/fonts/MyCustomFont-Bold.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <Text style={{ fontFamily: 'MyCustomFont' }}>
      Hello World
    </Text>
  );
}
```

### 2.4 SVG 图标

**推荐使用 `react-native-svg`**：

```typescript
import Svg, { Path, Circle } from 'react-native-svg';

// 直接嵌入 SVG 代码
const MyIcon = ({ size = 24, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
      stroke={color}
      strokeWidth={2}
      fill="none"
    />
  </Svg>
);

// 或使用 SVG 文件（需要 react-native-svg-transformer）
import MyIconSvg from '@/assets/icons/my-icon.svg';
```

**推荐方案**：
- 优先使用 `@expo/vector-icons` 中的 FontAwesome6 图标（项目已集成）
- 如果需要自定义图标，使用 `react-native-svg` 直接嵌入代码
- 避免使用外部 SVG 文件（配置复杂）

## 3. 实际应用示例

### 3.1 添加卡牌打出音效

```typescript
// client/utils/soundEffects.ts
import { Audio } from 'expo-av';
import cardDrawSound from '@/assets/sounds/card_draw.mp3';
import cardPlaySound from '@/assets/sounds/card_play.mp3';
import attackSound from '@/assets/sounds/attack.mp3';
import victorySound from '@/assets/sounds/victory.mp3';
import defeatSound from '@/assets/sounds/defeat.mp3';

let cardDrawSoundObject: Audio.Sound | null = null;
let cardPlaySoundObject: Audio.Sound | null = null;
let attackSoundObject: Audio.Sound | null = null;
let victorySoundObject: Audio.Sound | null = null;
let defeatSoundObject: Audio.Sound | null = null;

export const loadSounds = async () => {
  try {
    cardDrawSoundObject = (await Audio.Sound.createAsync(cardDrawSound)).sound;
    cardPlaySoundObject = (await Audio.Sound.createAsync(cardPlaySound)).sound;
    attackSoundObject = (await Audio.Sound.createAsync(attackSound)).sound;
    victorySoundObject = (await Audio.Sound.createAsync(victorySound)).sound;
    defeatSoundObject = (await Audio.Sound.createAsync(defeatSound)).sound;
  } catch (error) {
    console.error('Failed to load sounds:', error);
  }
};

export const playCardDraw = async () => {
  if (cardDrawSoundObject) {
    await cardDrawSoundObject.replayAsync();
  }
};

export const playCardPlay = async () => {
  if (cardPlaySoundObject) {
    await cardPlaySoundObject.replayAsync();
  }
};

export const playAttack = async () => {
  if (attackSoundObject) {
    await attackSoundObject.replayAsync();
  }
};

export const playVictory = async () => {
  if (victorySoundObject) {
    await victorySoundObject.replayAsync();
  }
};

export const playDefeat = async () => {
  if (defeatSoundObject) {
    await defeatSoundObject.replayAsync();
  }
};

export const cleanupSounds = async () => {
  const sounds = [
    cardDrawSoundObject,
    cardPlaySoundObject,
    attackSoundObject,
    victorySoundObject,
    defeatSoundObject,
  ];
  
  for (const sound of sounds) {
    if (sound) {
      await sound.unloadAsync();
    }
  }
};
```

### 3.2 在战斗界面使用音效

```typescript
// client/screens/battle/index.tsx
import { useEffect } from 'react';
import { loadSounds, playCardPlay, playAttack, cleanupSounds } from '@/utils/soundEffects';

export default function BattleScreen() {
  useEffect(() => {
    // 初始化音效
    loadSounds();
    
    return () => {
      // 清理音效资源
      cleanupSounds();
    };
  }, []);

  const handlePlayCard = (card: AnyCard) => {
    playCardPlay();
    // ... 播放卡牌逻辑
  };

  const handleAttack = () => {
    playAttack();
    // ... 攻击逻辑
  };

  // ... 组件代码
}
```

### 3.3 添加阵营图标

```typescript
// client/components/FactionIcon.tsx
import { FontAwesome6 } from '@expo/vector-icons';

interface FactionIconProps {
  faction: string;
  size?: number;
  color?: string;
}

export const FactionIcon: React.FC<FactionIconProps> = ({
  faction,
  size = 24,
  color,
}) => {
  const getIconName = () => {
    switch (faction) {
      case 'ENGLAND':
        return 'flag';
      case 'FRANCE':
        return 'flag';
      case 'HRE':
        return 'crown';
      case 'VIKING':
        return 'ship';
      case 'BYZANTIUM':
        return 'church';
      default:
        return 'flag';
    }
  };

  const getIconColor = () => {
    if (color) return color;
    
    switch (faction) {
      case 'ENGLAND':
        return '#8B0000';
      case 'FRANCE':
        return '#0000CD';
      case 'HRE':
        return '#FFD700';
      case 'VIKING':
        return '#4169E1';
      case 'BYZANTIUM':
        return '#800080';
      default:
        return '#666666';
    }
  };

  return (
    <FontAwesome6
      name={getIconName()}
      size={size}
      color={getIconColor()}
    />
  );
};
```

## 4. 最佳实践

1. **图片优化**：
   - 使用 WebP 格式（体积小，质量好）
   - 提供多种分辨率（@2x, @3x）
   - 使用压缩工具（TinyPNG 等）

2. **音效优化**：
   - 控制文件大小（< 100KB）
   - 使用 MP3 格式（兼容性好）
   - 预加载常用音效

3. **字体优化**：
   - 只加载使用的字重（Regular, Bold）
   - 考虑使用系统字体替代
   - 使用 `useFonts` 懒加载

4. **资源管理**：
   - 按类型分类存放
   - 使用有意义的文件名
   - 文档化资源用途

## 5. 推荐资源网站

### 音效
- [Freesound](https://freesound.org/) - 免费音效库
- [Zapsplat](https://www.zapsplat.com/) - 专业音效库
- [Incompetech](https://incompetech.com/) - 免费音乐和音效

### 图标
- [FontAwesome](https://fontawesome.com/) - 项目已集成
- [Heroicons](https://heroicons.com/) - 现代图标集
- [Phosphor Icons](https://phosphoricons.com/) - 精美图标库

### 图片
- [Unsplash](https://unsplash.com/) - 免费高清图片
- [Pexels](https://www.pexels.com/) - 免费照片和视频
- [Pixabay](https://pixabay.com/) - 免费图片和矢量图

## 6. 常见问题

**Q: 为什么图片不显示？**

A: 检查以下几点：
- 文件路径是否正确
- 是否使用了 `require` 而不是字符串
- 文件是否存在于 `assets/` 目录下
- 文件格式是否受支持

**Q: 音效无法播放？**

A: 检查以下几点：
- 是否已请求音频权限（`Audio.requestPermissionsAsync()`）
- 文件路径是否正确
- 文件格式是否受支持
- 是否已加载音效（`Audio.Sound.createAsync()`）

**Q: 自定义字体不生效？**

A: 检查以下几点：
- 是否在 `app.config.ts` 中注册字体
- 字体文件是否在 `assets/fonts/` 目录下
- 是否使用 `useFonts` 加载字体
- 字体名称是否与注册时一致

## 7. 总结

✅ **可以导入的资源**：
- 图片：PNG, JPG, JPEG, GIF, WebP, SVG
- 音效：MP3, WAV, M4A, AAC
- 字体：TTF, OTF, WOFF, WOFF2
- 图标：FontAwesome6（推荐），SVG

✅ **导入方式**：
- 图片/字体：使用 `require('@/assets/xxx')`
- 音效：使用 `expo-av` 播放
- 图标：使用 `@expo/vector-icons` 或 `react-native-svg`

✅ **注意事项**：
- Metro 打包器需要静态依赖分析，必须使用 `require`
- 资源文件不宜过大
- 记得在组件卸载时释放资源
