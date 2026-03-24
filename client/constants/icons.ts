import { FontAwesome6 } from '@expo/vector-icons';

// 阵营图标配置
export const FACTION_ICONS = {
  ENGLAND: {
    name: 'flag' as const,
    color: '#8B0000', // 深红
    description: '英格兰旗帜'
  },
  FRANCE: {
    name: 'flag' as const,
    color: '#0000CD', // 中蓝
    description: '法兰西旗帜'
  },
  HRE: {
    name: 'crown' as const,
    color: '#FFD700', // 金色
    description: '神圣罗马帝国皇冠'
  },
  VIKING: {
    name: 'ship' as const,
    color: '#4169E1', // 皇家蓝
    description: '维京龙船'
  },
  BYZANTIUM: {
    name: 'church' as const,
    color: '#800080', // 紫色
    description: '拜占庭教堂'
  }
} as const;

// 功能图标配置
export const UI_ICONS = {
  attack: {
    name: 'swords' as const,
    color: '#C8102E', // 攻击红
    description: '攻击'
  },
  defense: {
    name: 'shield-halved' as const,
    color: '#002FA7', // 防御蓝
    description: '防御'
  },
  health: {
    name: 'heart' as const,
    color: '#C8102E', // 生命红
    description: '生命值'
  },
  gold: {
    name: 'coins' as const,
    color: '#C9A96E', // 金币金
    description: '金币'
  },
  influence: {
    name: 'hand-fist' as const,
    color: '#002FA7', // 影响力蓝
    description: '影响力'
  },
  turn: {
    name: 'hourglass' as const,
    color: '#666666', // 灰色
    description: '回合'
  },
  locked: {
    name: 'lock' as const,
    color: '#666666', // 灰色
    description: '锁定'
  },
  unlocked: {
    name: 'unlock' as const,
    color: '#10B981', // 绿色
    description: '解锁'
  },
  star: {
    name: 'star' as const,
    color: '#FFD700', // 金色
    description: '星级'
  },
  skull: {
    name: 'skull' as const,
    color: '#EF4444', // 死亡红
    description: '死亡'
  }
} as const;

// 卡牌类型图标配置
export const CARD_TYPE_ICONS = {
  UNIT: {
    name: 'user-shield' as const,
    color: '#4A4A4A', // 深灰
    description: '单位卡'
  },
  SPELL: {
    name: 'bolt' as const,
    color: '#9B59B6', // 紫色
    description: '法术卡'
  },
  BUILDING: {
    name: 'building-columns' as const,
    color: '#7F8C8D', // 灰色
    description: '建筑卡'
  }
} as const;

// 图标类型定义
export type FactionKey = keyof typeof FACTION_ICONS;
export type UIIconKey = keyof typeof UI_ICONS;
export type CardTypeIconKey = keyof typeof CARD_TYPE_ICONS;
