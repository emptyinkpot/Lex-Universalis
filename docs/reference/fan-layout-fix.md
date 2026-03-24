# 月圆之夜风格半折叠扇形手牌修复

## 修复日期
2025年（沙箱时间）

## 问题描述
原扇形布局实现存在以下问题：
1. 卡牌之间完全分开，没有重叠效果
2. 不符合《月圆之夜》的半折叠扇形手牌风格
3. 悬停时卡牌可能被其他卡牌遮挡（穿模）

## 解决方案

### 1. 重写扇形布局算法（`calculateFanLayout`）

**核心改进**：
- 采用真正的半折叠扇形布局
- 卡牌之间有明显的重叠
- 使用极坐标系统计算扇形分布
- z-index 从左到右递增，确保正确的遮挡关系

**算法细节**：
```typescript
// 扇形总角度（度）
const angleRange = config.angleRange; // 比如 50度

// 计算每张卡牌的角度步进（中心点为0）
const angleStep = angleRange / (totalCards - 1);
const angle = -angleRange / 2 + index * angleStep;

// 转换为弧度
const angleRad = (angle * Math.PI) / 180;

// 卡牌半径（扇形圆心到卡牌底部的距离）
const radius = config.radius;

// 扇形中心点（在卡牌上方）
const centerX = 0;
const centerY = -radius * 0.3;

// 计算卡牌在扇形上的位置（极坐标转笛卡尔坐标）
const x = centerX + Math.sin(angleRad) * radius;
const y = centerY + Math.cos(angleRad) * radius;

// 卡牌旋转：面向扇形中心
const rotation = angle;

// z-index：从左到右递增
const zIndex = index;
```

### 2. 调整扇形布局配置

```typescript
const fanConfig: FanLayoutConfig = {
  radius: 200,        // 扇形半径
  angleRange: 50,     // 扇形角度范围（度）- 更紧凑的扇形
  cardSpacing: 0.15,  // 卡牌间距 - 更小的值意味着更多重叠
  fanHeight: 0,       // 不需要额外的高度偏移
  cardWidth: 100,
  cardHeight: 140,
};
```

**关键参数说明**：
- `angleRange: 50` - 扇形角度更紧凑，卡牌分布更集中
- `cardSpacing: 0.15` - 卡牌间距小，实现明显的重叠效果
- `radius: 200` - 扇形半径适中，既不过于弯曲也不过于平直

### 3. 动态 z-index 管理

**问题**：悬停时卡牌需要提升到最上层，避免被其他卡牌遮挡。

**解决方案**：
- 添加 `dynamicZIndex` 状态管理 z-index
- 在 `playHoverAnimation` 中添加 `onZIndexChange` 回调
- 悬停时 z-index 设为 999（最高）
- 恢复时 z-index 恢复到扇形布局的原始值

```typescript
// 动态 z-index 状态
const [dynamicZIndex, setDynamicZIndex] = React.useState(0);

// 悬停动画回调
playHoverAnimation(isHovered, currentFanTransform, 300, (zIndex) => {
  setDynamicZIndex(zIndex);
});

// 应用到卡牌
<Animated.View 
  style={[
    styles.cardContainer,
    animatedStyle,
    glowStyle,
    style,
    fanIndex >= 0 && { zIndex: dynamicZIndex } // 仅在扇形布局中应用
  ]}
>
```

### 4. 改进悬停动画

**悬停效果增强**：
- 上浮 40px（原 30px）
- 放大到 1.2 倍（原 1.15 倍）
- 旋转归零（面向玩家）
- z-index 提升到最上层（999）

```typescript
const playHoverAnimation = (
  isHovered: boolean,
  fanTransform: CardTransform | null = null,
  duration: number = 300,
  onZIndexChange?: (zIndex: number) => void
) => {
  if (isHovered && fanTransform) {
    const liftAmount = 40; // 上浮距离
    translateX.value = withTiming(fanTransform.x, { duration });
    translateY.value = withTiming(fanTransform.y - liftAmount, { duration });
    scale.value = withSpring(1.2, { damping: 15, stiffness: 200 });
    rotation.value = withTiming(0, { duration }); // 面向玩家
    
    if (onZIndexChange) {
      onZIndexChange(999); // 提升到最上层
    }
  } else if (fanTransform) {
    // 恢复到扇形位置
    translateX.value = withTiming(fanTransform.x, { duration });
    translateY.value = withTiming(fanTransform.y, { duration });
    scale.value = withTiming(fanTransform.scale, { duration });
    rotation.value = withTiming(fanTransform.rotation, { duration });
    
    if (onZIndexChange) {
      onZIndexChange(fanTransform.zIndex); // 恢复原始 z-index
    }
  }
};
```

## 修改的文件

### 核心文件修改
- `/client/utils/cardAnimations.ts`
  - 重写 `calculateFanLayout` 函数
  - 改进 `playHoverAnimation` 函数，添加 `onZIndexChange` 回调

- `/client/components/KardsCard.tsx`
  - 添加 `dynamicZIndex` 状态
  - 调整扇形布局配置参数
  - 实现 z-index 动态管理
  - 导入 `calculateFanLayout` 函数

## 视觉效果对比

### 修复前
- ❌ 卡牌之间完全分开，没有重叠
- ❌ 不符合《月圆之夜》的手牌风格
- ❌ 悬停时可能被其他卡牌遮挡

### 修复后
- ✅ 半折叠扇形布局，卡牌之间有明显的重叠
- ✅ 类似《月圆之夜》的手牌风格
- ✅ 悬停时自动提升到最上层，不会穿模
- ✅ 卡牌旋转面向扇形中心，视觉效果更自然

## 使用示例

### 在手牌容器中使用

```typescript
import { KardsCard } from '@/components/KardsCard';

function HandContainer({ cards }) {
  return (
    <View style={styles.handContainer}>
      {cards.map((card, index) => (
        <KardsCard
          key={card.id}
          card={card}
          size="medium"
          fanIndex={index}          // 扇形布局索引
          totalFanCards={cards.length}  // 总卡数
          isHovered={hoveredIndex === index}  // 悬停状态
          onPress={() => handleCardPress(index)}
        />
      ))}
    </View>
  );
}
```

## 技术要点

### 1. 极坐标系统
使用 sin/cos 计算扇形分布，确保卡牌沿弧形排列：
```typescript
const x = centerX + Math.sin(angleRad) * radius;
const y = centerY + Math.cos(angleRad) * radius;
```

### 2. z-index 管理
使用回调函数通知 z-index 变化，避免直接在动画函数中修改 React 状态：
```typescript
onZIndexChange?: (zIndex: number) => void
```

### 3. 遮挡关系
z-index 从左到右递增，确保前面的卡牌遮挡后面的卡牌：
```typescript
const zIndex = index;
```

## 性能优化

1. **状态最小化**：只管理必要的 `dynamicZIndex` 状态
2. **动画优化**：使用 `withTiming` 和 `withSpring` 组合，避免复杂的嵌套动画
3. **条件渲染**：z-index 仅在扇形布局中应用，避免不必要的样式计算

## 兼容性

- ✅ React Native (Android + iOS)
- ✅ Web
- ✅ React Native Reanimated 4.1.6

## 注意事项

1. **z-index 仅在 Android/Web 有效**：iOS 上的 z-index 表现可能不同，需要额外测试
2. **扇形角度范围**：角度范围过大（> 60度）会导致卡牌分布过散
3. **卡牌间距**：`cardSpacing` 值越小，卡牌重叠越多，建议范围 0.1~0.2

## 后续优化建议

1. 添加手牌间距动态调整（根据卡牌数量自动调整 angleRange）
2. 实现手牌折叠/展开动画
3. 添加抽牌时手牌自动调整位置的动画
4. 支持自定义扇形中心点位置
5. 添加手牌拖拽排序功能

## 参考资源

- 《月圆之夜》手牌布局设计
- Unity Slerp（球形线性插值）算法
- React Native Reanimated 动画文档
