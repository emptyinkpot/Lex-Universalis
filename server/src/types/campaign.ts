// 关卡难度
export const LevelDifficulty = {
  NORMAL: 'NORMAL',
  HARD: 'HARD',
  EXPERT: 'EXPERT',
} as const;

export type LevelDifficulty = (typeof LevelDifficulty)[keyof typeof LevelDifficulty];

// 关卡奖励类型
export interface LevelReward {
  type: 'gold' | 'influence' | 'card' | 'card_pack';
  amount: number;
  cardId?: string;  // 如果是奖励卡牌
  description: string;
}

// 关卡数据
export interface Level {
  id: string;
  chapterId: string;
  scenarioId?: string;  // 所属剧本ID（可选，兼容旧数据）
  name: string;
  description: string;
  difficulty: LevelDifficulty;
  storyText: string;  // 开场剧情文本
  enemyFaction: string;  // 敌对阵营
  enemyDeck: string[];  // 敌人卡组
  playerDeckConstraint?: {
    maxCost?: number;  // 卡牌最大消耗限制
    minCards?: number;  // 最少卡牌数量
    allowedFactions?: string[];  // 允许的阵营
  };
  rewards: LevelReward[];
  victoryCondition: string;  // 胜利条件描述
  defeatCondition: string;  // 失败条件描述
  order: number;  // 关卡顺序
}

// 剧本数据（参考欧陆风云的剧本模式）
export interface Scenario {
  id: string;
  name: string;
  year: number;  // 起始年份
  era: string;   // 时代
  description: string;  // 剧本简介
  historicalBackground: string;  // 历史背景
  backgroundImage?: string;  // 背景图片URL
  playerFactions: string[];  // 可玩阵营
  recommendedFaction?: string;  // 推荐阵营
  chapters: Chapter[];  // 所属章节
  order: number;  // 剧本顺序
}

// 章节数据
export interface Chapter {
  id: string;
  scenarioId?: string;  // 所属剧本ID
  name: string;
  description: string;
  storyIntro: string;  // 章节开场剧情
  backgroundImage?: string;  // 背景图片URL
  levels: Level[];
  order: number;  // 章节顺序
}

// 关卡进度
export interface LevelProgress {
  levelId: string;
  completed: boolean;
  stars: number;  // 星级（1-3）
  bestScore?: number;  // 最高分
  completedAt?: number;  // 完成时间戳
}

// 玩家战役进度
export interface CampaignProgress {
  userId: string;
  currentChapter: string;  // 当前章节ID
  currentLevel: string;  // 当前关卡ID
  completedLevels: LevelProgress[];  // 已完成关卡列表
  totalStars: number;  // 总星级
  unlockedChapters: string[];  // 已解锁章节列表
  lastPlayedAt: number;  // 最后游戏时间
}
