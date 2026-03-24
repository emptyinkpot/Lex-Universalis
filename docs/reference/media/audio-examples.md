# 音效系统使用示例

## 📚 导入音效管理器

```typescript
import {
  soundManager,
  playSound,
  playUISound,
  playEconomySound,
  playDiplomaticSound,
  playVoiceSound,
  UI_SOUNDS,
  ECONOMY_SOUNDS,
  DIPLOMATIC_SOUNDS,
  VOICE_SOUNDS,
} from '@/utils/soundManager';
```

---

## 🎯 基础使用

### 方式 1：使用便捷函数（推荐）

```typescript
// 播放 UI 音效
await playUISound('通用按钮点击');
await playUISound('确认按钮点击');
await playUISound('返回按钮点击');
await playUISound('暂停');

// 播放经济音效
await playEconomySound('获得金币');
await playEconomySound('失去金币');

// 播放外交音效
await playDiplomaticSound('和平提议');
await playDiplomaticSound('宣战');
await playDiplomaticSound('和平提议接受');

// 播放语音/事件音效
await playVoiceSound('开始游戏');
await playVoiceSound('新教皇当选');
await playVoiceSound('神罗皇帝竞选');
```

### 方式 2：使用完整 API

```typescript
// 播放音效（指定类别和名称）
await soundManager.play('ui', '通用按钮点击');
await soundManager.play('economy', '获得金币');
await soundManager.play('diplomatic', '和平提议');
await soundManager.play('voice', '开始游戏');

// 播放音效（指定音量）
await soundManager.play('ui', '通用按钮点击', 0.5); // 50% 音量
```

### 方式 3：使用常量引用

```typescript
// 使用 UI 音效常量
await playUISound(UI_SOUNDS.BUTTON_CLICK);
await playUISound(UI_SOUNDS.OK_BUTTON_CLICK);
await playUISound(UI_SOUNDS.BACK_BUTTON_CLICK);
await playUISound(UI_SOUNDS.PAUSE);

// 使用经济音效常量
await playEconomySound(ECONOMY_SOUNDS.EARN_GOLD);
await playEconomySound(ECONOMY_SOUNDS.LOSE_GOLD);

// 使用外交音效常量
await playDiplomaticSound(DIPLOMATIC_SOUNDS.PEACE_OFFER);
await playDiplomaticSound(DIPLOMATIC_SOUNDS.DECLARE_WAR);
await playDiplomaticSound(DIPLOMATIC_SOUNDS.PEACE_OFFER_ACCEPTED);

// 使用语音音效常量
await playVoiceSound(VOICE_SOUNDS.START_GAME);
await playVoiceSound(VOICE_SOUNDS.NEW_POPE_SELECTED);
await playVoiceSound(VOICE_SOUNDS.HRE_ELECTION);
```

---

## 🔧 实际应用场景

### 1. 按钮点击音效

```typescript
import { TouchableOpacity } from 'react-native';
import { playUISound } from '@/utils/soundManager';

function MyButton({ title, onPress }) {
  const handlePress = async () => {
    // 播放按钮点击音效
    await playUISound('通用按钮点击');

    // 执行按钮逻辑
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}

// 确认按钮
function ConfirmButton({ title, onPress }) {
  const handlePress = async () => {
    await playUISound('确认按钮点击');
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}

// 返回按钮
function BackButton({ onPress }) {
  const handlePress = async () => {
    await playUISound('返回按钮点击');
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text>返回</Text>
    </TouchableOpacity>
  );
}
```

### 2. 经济系统音效

```typescript
import { playEconomySound } from '@/utils/soundManager';

function EconomySystem() {
  const [gold, setGold] = useState(1000);

  // 获得金币
  const earnGold = async (amount: number) => {
    setGold(prev => prev + amount);
    await playEconomySound('获得金币');
  };

  // 消耗金币
  const spendGold = async (amount: number) => {
    if (gold >= amount) {
      setGold(prev => prev - amount);
      await playEconomySound('失去金币');
    } else {
      console.log('金币不足');
    }
  };

  return (
    <View>
      <Text>金币: {gold}</Text>
      <Button onPress={() => earnGold(100)}>+100 金币</Button>
      <Button onPress={() => spendGold(50)}>-50 金币</Button>
    </View>
  );
}
```

### 3. 外交系统音效

```typescript
import { playDiplomaticSound } from '@/utils/soundManager';

function DiplomaticSystem() {
  // 宣战
  const declareWar = async (targetFaction: string) => {
    setWarStatus(targetFaction, true);
    await playDiplomaticSound('宣战');
  };

  // 提议和平
  const offerPeace = async (targetFaction: string) => {
    const proposal = {
      from: currentFaction,
      to: targetFaction,
      terms: peaceTerms,
    };

    sendPeaceProposal(proposal);
    await playDiplomaticSound('和平提议');
  };

  // 接受和平
  const acceptPeace = async (proposalId: string) => {
    acceptProposal(proposalId);
    await playDiplomaticSound('和平提议接受');
  };

  return (
    <View>
      <Button onPress={() => declareWar('France')}>宣战</Button>
      <Button onPress={() => offerPeace('France')}>提议和平</Button>
    </View>
  );
}
```

### 4. 游戏事件音效

```typescript
import { playVoiceSound } from '@/utils/soundManager';

function GameEvents() {
  // 游戏开始
  const startGame = async () => {
    await playVoiceSound('开始游戏');
    navigate('battle');
  };

  // 宗教事件
  const onPopeElected = async (newPope: string) => {
    setCurrentPope(newPope);
    showNotification(`新教皇当选: ${newPope}`);
    await playVoiceSound('新教皇当选');
  };

  // 神圣罗马帝国皇帝竞选
  const onHREElection = async (winner: string) => {
    setHolyRomanEmperor(winner);
    showNotification(`神罗皇帝竞选结果: ${winner}`);
    await playVoiceSound('神罗皇帝竞选');
  };

  // 继承人事件
  const onHeirBorn = async (heirName: string) => {
    addHeir(heirName);
    showNotification(`获得新继承人: ${heirName}`);
    await playVoiceSound('继承人获得');
  };

  const onHeirDied = async (heirName: string) => {
    removeHeir(heirName);
    showNotification(`继承人死亡: ${heirName}`);
    await playVoiceSound('继承人死亡');
  };

  // 稳定性变化
  const onStabilityChange = async (change: number) => {
    const newStability = stability + change;
    setStability(newStability);

    if (change > 0) {
      await playVoiceSound('稳定性上升');
    } else {
      await playVoiceSound('稳定性下降');
    }
  };

  return (
    <View>
      <Button onPress={startGame}>开始游戏</Button>
      <Button onPress={simulatePopeElection}>模拟教皇选举</Button>
      <Button onPress={simulateHREElection}>模拟神罗竞选</Button>
    </View>
  );
}
```

### 5. 战斗界面音效集成

```typescript
import { playUISound, playEconomySound, playVoiceSound } from '@/utils/soundManager';

function BattleScreen() {
  useEffect(() => {
    // 战斗开始时播放音效
    playVoiceSound('开始游戏');
  }, []);

  // 攻击
  const onAttack = async (target: Unit) => {
    await playUISound('通用按钮点击');
    executeAttack(target);
  };

  // 战利品
  const onLoot = async (goldAmount: number) => {
    addGold(goldAmount);
    await playEconomySound('获得金币');
  };

  // 战斗结束
  const onBattleEnd = async () => {
    if (isVictory) {
      showVictoryScreen();
      // 可以添加胜利音效
    } else {
      showDefeatScreen();
      // 可以添加失败音效
    }
  };

  return (
    <View>
      <Button onPress={onAttack}>攻击</Button>
      <Button onPress={onBattleEnd}>结束战斗</Button>
    </View>
  );
}
```

---

## 🔊 音量控制

```typescript
// 设置全局音量（0.0 - 1.0）
await soundManager.setVolume(0.5); // 50% 音量
await soundManager.setVolume(0.8); // 80% 音量
await soundManager.setVolume(1.0); // 100% 音量

// 获取当前音量
const currentVolume = soundManager.getVolume();
console.log('当前音量:', currentVolume);

// 单次播放时指定音量
await playSound('ui', '通用按钮点击', 0.3); // 30% 音量
```

---

## ⏸️ 停止音效

```typescript
// 停止指定音效
await soundManager.stop('ui', '通用按钮点击');
await soundManager.stop('voice', '开始游戏');

// 停止所有音效
await soundManager.stopAll();
```

---

## 🗑️ 资源管理

```typescript
// 释放指定音效资源
await soundManager.unload('ui', '通用按钮点击');

// 释放所有音效资源（退出游戏时调用）
await soundManager.unloadAll();
```

---

## 📝 应用初始化

在应用的根组件中初始化音效系统：

```typescript
import { useEffect } from 'react';
import { soundManager } from '@/utils/soundManager';

export default function App() {
  useEffect(() => {
    // 初始化音效系统
    soundManager.initialize().catch(error => {
      console.error('音效系统初始化失败', error);
    });

    // 组件卸载时清理资源
    return () => {
      soundManager.unloadAll().catch(error => {
        console.error('音效资源清理失败', error);
      });
    };
  }, []);

  return (
    // 应用内容
  );
}
```

---

## ⚠️ 最佳实践

1. **异步调用**：所有音效播放函数都是异步的，记得使用 `await`

```typescript
// ✅ 正确
const handlePress = async () => {
  await playUISound('通用按钮点击');
  onPress();
};

// ❌ 错误
const handlePress = () => {
  playUISound('通用按钮点击'); // 没有等待
  onPress();
};
```

2. **错误处理**：使用 try-catch 处理播放失败

```typescript
try {
  await playSound('ui', '通用按钮点击');
} catch (error) {
  console.error('音效播放失败', error);
  // 继续执行其他逻辑
}
```

3. **资源管理**：在应用退出或长时间不使用时释放资源

```typescript
// 在应用退出时
useEffect(() => {
  return () => {
    soundManager.unloadAll();
  };
}, []);
```

4. **音量平衡**：根据场景调整音量，避免音量过大或过小

```typescript
// UI 音效：适中音量
await playUISound('通用按钮点击', 0.7);

// 重要事件：较高音量
await playVoiceSound('新教皇当选', 0.9);

// 次要通知：较低音量
await playVoiceSound('聊天消息接收', 0.5);
```

---

## 🎮 游戏场景音效配置建议

| 场景 | 推荐音效 | 音量 |
|------|----------|------|
| 按钮点击 | `通用按钮点击` | 0.7 |
| 确认操作 | `确认按钮点击` | 0.8 |
| 返回操作 | `返回按钮点击` | 0.7 |
| 游戏开始 | `开始游戏` | 0.9 |
| 获得金币 | `获得金币` | 0.8 |
| 失去金币 | `失去金币` | 0.8 |
| 宣战 | `宣战` | 0.9 |
| 和平提议 | `和平提议` | 0.8 |
| 重要事件 | `新教皇当选` / `神罗皇帝竞选` | 0.9 |
| 普通事件 | `稳定性上升` / `稳定性下降` | 0.7 |

---

## 🔗 相关文档

- [音效系统使用指南](../AUDIO_SYSTEM.md)
- [expo-av 官方文档](https://docs.expo.io/versions/latest/sdk/av/)
