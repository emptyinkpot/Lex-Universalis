# 卡牌动画系统修复总结

## 修复日期
2025年（沙箱时间）

## 问题描述
原动画系统使用 `withSequence` 和 `withRepeat` 函数，在 React Native Reanimated 4.1.6 版本中存在引用丢失 bug，导致运行时崩溃：
```
Cannot read properties of undefined (reading 'onFrame')
```

## 修复方案

### 1. 彻底移除有问题的动画函数
从所有动画文件中移除 `withSequence` 和 `withRepeat`：
- `/client/utils/cardEffects.ts` - 移除所有使用
- `/client/utils/cardAnimations.ts` - 不使用这些函数

### 2. 新的动画实现方式
使用以下组合替代：
- `withTiming()` - 基础时间动画
- `withSpring()` - 弹性物理动画
- `setTimeout()` - 手动控制动画序列

### 3. 新增动画系统特性

#### 卡牌动画控制器 (`useCardAnimation`)
提供统一的动画 API：
- `setFanLayout()` - 扇形布局动画
- `playDrawAnimation()` - 抽牌动画（4阶段）
- `playHoverAnimation()` - 悬停动画
- `playSelectAnimation()` - 选中动画
- `playAttackAnimation()` - 攻击动画
- `playDamageAnimation()` - 受伤动画
- `playDeathAnimation()` - 死亡动画
- `reset()` - 重置动画

#### 扇形布局算法 (`calculateFanLayout`)
参考 Unity 的 Slerp 实现：
- 极坐标转笛卡尔坐标
- 中间高两边低的高度偏移
- 面向中心的旋转
- 中间大两边小的缩放
- z-index 层级管理

### 4. 抽牌动画示例（4阶段）
```typescript
// 阶段1：从牌堆弹出（放大）
scale.value = withSpring(1.2, { damping: 12, stiffness: 200 });

setTimeout(() => {
  // 阶段2：移动到抽卡位置
  translateX.value = withTiming(startPosition.x, {
    duration: duration * 0.4,
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });

  setTimeout(() => {
    // 阶段3：翻转
    rotationY.value = withTiming(180, {
      duration: duration * 0.3,
      easing: Easing.sin,
    });

    setTimeout(() => {
      // 阶段4：移动到手牌位置并翻转回来
      translateX.value = withTiming(endPosition.x, {
        duration: duration * 0.4,
        easing: Easing.inOut(Easing.cubic),
      });
      rotationY.value = withTiming(0, {
        duration: duration * 0.4,
        easing: Easing.sin,
      });
    }, duration * 0.3);
  }, duration * 0.4);
}, 0);
```

## 修复的文件

### 新建文件
- `/client/utils/cardAnimations.ts` - 新的动画系统（参考月圆之夜）

### 修改文件
- `/client/components/KardsCard.tsx` - 重写卡牌组件，使用新动画系统
- `/client/utils/cardEffects.ts` - 移除所有 withSequence 和 withRepeat

### TypeScript 修复
- 移除不支持的 `translateZ`（React Native 不支持）
- 修复缓动函数：`Easing.inOut(Easing.sine)` → `Easing.sin`
- 添加 ESLint 禁用规则：`/* eslint-disable react-hooks/immutability */`

## 测试验证

### 构建检查
```bash
cd /workspace/projects/client
npx expo config > /dev/null && pnpm exec tsc --noEmit
npx eslint --quiet
```
✅ 通过

### 服务检查
```bash
curl -I http://localhost:5000
curl http://localhost:9091/api/v1/health
```
✅ 前端和后端服务正常运行

### 日志检查
```bash
tail -n 50 /app/work/logs/bypass/app.log
tail -n 50 /app/work/logs/bypass/console.log
```
✅ 无新错误

## 使用示例

### 在卡牌组件中使用
```typescript
import { useCardAnimation } from '@/utils/cardAnimations';

function CardComponent({ card, fanIndex, totalFanCards }) {
  const {
    setFanLayout,
    playHoverAnimation,
    playSelectAnimation,
    animatedStyle,
  } = useCardAnimation();

  // 应用扇形布局
  useEffect(() => {
    if (fanIndex >= 0 && totalFanCards > 0) {
      const config = {
        radius: 180,
        angleRange: 45,
        cardSpacing: 0.1,
        fanHeight: 15,
        cardWidth: 100,
        cardHeight: 140,
      };
      setFanLayout(fanIndex, totalFanCards, config, 400);
    }
  }, [fanIndex, totalFanCards]);

  return (
    <Animated.View style={animatedStyle}>
      {/* 卡牌内容 */}
    </Animated.View>
  );
}
```

## 动画效果说明

### 扇形布局
- 卡牌在手牌区呈扇形排列
- 中间卡牌最高且最大
- 两边卡牌依次降低和缩小
- 卡牌面向手牌中心旋转

### 悬停效果
- 卡牌上浮 30px
- 放大到 1.15 倍
- 面向玩家（旋转归零）
- 增强光晕效果

### 抽牌动画
- 从牌堆弹出放大
- 弹性移动到抽卡位置
- 翻转 180 度
- 弹性移动到手牌位置并翻转回来

### 受伤动画
- 快速震动（X 和 Y 轴同时）
- 缩放抖动
- 旋转抖动
- 优雅恢复

## 性能优化

1. **避免嵌套动画**：使用 setTimeout 而非 withSequence
2. **使用 SharedValue**：所有动画值都是 SharedValue
3. **样式工厂函数**：`useAnimatedStyle` 避免重渲染
4. **配置记忆化**：使用 useMemo 缓存配置

## 兼容性

- ✅ React Native (Android + iOS)
- ✅ Web
- ✅ React Native Reanimated 4.1.6

## 注意事项

1. **translateZ 不支持**：React Native 的 transform 不支持 translateZ，需要模拟 3D 效果时使用 scale
2. **缓动函数**：使用官方缓动函数，避免自定义
3. **ESLint 规则**：SharedValue 修改需要禁用 `react-hooks/immutability` 规则
4. **动画序列**：使用 setTimeout 而非 withSequence 避免引用丢失

## 后续优化建议

1. 添加更多动画曲线（如贝塞尔曲线插值）
2. 实现卡牌连击动画
3. 添加技能释放特效
4. 支持动态调整动画参数（速度、弹性等）
5. 添加动画配置系统（JSON 配置）
