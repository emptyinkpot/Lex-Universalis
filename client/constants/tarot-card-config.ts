/**
 * 塔罗牌卡片设计系统配置
 * 基于 "The Fool" 塔罗牌的视觉设计分析
 */

export const TAROT_CARD_CONFIG = {
  // ========== 卡牌尺寸 ==========
  dimensions: {
    // 标准塔罗牌比例（参考：2.5 x 4.5 英寸）
    aspectRatio: 0.556, // width / height
    // 推荐像素尺寸
    defaultWidth: 240,
    defaultHeight: 432,
  },

  // ========== 配色方案 ==========
  colors: {
    // 主色系 - 大地色系
    primary: {
      warmBrown: '#8B7355',      // 暖棕色（数字背景、岩石）
      earthYellow: '#D4A574',     // 土黄色（服饰、背包）
      clayOrange: '#C17A5B',       // 黏土橙（外框）
    },

    // 辅色系 - 撞色点缀
    secondary: {
      cobaltBlue: '#4A6FA5',      // 钴蓝色（云朵、山脉）
      brightRed: '#E84A4A',        // 亮红色（皮肤、焦点）
      offWhite: '#F5F5DC',         // 米白色（狼、云朵）
    },

    // 背景色
    background: {
      cardInner: '#FDF5E6',        // 卡片内部背景（米杏色）
      cardOuter: '#C17A5B',        // 卡片外框
      paperTexture: '#F0E6D2',     // 纸张质感
    },

    // 文字色
    text: {
      darkBrown: '#5D4E37',        // 深棕色（数字）
      orange: '#C17A5B',           // 暖橙色（标题）
    },
  },

  // ========== 边框样式 ==========
  border: {
    width: 12,                      // 外框宽度（像素）
    color: '#C17A5B',              // 外框颜色
    style: 'solid',                // 边框样式
  },

  // ========== 字体样式 ==========
  typography: {
    // 顶部数字
    number: {
      fontSize: 24,
      fontWeight: 'bold',
      fontFamily: 'sans-serif',
      color: '#5D4E37',
      letterSpacing: 0,
      lineHeight: 1,
    },

    // 底部标题
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      fontFamily: 'sans-serif',
      color: '#C17A5B',
      letterSpacing: 2,            // 宽松字间距
      textTransform: 'uppercase',  // 全大写
      lineHeight: 1.2,
    },
  },

  // ========== 布局结构 ==========
  layout: {
    // 顶部区域
    topSection: {
      height: 60,                  // 顶部区域高度
      padding: 12,
    },

    // 数字徽章
    numberBadge: {
      width: 40,
      height: 40,
      backgroundColor: '#8B7355',
      borderRadius: 4,
    },

    // 中心视觉区域
    centerSection: {
      flex: 1,                      // 占据剩余空间
      padding: 16,
    },

    // 底部区域
    bottomSection: {
      height: 50,                  // 底部区域高度
      padding: 12,
    },
  },

  // ========== 装饰元素 ==========
  decoration: {
    // 太阳图标
    sun: {
      size: 32,
      color: '#FFD700',
      position: 'top-right',
      offset: { top: 8, right: 8 },
    },

    // 纸张纹理
    paperTexture: {
      opacity: 0.1,
      color: '#8B7355',
    },

    // 插画风格
    illustration: {
      style: 'flat',               // 扁平风格
      lineWidth: 1.5,              // 线条宽度
      lineColor: '#2C2C2C',        // 线条颜色
    },
  },

  // ========== 动画效果 ==========
  animation: {
    duration: 300,
    easing: 'ease-out',
  },
} as const;

// ========== 类型定义 ==========

export interface TarotCardConfig {
  number: string;                  // 卡牌数字（如 "0", "I", "II"）
  title: string;                   // 卡牌标题（如 "THE FOOL"）
  illustration: React.ReactNode;   // 中心插图
  showSun?: boolean;               // 是否显示太阳装饰
  variant?: 'default' | 'reversed' // 正位/逆位
}

export interface TarotCardStyle {
  width?: number;
  height?: number;
  backgroundColor?: string;
  borderColor?: string;
}
