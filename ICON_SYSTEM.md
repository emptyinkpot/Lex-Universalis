# 图标系统使用指南

《王国征途》项目使用 **FontAwesome6** 图标库，提供了完整的图标系统组件。

## 📦 已集成的图标

项目已集成 FontAwesome6，有 **2000+ 免费图标** 可直接使用，无需下载！

## 🎨 图标组件

### 1. FactionIcon（阵营图标）

用于显示游戏阵营徽章。

**使用示例**：
```typescript
import { FactionIcon } from '@/components/FactionIcon';

// 基础使用
<FactionIcon faction="ENGLAND" size={48} />

// 不显示背景
<FactionIcon faction="FRANCE" size={32} showBackground={false} />

// 可用阵营
<FactionIcon faction="HRE" size={48} />      // 神圣罗马帝国
<FactionIcon faction="VIKING" size={48} />   // 维京
<FactionIcon faction="BYZANTIUM" size={48} /> // 拜占庭
```

**阵营配置**：
- **英格兰** - 🏴󠁧󠁢󠁥󠁮󠁧�️ 旗帜（深红 #8B0000）
- **法兰西** - 🇫🇷 旗帜（中蓝 #0000CD）
- **神圣罗马** - 👑 皇冠（金色 #FFD700）
- **维京** - ⚓ 龙船（皇家蓝 #4169E1）
- **拜占庭** - ⛪ 教堂（紫色 #800080）

---

### 2. UIIcon（功能图标）

用于显示游戏功能图标（攻击、防御、金币等）。

**使用示例**：
```typescript
import { UIIcon } from '@/components/UIIcon';

// 攻击图标
<UIIcon iconName="attack" size={24} />

// 金币图标
<UIIcon iconName="gold" size={20} />

// 自定义颜色
<UIIcon iconName="health" size={20} color="#FF0000" />
```

**可用图标**：
- `attack` - ⚔️ 攻击（红色 #C8102E）
- `defense` - 🛡️ 防御（蓝色 #002FA7）
- `health` - ❤️ 生命值（红色 #C8102E）
- `gold` - 💰 金币（金色 #C9A96E）
- `influence` - 👊 影响力（蓝色 #002FA7）
- `turn` - ⏳ 回合（灰色 #666666）
- `locked` - 🔒 锁定（灰色 #666666）
- `unlocked` - 🔓 解锁（绿色 #10B981）
- `star` - ⭐ 星级（金色 #FFD700）
- `skull` - 💀 死亡（红色 #EF4444）

---

### 3. CardTypeIcon（卡牌类型图标）

用于显示卡牌类型标识。

**使用示例**：
```typescript
import { CardTypeIcon } from '@/components/CardTypeIcon';

// 单位卡
<CardTypeIcon cardType="UNIT" size={24} />

// 法术卡
<CardTypeIcon cardType="SPELL" size={20} />

// 建筑卡
<CardTypeIcon cardType="BUILDING" size={20} />
```

**可用图标**：
- `UNIT` - 🗡️ 单位卡（深灰 #4A4A4A）
- `SPELL` - 📜 法术卡（紫色 #9B59B6）
- `BUILDING` - 🏰 建筑卡（灰色 #7F8C8D）

---

## 🔧 直接使用 FontAwesome6

如果需要使用其他图标，可以直接使用 FontAwesome6。

**使用示例**：
```typescript
import { FontAwesome6 } from '@expo/vector-icons';

// 基础使用
<FontAwesome6 name="flag" size={24} color="#8B0000" />

// 常见图标
<FontAwesome6 name="swords" size={20} color="#C8102E" />  // 剑
<FontAwesome6 name="shield" size={20} color="#002FA7" />  // 盾
<FontAwesome6 name="coins" size={20} color="#C9A96E" />   // 金币
<FontAwesome6 name="crown" size={24} color="#FFD700" />  // 皇冠
<FontAwesome6 name="skull" size={20} color="#EF4444" />  // 骷髅
```

**常用图标名称**：
- `flag` - 旗帜
- `crown` - 皇冠
- `swords` - 交叉的剑
- `shield-halved` - 分割的盾
- `heart` - 爱心
- `coins` - 金币
- `ship` - 船
- `church` - 教堂
- `fortress` - 城堡
- `castle` - 城堡
- `knight` - 骑士
- `dragon` - 龙
- `scroll` - 卷轴
- `book` - 书本
- `star` - 星星
- `lock` - 锁
- `unlock` - 解锁
- `hourglass` - 沙漏
- `trophy` - 奖杯
- `skull` - 骷髅

---

## 🎯 实际应用示例

### 示例1：战斗界面信息栏

```typescript
import { UIIcon } from '@/components/UIIcon';

// 敌方生命值
<View style={styles.statItem}>
  <UIIcon iconName="health" size={14} />
  <ThemedText variant="caption" color="#FFFFFF">
    {enemyHealth}
  </ThemedText>
</View>

// 玩家金币
<View style={styles.statItem}>
  <UIIcon iconName="gold" size={14} />
  <ThemedText variant="caption" color={theme.textPrimary}>
    {playerGold}
  </ThemedText>
</View>
```

### 示例2：关卡列表中的阵营徽章

```typescript
import { FactionIcon } from '@/components/FactionIcon';

// 显示敌人阵营
<View style={styles.factionBadge}>
  <FactionIcon faction={level.enemyFaction} size={20} />
</View>
```

### 示例3：卡牌类型标识

```typescript
import { CardTypeIcon } from '@/components/CardTypeIcon';

// 卡牌右上角类型标识
<View style={styles.typeBadge}>
  <CardTypeIcon cardType={card.type} size={16} />
</View>
```

---

## 📋 图标配置文件

所有图标配置都在 `/client/constants/icons.ts` 中：

```typescript
// 阵营图标配置
export const FACTION_ICONS = {
  ENGLAND: { name: 'flag', color: '#8B0000' },
  FRANCE: { name: 'flag', color: '#0000CD' },
  HRE: { name: 'crown', color: '#FFD700' },
  VIKING: { name: 'ship', color: '#4169E1' },
  BYZANTIUM: { name: 'church', color: '#800080' },
};

// 功能图标配置
export const UI_ICONS = {
  attack: { name: 'swords', color: '#C8102E' },
  defense: { name: 'shield-halved', color: '#002FA7' },
  health: { name: 'heart', color: '#C8102E' },
  gold: { name: 'coins', color: '#C9A96E' },
  influence: { name: 'hand-fist', color: '#002FA7' },
  // ...
};

// 卡牌类型图标配置
export const CARD_TYPE_ICONS = {
  UNIT: { name: 'user-shield', color: '#4A4A4A' },
  SPELL: { name: 'bolt', color: '#9B59B6' },
  BUILDING: { name: 'building-columns', color: '#7F8C8D' },
};
```

## 🎨 自定义图标

如果需要使用其他图标，可以在 `icons.ts` 中添加配置：

```typescript
// 添加新的UI图标
export const UI_ICONS = {
  // ... 现有图标
  customIcon: {
    name: 'dragon' as const,  // FontAwesome6 图标名称
    color: '#FF5733',        // 自定义颜色
    description: '自定义图标'
  },
} as const;
```

然后使用：
```typescript
<UIIcon iconName="customIcon" size={24} />
```

## 🌐 查找更多图标

访问 FontAwesome 官网查找更多图标：
https://fontawesome.com/search?o=r&m=free

**筛选条件**：
- Style: Solid（推荐）
- License: Free
- 搜索关键词：`medieval`, `knight`, `sword`, `castle`, `crown`

## ✅ 优势

使用 FontAwesome6 的优势：

1. **无需下载** - 2000+ 图标立即可用
2. **免费商用** - CC BY 4.0 许可
3. **统一风格** - 简洁、现代、易识别
4. **可定制** - 支持自定义颜色、大小
5. **高质量** - 矢量图标，任意缩放不失真
6. **维护方便** - 无需管理图片文件

## 🎉 总结

**立即可用**：
- ✅ 使用 `FactionIcon` 显示阵营徽章
- ✅ 使用 `UIIcon` 显示功能图标
- ✅ 使用 `CardTypeIcon` 显示卡牌类型
- ✅ 直接使用 `FontAwesome6` 自由选择图标

**所有图标都已集成，无需下载，直接使用！**
