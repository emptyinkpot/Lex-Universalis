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
  era: '中世纪',
  description: '英格兰与法兰西围绕王位、领地与秩序的长期冲突。',
  historicalBackground:
    '1337年，英格兰国王爱德华三世宣称自己拥有法兰西王位继承权，英法之间的矛盾全面升级。这个展示剧本保留了故事开端与一场样板战斗，用来串联叙事、章节与实际对局。',
  playerFactions: ['ENGLAND', 'FRANCE', 'HOLY_ROMAN_EMPIRE', 'VIKING', 'BYZANTIUM'],
  recommendedFaction: 'ENGLAND',
  order: 1,
  chapters: [
    {
      id: 'chapter_1',
      name: '第一章：英格兰的崛起',
      description: '战争刚刚开始，前线指挥官必须先稳住阵脚。',
      storyIntro:
        '海峡彼岸的权力争夺已经无法避免，国王下令集结长弓手、步兵与骑士。你要率领第一批部队迎击试探性的敌军进攻，证明这场战争不会在开局就失控。',
      order: 1,
      levels: [
        {
          id: 'level_1_1',
          chapterId: 'chapter_1',
          name: '黑斯廷斯初战',
          description: '作为展示关卡，这一战将直接连接到现有战斗页。',
          difficulty: 'NORMAL',
          storyText:
            '敌军前锋正在逼近海岸线。斥候带回的情报显示，他们会以小规模快速冲击试探你的阵线。守住这一战，你就能让士兵相信这场战争还可以被掌控。',
          enemyFaction: 'VIKING',
          victoryCondition: '击溃敌军前线，或在对局中压制敌方阵地。',
          defeatCondition: '我方战线崩溃，无法继续维持阵地。',
          rewards: [
            { description: '100 黄金' },
            { description: '20 影响力' },
            { description: '解锁后续展示节点' },
          ],
          order: 1,
        },
      ],
    },
  ],
};

export const STORY_SHOWCASE_PROGRESS = {
  totalStars: 0,
  completedLevels: [] as Array<{ levelId: string; stars: number }>,
};
