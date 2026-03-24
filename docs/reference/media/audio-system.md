# 音效系统使用指南

## 音效文件分类

所有音效文件已按类别整理，并统一使用中文命名。

### 📂 目录结构

```
client/assets/audio/
├── ui/              # UI交互音效
├── economy/         # 经济相关音效
├── diplomatic/      # 外交相关音效
└── voice/           # 语音和事件音效
```

---

## 📋 音效文件清单

### UI 音效 (`ui/`)

| 文件名 | 文件大小 | 适用场景 |
|--------|----------|----------|
| `通用按钮点击.wav` | 20 KB | 普通按钮点击反馈 |
| `确认按钮点击.wav` | 19 KB | 确认/提交按钮点击 |
| `返回按钮点击.wav` | 36 KB | 返回/取消按钮点击 |
| `暂停.wav` | 45 KB | 暂停游戏音效 |

### 经济音效 (`economy/`)

| 文件名 | 文件大小 | 适用场景 |
|--------|----------|----------|
| `获得金币.wav` | 37 KB | 获得金币/资源 |
| `失去金币.wav` | 55 KB | 失去金币/消耗资源 |

### 外交音效 (`diplomatic/`)

| 文件名 | 文件大小 | 适用场景 |
|--------|----------|----------|
| `和平提议.wav` | 214 KB | 收到和平提议 |
| `和平提议低.wav` | 118 KB | 低优先级和平提议 |
| `和平提议接受.wav` | 343 KB | 和平提议被接受 |
| `宣战.wav` | 289 KB | 宣战事件 |

### 语音/事件音效 (`voice/`)

| 文件名 | 文件大小 | 适用场景 |
|--------|----------|----------|
| `开始游戏.wav` | 1.05 MB | 游戏启动/进入游戏 |
| `新教皇当选.wav` | 665 KB | 宗教事件（新教皇） |
| `神罗皇帝竞选.wav` | 250 KB | 神圣罗马帝国皇帝竞选 |
| `继承人获得.wav` | 272 KB | 获得新继承人 |
| `继承人死亡.wav` | 434 KB | 继承人死亡 |
| `稳定性上升.wav` | 214 KB | 国家稳定性提升 |
| `稳定性下降.wav` | 247 KB | 国家稳定性下降 |
| `中华帝国界面.wav` | 351 KB | 进入中华帝国相关界面 |
| `聊天消息接收.wav` | 132 KB | 聊天消息通知 |
| `多人私聊.wav` | 73 KB | 多人游戏私聊 |

---

## 🎵 使用方式

### 基本使用

```typescript
import { Audio } from 'expo-av';

// 1. 加载音效文件
const soundObject = new Audio.Sound();
try {
  await soundObject.loadAsync(
    require('@/assets/audio/ui/通用按钮点击.wav')
  );

  // 2. 播放音效
  await soundObject.playAsync();

  // 3. 播放完成后释放资源
  soundObject.setOnPlaybackStatusUpdate((status) => {
    if (status.isLoaded && status.didJustFinish) {
      soundObject.unloadAsync();
    }
  });
} catch (error) {
  console.error('音效播放失败', error);
}
```

### 使用音效管理器（推荐）

```typescript
import { playSound } from '@/utils/soundManager';

// 播放 UI 音效
await playSound('ui', '通用按钮点击');
await playSound('ui', '确认按钮点击');
await playSound('ui', '返回按钮点击');
await playSound('ui', '暂停');

// 播放经济音效
await playSound('economy', '获得金币');
await playSound('economy', '失去金币');

// 播放外交音效
await playSound('diplomatic', '和平提议');
await playSound('diplomatic', '宣战');

// 播放语音/事件音效
await playSound('voice', '开始游戏');
await playSound('voice', '新教皇当选');
```

---

## 🎯 推荐使用场景

### 按钮交互

```typescript
import { TouchableOpacity } from 'react-native';
import { playSound } from '@/utils/soundManager';

<TouchableOpacity
  onPress={() => {
    playSound('ui', '通用按钮点击');
    // 按钮逻辑
  }}
>
  <Text>点击我</Text>
</TouchableOpacity>
```

### 游戏事件

```typescript
// 获得金币
const onEarnGold = async (amount: number) => {
  setGold(prev => prev + amount);
  await playSound('economy', '获得金币');
};

// 宣战
const onDeclareWar = async (targetFaction: string) => {
  setWarStatus(targetFaction, true);
  await playSound('diplomatic', '宣战');
};

// 游戏开始
const startGame = async () => {
  await playSound('voice', '开始游戏');
  navigate('battle');
};
```

---

## 🔊 音量控制

```typescript
import { Audio } from 'expo-av';

// 设置全局音量（0.0 - 1.0）
await Audio.setAudioModeAsync({
  playsInSilentModeIOS: true,
  staysActiveInBackground: false,
  shouldDuckAndroid: true,
});
```

---

## ⚠️ 注意事项

1. **文件大小**：语音类音效文件较大（100KB - 1MB），建议异步加载
2. **内存管理**：播放完成后及时调用 `unloadAsync()` 释放资源
3. **iOS 配置**：需要在 `app.config.ts` 中配置音频权限
4. **文件命名**：所有文件使用中文命名，导入时使用 require
5. **音量平衡**：不同音效的音量可能不同，建议统一调整

---

## 📝 添加新音效

1. 将音效文件放入对应分类文件夹
2. 更新本文档的音效清单
3. 如需在代码中使用，更新音效管理器的音效列表

---

## 🔗 相关文档

- [expo-av 官方文档](https://docs.expo.io/versions/latest/sdk/av/)
- [音效播放最佳实践](./expo-advanced/audio-record-play.md)
