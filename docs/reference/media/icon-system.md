# 图标系统使用指南

本项目使用 `FontAwesome6` 作为基础图标库，并在 `client/components/` 下封装了可复用图标组件。

## 已集成组件

### `FactionIcon`
用于显示阵营徽章。

```tsx
import { FactionIcon } from '@/components/FactionIcon';

<FactionIcon faction="ENGLAND" size={48} />
<FactionIcon faction="FRANCE" size={32} showBackground={false} />
<FactionIcon faction="HRE" size={48} />
```

常用阵营：
- `ENGLAND` - 旗帜，深红 `#8B0000`
- `FRANCE` - 旗帜，蓝色 `#0000CD`
- `HRE` - 皇冠，金色 `#FFD700`
- `VIKING` - 船，皇家蓝 `#4169E1`
- `BYZANTIUM` - 教堂，紫色 `#800080`

### `UIIcon`
用于显示功能图标，例如攻击、防御、金币等。

```tsx
import { UIIcon } from '@/components/UIIcon';

<UIIcon iconName="attack" size={24} />
<UIIcon iconName="gold" size={20} />
<UIIcon iconName="health" size={20} color="#FF0000" />
```

常用功能图标：
- `attack` - 攻击
- `defense` - 防御
- `health` - 生命值
- `gold` - 金币
- `influence` - 影响力
- `turn` - 回合
- `locked` - 锁定
- `unlocked` - 解锁
- `star` - 星级
- `skull` - 死亡

### `CardTypeIcon`
用于显示卡牌类型标识。

```tsx
import { CardTypeIcon } from '@/components/CardTypeIcon';

<CardTypeIcon cardType="UNIT" size={24} />
<CardTypeIcon cardType="SPELL" size={20} />
<CardTypeIcon cardType="BUILDING" size={20} />
```

常用卡牌类型：
- `UNIT` - 单位卡
- `SPELL` - 法术卡
- `BUILDING` - 建筑卡

## 直接使用 `FontAwesome6`

如果需要更多自定义图标，可以直接使用 `FontAwesome6`。

```tsx
import { FontAwesome6 } from '@expo/vector-icons';

<FontAwesome6 name="flag" size={24} color="#8B0000" />
<FontAwesome6 name="swords" size={20} color="#C8102E" />
<FontAwesome6 name="shield" size={20} color="#002FA7" />
<FontAwesome6 name="coins" size={20} color="#C9A96E" />
<FontAwesome6 name="crown" size={24} color="#FFD700" />
<FontAwesome6 name="skull" size={20} color="#EF4444" />
```

常用图标名称：
- `flag`
- `crown`
- `swords`
- `shield-halved`
- `heart`
- `coins`
- `ship`
- `church`
- `fortress`
- `castle`
- `knight`
- `dragon`
- `scroll`
- `book`
- `star`
- `lock`
- `unlock`
- `hourglass`
- `trophy`
- `skull`

## 实际用法示例

### 战斗界面信息条

```tsx
import { UIIcon } from '@/components/UIIcon';

<View style={styles.statItem}>
  <UIIcon iconName="health" size={14} />
  <ThemedText variant="caption" color="#FFFFFF">{enemyHealth}</ThemedText>
</View>

<View style={styles.statItem}>
  <UIIcon iconName="gold" size={14} />
  <ThemedText variant="caption" color={theme.textPrimary}>{playerGold}</ThemedText>
</View>
```

### 关卡列表阵营徽章

```tsx
import { FactionIcon } from '@/components/FactionIcon';

<View style={styles.factionBadge}>
  <FactionIcon faction={level.enemyFaction} size={20} />
</View>
```

### 卡牌类型标识

```tsx
import { CardTypeIcon } from '@/components/CardTypeIcon';

<View style={styles.typeBadge}>
  <CardTypeIcon cardType={card.type} size={16} />
</View>
```

## 图标配置文件

图标配置集中在 [`client/constants/icons.ts`](/E:/Lex%20Universalis/client/constants/icons.ts)。

## 总结

- `FactionIcon`：阵营徽章
- `UIIcon`：功能图标
- `CardTypeIcon`：卡牌类型图标
- `FontAwesome6`：通用图标库

所有图标都已集成，可以直接使用。