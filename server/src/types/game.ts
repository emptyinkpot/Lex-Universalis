// 阵营
export const Faction = {
  ENGLAND: 'ENGLAND',
  FRANCE: 'FRANCE',
  HOLY_ROMAN_EMPIRE: 'HRE',
  VIKING: 'VIKING',
  BYZANTIUM: 'BYZANTIUM',
} as const;

export type Faction = (typeof Faction)[keyof typeof Faction];

// 卡牌类型
export const CardType = {
  UNIT: 'UNIT',
  TACTIC: 'TACTIC',
  BUILDING: 'BUILDING',
} as const;

export type CardType = (typeof CardType)[keyof typeof CardType];

// 单位类型
export const UnitType = {
  INFANTRY: 'INFANTRY',
  CAVALRY: 'CAVALRY',
  ARCHER: 'ARCHER',
  SIEGE: 'SIEGE',
} as const;

export type UnitType = (typeof UnitType)[keyof typeof UnitType];

// 战术卡类型
export const TacticType = {
  INSTANT: 'INSTANT',
  ONGOING: 'ONGOING',
  EQUIPMENT: 'EQUIPMENT',
} as const;

export type TacticType = (typeof TacticType)[keyof typeof TacticType];

// 建筑卡类型
export const BuildingType = {
  ECONOMIC: 'ECONOMIC',
  MILITARY: 'MILITARY',
  DEFENSE: 'DEFENSE',
} as const;

export type BuildingType = (typeof BuildingType)[keyof typeof BuildingType];

// 能力类型
export const AbilityType = {
  RANGED: 'RANGED',
  FIRST_STRIKE: 'FIRST_STRIKE',
  CHARGE: 'CHARGE',
  ARMORED: 'ARMORED',
  PLUNDER: 'PLUNDER',
} as const;

export type AbilityType = (typeof AbilityType)[keyof typeof AbilityType];

// 能力接口
export interface Ability {
  type: AbilityType;
  value?: number | boolean;
  description?: string;
}

// 卡牌基础接口
export interface Card {
  id: string;
  name: string;
  type: CardType;
  faction: Faction;
  cost: number;
  description: string;
  flavorText?: string;
  imageUrl?: string;
}

// 单位卡接口
export interface UnitCard extends Card {
  type: 'UNIT';
  unitType: UnitType;
  attack: number;
  health: number;
  abilities: Ability[];
}

// 战术卡接口
export interface TacticCard extends Card {
  type: 'TACTIC';
  tacticType: TacticType;
  effect: string;
  duration?: number;             // 持续效果持续时间（回合数）
}

// 建筑卡接口
export interface BuildingCard extends Card {
  type: 'BUILDING';
  buildingType: BuildingType;
  effect: string;
  health?: number;               // 建筑生命值（可选）
}

// 联合类型
export type AnyCard = UnitCard | TacticCard | BuildingCard;

// 玩家资源
export interface PlayerResources {
  gold: number;                  // 黄金
  influence: number;             // 影响力
  morale: number;                // 士气
}

// 战场位置
export interface Position {
  row: number;                   // 行（0: 后方支援区, 1: 前线交战区, 2: 敌方领土区）
  col: number;                   // 列（0, 1, 2）
}

// 战场上的单位
export interface BattlefieldUnit {
  cardId: string;
  id: string;                    // 唯一实例ID
  position: Position;
  attack: number;                // 当前攻击力
  health: number;                // 当前生命值
  maxHealth: number;
  abilities: Ability[];
  hasAttacked: boolean;          // 本回合是否已攻击
  hasMoved: boolean;             // 本回合是否已移动
}

// 战场状态
export interface Battlefield {
  rows: number;                       // 3行区域
  cols: number;                       // 3列位置
  units: Map<string, BattlefieldUnit>; // 单位ID -> 单位数据
}

// 玩家状态
export interface PlayerState {
  id: string;
  name: string;
  faction: Faction;
  health: number;                // 城堡生命值（默认30）
  resources: PlayerResources;
  hand: AnyCard[];               // 手牌
  deck: AnyCard[];               // 牌库
  graveyard: AnyCard[];          // 墓地
  battlefield: Battlefield;      // 战场
  canPlayCard: boolean;          // 是否可以出牌
}

// 游戏阶段
export const GamePhase = {
  DRAW: 'DRAW',                 // 抽牌阶段
  ACTION: 'ACTION',             // 行动阶段
  COMBAT: 'COMBAT',             // 战斗阶段
  END: 'END',                   // 结束阶段
} as const;

export type GamePhase = (typeof GamePhase)[keyof typeof GamePhase];

// 游戏状态
export interface GameState {
  id: string;
  player1: PlayerState;
  player2: PlayerState;
  currentTurn: number;
  currentPlayer: 'player1' | 'player2';
  phase: GamePhase;
  winner: 'player1' | 'player2' | null;
  isGameOver: boolean;
}

// 玩家操作类型
export const ActionType = {
  PLAY_CARD: 'PLAY_CARD',
  ATTACK: 'ATTACK',
  END_TURN: 'END_TURN',
} as const;

export type ActionType = (typeof ActionType)[keyof typeof ActionType];

// 玩家操作
export interface PlayerAction {
  type: ActionType;
  playerId: string;
  cardId?: string;               // 出牌时的卡牌ID
  targetPosition?: Position;     // 出牌时的目标位置
  attackerId?: string;           // 攻击时的攻击者ID
  targetId?: string;             // 攻击时的目标ID
  timestamp: number;
}

// 卡组
export interface Deck {
  id: string;
  name: string;
  faction: Faction;
  cards: string[];               // 卡牌ID列表
  size: number;
}

// 初始卡牌数据（用于初始化游戏）
export const INITIAL_CARDS: AnyCard[] = [
  // 英格兰单位卡
  {
    id: 'ENG_001',
    name: '英格兰长弓手',
    type: CardType.UNIT,
    faction: Faction.ENGLAND,
    cost: 3,
    unitType: UnitType.ARCHER,
    attack: 2,
    health: 3,
    abilities: [
      { type: AbilityType.RANGED, value: 2, description: '远程攻击2' },
      { type: AbilityType.FIRST_STRIKE, value: true, description: '先攻' },
    ],
    description: '远程攻击，先攻能力',
    flavorText: '英格兰长弓手在百年战争中威名远扬',
  },
  {
    id: 'ENG_002',
    name: '英格兰重步兵',
    type: CardType.UNIT,
    faction: Faction.ENGLAND,
    cost: 4,
    unitType: UnitType.INFANTRY,
    attack: 3,
    health: 5,
    abilities: [
      { type: AbilityType.ARMORED, value: 1, description: '护甲+1' },
    ],
    description: '高防御步兵单位',
  },
  // 法兰西单位卡
  {
    id: 'FRA_001',
    name: '法兰西重装骑士',
    type: CardType.UNIT,
    faction: Faction.FRANCE,
    cost: 5,
    unitType: UnitType.CAVALRY,
    attack: 4,
    health: 5,
    abilities: [
      { type: AbilityType.CHARGE, value: 2, description: '冲锋+2' },
      { type: AbilityType.ARMORED, value: 1, description: '护甲+1' },
    ],
    description: '冲锋能力，高护甲',
    flavorText: '法兰西骑士是欧洲最精锐的骑兵之一',
  },
  // 战术卡
  {
    id: 'TAC_001',
    name: '箭雨',
    type: CardType.TACTIC,
    faction: Faction.ENGLAND,
    cost: 2,
    tacticType: TacticType.INSTANT,
    effect: '对所有敌方单位造成2点伤害',
    description: '大范围远程打击',
  },
  {
    id: 'TAC_002',
    name: '冲锋号角',
    type: CardType.TACTIC,
    faction: Faction.FRANCE,
    cost: 1,
    tacticType: TacticType.INSTANT,
    effect: '本回合所有己方单位攻击力+1',
    description: '提升单位攻击力',
  },
  // 建筑卡
  {
    id: 'BLD_001',
    name: '箭塔',
    type: CardType.BUILDING,
    faction: Faction.ENGLAND,
    cost: 3,
    buildingType: BuildingType.DEFENSE,
    effect: '每回合对敌方前线单位造成1点伤害',
    health: 4,
    description: '远程防御建筑',
  },
  {
    id: 'BLD_002',
    name: '兵营',
    type: CardType.BUILDING,
    faction: Faction.FRANCE,
    cost: 2,
    buildingType: BuildingType.MILITARY,
    effect: '每回合额外获得1点黄金',
    description: '经济建筑，增加资源',
  },
];

// 阵营信息
export const FACTION_INFO = {
  [Faction.ENGLAND]: {
    name: '英格兰',
    color: '#8B0000', // 深红
    description: '长弓手优势、城堡防御',
    icon: 'castle',
  },
  [Faction.FRANCE]: {
    name: '法兰西',
    color: '#0000CD', // 中蓝
    description: '重骑兵冲锋、骑士精神',
    icon: 'horse',
  },
  [Faction.HOLY_ROMAN_EMPIRE]: {
    name: '神圣罗马帝国',
    color: '#FFD700', // 金色
    description: '步兵方阵、帝国权威',
    icon: 'shield',
  },
  [Faction.VIKING]: {
    name: '维京',
    color: '#4169E1', // 皇家蓝
    description: '狂战士、掠夺机制',
    icon: 'axe',
  },
  [Faction.BYZANTIUM]: {
    name: '拜占庭',
    color: '#800080', // 紫色
    description: '希腊火、防御工事',
    icon: 'fire',
  },
} as const;
