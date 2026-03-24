# 塔罗牌卡片模板系统

基于 "The Fool" 塔罗牌的视觉设计分析，提取了可模块化的卡片模板组件。

## 📊 视觉设计分析

### 整体布局结构
- **顶部信息区**：数字标识 + 太阳装饰
- **中心视觉区**：占据 70%+ 的插图区域
- **底部信息区**：卡片标题（全大写）
- **外框区**：暖橙色边框，强化卡片属性

### 配色方案
- **主色系**：大地色系（暖棕色、土黄色、黏土橙）
- **辅色系**：撞色点缀（钴蓝色、亮红色、米白色）
- **背景色**：米杏色（模拟复古纸张）
- **文字色**：深棕色（数字）+ 暖橙色（标题）

### 排版样式
- **数字**：无衬线粗体，方形棕色块内
- **标题**：全大写无衬线粗体，宽松字间距
- **对齐方式**：严格居中对齐

## 🎨 组件架构

### 1. 配置文件
`/workspace/projects/client/constants/tarot-card-config.ts`

包含完整的卡片设计系统配置：
- 卡牌尺寸（标准比例 0.556）
- 配色方案（主色、辅色、背景、文字）
- 边框样式（宽度、颜色）
- 字体样式（数字、标题）
- 布局结构（顶部、中心、底部）
- 装饰元素（太阳、纸张纹理）

### 2. 卡片组件
`/workspace/projects/client/components/TarotCard.tsx`

可复用的塔罗牌卡片组件，支持：
- 自定义数字、标题、插图
- 可选太阳装饰
- 正位/逆位切换
- 自定义尺寸
- 点击交互

### 3. 示例页面
`/workspace/projects/client/screens/tarot-card-example/`

展示组件使用方法的示例页面：
- 基础示例
- 不同尺寸
- 逆位效果
- 卡片网格
- 设计说明

## 🚀 使用方法

### 基础使用

```tsx
import { TarotCard } from '@/components/TarotCard';

<TarotCard
  number="0"
  title="THE FOOL"
  illustration={<YourIllustration />}
  showSun={true}
/>
```

### 自定义尺寸

```tsx
<TarotCard
  number="I"
  title="THE MAGICIAN"
  illustration={<YourIllustration />}
  style={{ width: 200, height: 360 }}
/>
```

### 逆位卡片

```tsx
<TarotCard
  number="0"
  title="THE FOOL"
  illustration={<YourIllustration />}
  variant="reversed"
/>
```

### 卡片网格

```tsx
<View style={styles.cardGrid}>
  {cards.map(card => (
    <TarotCard
      key={card.id}
      number={card.number}
      title={card.title}
      illustration={card.illustration}
    />
  ))}
</View>
```

## 🎯 可模块化成分

### 1. 卡牌框架
- 外框（固定宽度、颜色）
- 顶部数字位（方形徽章）
- 底部标题位（居中对齐）
- 背景区域（米杏色）

### 2. 视觉组件
- 太阳装饰（右上角）
- 中心插图区（可自定义）
- 装饰元素（线条、纹理）

### 3. 样式系统
- 配色方案（大地色系）
- 字体样式（粗体、全大写）
- 排版规则（居中对齐）
- 阴影效果（立体感）

### 4. 功能特性
- 正位/逆位切换
- 可自定义尺寸
- 点击交互
- 活跃状态

## 📐 设计规范

### 卡牌尺寸
- **标准比例**：2.5 : 4.5 (0.556)
- **推荐尺寸**：240 x 432 像素
- **边框宽度**：12 像素

### 字体规范
- **数字**：24px，粗体，深棕色
- **标题**：18px，粗体，暖橙色，全大写，宽松字间距

### 颜色规范
- **外框**：#C17A5B（黏土橙）
- **背景**：#FDF5E6（米杏色）
- **数字背景**：#8B7355（暖棕色）
- **数字文字**：#5D4E37（深棕色）
- **标题文字**：#C17A5B（暖橙色）

## 🔧 自定义扩展

### 修改配色

```tsx
import { TAROT_CARD_CONFIG } from '@/constants/tarot-card-config';

// 创建自定义配置
const customConfig = {
  ...TAROT_CARD_CONFIG,
  colors: {
    ...TAROT_CARD_CONFIG.colors,
    primary: {
      warmBrown: '#你的颜色',
      earthYellow: '#你的颜色',
      clayOrange: '#你的颜色',
    },
  },
};
```

### 自定义插图

```tsx
const customIllustration = (
  <View>
    <Image source={require('@/assets/your-image.png')} />
    {/* 或者使用自定义绘图 */}
    <YourCustomDrawing />
  </View>
);
```

## 📚 参考资源

- **原图分析**：`/workspace/projects/client/assets/tarot-card-example.png`
- **配置文件**：`/workspace/projects/client/constants/tarot-card-config.ts`
- **组件文件**：`/workspace/projects/client/components/TarotCard.tsx`
- **示例页面**：`/workspace/projects/client/screens/tarot-card-example/`

## ✨ 特性

- ✅ 完全模块化，易于复用
- ✅ 支持自定义尺寸和样式
- ✅ 正位/逆位切换
- ✅ 响应式设计
- ✅ TypeScript 类型安全
- ✅ 完整的设计系统文档
