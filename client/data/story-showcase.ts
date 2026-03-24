export type ShowcaseReward = { description: string };

export type ShowcaseLevel = {
  id: string;
  chapterId: string;
  name: string;
  description: string;
  difficulty: string;
  storyText: string;
  enemyFaction: string;
  victoryCondition: string;
  defeatCondition: string;
  rewards: ShowcaseReward[];
  order: number;
};

export type ShowcaseChapter = {
  id: string;
  name: string;
  description: string;
  storyIntro: string;
  levels: ShowcaseLevel[];
  order: number;
};

export type ShowcaseScenario = {
  id: string;
  name: string;
  year: number;
  era: string;
  description: string;
  historicalBackground: string;
  playerFactions: string[];
  recommendedFaction?: string;
  chapters: ShowcaseChapter[];
  order: number;
};

export const STORY_SHOWCASE_SCENARIO: ShowcaseScenario = {
  id: 'scenario_hundred_years_war',
  name: '百年战争',
  year: 1337,
  era: '中世纪晚期',
  description: '英格兰与法兰西围绕王位、领地与秩序展开的长期冲突。',
  historicalBackground:
    '1337 年，英格兰国王爱德华三世公开主张自己拥有法兰西王位继承权，英法之间的长期矛盾全面升级。这个样板剧本用三章内容串起世界观、战前叙事与现有战斗系统。',
  playerFactions: ['ENGLAND', 'FRANCE', 'HOLY_ROMAN_EMPIRE', 'VIKING', 'BYZANTIUM'],
  recommendedFaction: 'ENGLAND',
  order: 1,
  chapters: [
    {
      id: 'chapter_1',
      name: '第一章：黑海岸烽火',
      description: '战事刚刚点燃，边境与海岸线成为最早承压的区域。',
      storyIntro:
        '海峡彼岸的风向已经变了。你率领的先遣队必须在沿岸守住第一道防线，让动员中的军队争取时间。',
      order: 1,
      levels: [
        {
          id: 'level_1_1',
          chapterId: 'chapter_1',
          name: '黑斯廷斯初战',
          description: '用于展示故事模式如何直接接入现有战斗页。',
          difficulty: 'NORMAL',
          storyText:
            '敌军前锋正在靠近海岸防线。斥候报告显示，对方会用一轮快速冲击试探你的阵型强度。',
          enemyFaction: 'VIKING',
          victoryCondition: '守住前线，并在战斗中压制敌方阵地。',
          defeatCondition: '我方防线被击穿，无法继续稳住阵地。',
          rewards: [
            { description: '100 黄金' },
            { description: '20 影响力' },
            { description: '解锁战报档案' },
          ],
          order: 1,
        },
      ],
    },
    {
      id: 'chapter_2',
      name: '第二章：灰旗行军',
      description: '战争进入拉扯阶段，军粮、情报与士气变得和刀剑同样关键。',
      storyIntro:
        '沿岸守住之后，真正的问题才开始出现。补给线拉长，边境骑兵四散劫掠，军中的怀疑也开始蔓延。',
      order: 2,
      levels: [
        {
          id: 'level_2_1',
          chapterId: 'chapter_2',
          name: '灰旗驿道',
          description: '一场围绕补给线和侧翼骚扰展开的中段交锋。',
          difficulty: 'HARD',
          storyText:
            '一支敌方轻骑正在撕扯补给驿道。你必须顶住前线，同时让后排持续提供火力与资源。',
          enemyFaction: 'FRANCE',
          victoryCondition: '在补给未崩溃前击退敌军突击队。',
          defeatCondition: '后排火力点被清空，补给线彻底失守。',
          rewards: [
            { description: '解锁战术模板：补给封锁' },
            { description: '120 黄金' },
            { description: '新的故事条目：灰旗军令' },
          ],
          order: 1,
        },
      ],
    },
    {
      id: 'chapter_3',
      name: '第三章：王座回声',
      description: '战争已不再只是边境冲突，而是对秩序和正统性的正面对撞。',
      storyIntro:
        '每一面旗帜都开始宣称自己代表真正的秩序。到了这一刻，战斗不只决定胜负，也决定谁来书写历史。',
      order: 3,
      levels: [
        {
          id: 'level_3_1',
          chapterId: 'chapter_3',
          name: '王厅外的火光',
          description: '一场更像终章前夜的样板战斗，用来展示高压局势。',
          difficulty: 'EXPERT',
          storyText:
            '王厅外的火光映亮了盾墙。敌方不会再试探，他们将直接冲击你的核心阵列。',
          enemyFaction: 'HOLY_ROMAN_EMPIRE',
          victoryCondition: '在核心阵列未崩溃前完成反击并夺回战场主动权。',
          defeatCondition: '我方核心阵位连续失守，指挥链断裂。',
          rewards: [
            { description: '解锁世界观条目：王座回声' },
            { description: '150 黄金' },
            { description: '30 影响力' },
          ],
          order: 1,
        },
      ],
    },
  ],
};

export const STORY_SHOWCASE_PROGRESS = {
  totalStars: 4,
  completedLevels: [
    { levelId: 'level_1_1', stars: 2 },
    { levelId: 'level_2_1', stars: 2 },
  ] as Array<{ levelId: string; stars: number }>,
};
