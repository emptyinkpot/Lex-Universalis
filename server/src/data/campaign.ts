import type { Chapter, Level, Scenario } from '../types/campaign';
import { LevelDifficulty } from '../types/campaign';
import { Faction } from '../types/game';
import { INITIAL_CARDS } from './cards';

// 获取所有卡牌ID
const ALL_CARD_IDS = INITIAL_CARDS.map(card => card.id);

// 英格兰阵营卡牌
const ENGLAND_CARDS = INITIAL_CARDS
  .filter(card => card.faction === Faction.ENGLAND)
  .map(card => card.id);

// 法兰西阵营卡牌
const FRANCE_CARDS = INITIAL_CARDS
  .filter(card => card.faction === Faction.FRANCE)
  .map(card => card.id);

// 神圣罗马帝国阵营卡牌
const HRE_CARDS = INITIAL_CARDS
  .filter(card => card.faction === Faction.HOLY_ROMAN_EMPIRE)
  .map(card => card.id);

// 维京阵营卡牌
const VIKING_CARDS = INITIAL_CARDS
  .filter(card => card.faction === Faction.VIKING)
  .map(card => card.id);

// 拜占庭阵营卡牌
const BYZANTIUM_CARDS = INITIAL_CARDS
  .filter(card => card.faction === Faction.BYZANTIUM)
  .map(card => card.id);

// 生成基础卡组（用于敌人）
function generateEnemyDeck(faction: string, cardCount: number = 10): string[] {
  const factionCards = {
    [Faction.ENGLAND]: ENGLAND_CARDS,
    [Faction.FRANCE]: FRANCE_CARDS,
    [Faction.HOLY_ROMAN_EMPIRE]: HRE_CARDS,
    [Faction.VIKING]: VIKING_CARDS,
    [Faction.BYZANTIUM]: BYZANTIUM_CARDS,
  };

  const cards = factionCards[faction as Faction] || ALL_CARD_IDS;
  const deck: string[] = [];

  for (let i = 0; i < cardCount; i++) {
    deck.push(cards[i % cards.length]);
  }

  return deck;
}

// 第一章：英格兰的崛起
const chapter1: Chapter = {
  id: 'chapter_1',
  scenarioId: 'scenario_hundred_years_war',
  name: '第一章：英格兰的崛起',
  description: '百年战争爆发，英格兰国王向法国宣战。你将指挥英格兰军队，在黑斯廷斯战役中证明你的实力。',
  storyIntro: '1066年，英格兰国王哈罗德刚刚继位，法国诺曼底公爵威廉便率领大军渡海而来。这场战争将决定英格兰的命运。',
  order: 1,
  levels: [
    {
      id: 'level_1_1',
      chapterId: 'chapter_1',
      name: '黑斯廷斯初战',
      description: '你的首战，击败维京先锋队',
      difficulty: LevelDifficulty.NORMAL,
      storyText: '维京海盗正在掠夺沿海村庄，作为英格兰的新任指挥官，你的任务是阻止他们。',
      enemyFaction: Faction.VIKING,
      enemyDeck: generateEnemyDeck(Faction.VIKING, 8),
      playerDeckConstraint: {
        minCards: 8,
        allowedFactions: [Faction.ENGLAND],
      },
      rewards: [
        {
          type: 'gold',
          amount: 100,
          description: '100 黄金',
        },
        {
          type: 'card',
          amount: 1,
          cardId: 'ENG_001',
          description: '英格兰长弓手卡牌',
        },
      ],
      victoryCondition: '击败敌方所有单位或摧毁敌方城堡',
      defeatCondition: '己方城堡生命值归零',
      order: 1,
    },
    {
      id: 'level_1_2',
      chapterId: 'chapter_1',
      name: '骑士的荣耀',
      description: '面对法兰西骑士团的进攻',
      difficulty: LevelDifficulty.NORMAL,
      storyText: '法兰西骑士团如钢铁洪流般涌来，你的长弓手将成为最后的防线。',
      enemyFaction: Faction.FRANCE,
      enemyDeck: generateEnemyDeck(Faction.FRANCE, 10),
      playerDeckConstraint: {
        minCards: 10,
        allowedFactions: [Faction.ENGLAND],
      },
      rewards: [
        {
          type: 'gold',
          amount: 150,
          description: '150 黄金',
        },
        {
          type: 'influence',
          amount: 50,
          description: '50 影响力',
        },
      ],
      victoryCondition: '击败敌方所有单位或摧毁敌方城堡',
      defeatCondition: '己方城堡生命值归零',
      order: 2,
    },
    {
      id: 'level_1_3',
      chapterId: 'chapter_1',
      name: '血染沙场',
      description: '艰难的消耗战，考验你的耐力',
      difficulty: LevelDifficulty.HARD,
      storyText: '这场战役已经持续了三天，双方都精疲力竭。谁能坚持到最后，谁就是赢家。',
      enemyFaction: Faction.HOLY_ROMAN_EMPIRE,
      enemyDeck: generateEnemyDeck(Faction.HOLY_ROMAN_EMPIRE, 12),
      playerDeckConstraint: {
        minCards: 12,
        allowedFactions: [Faction.ENGLAND],
      },
      rewards: [
        {
          type: 'gold',
          amount: 200,
          description: '200 黄金',
        },
        {
          type: 'card_pack',
          amount: 1,
          description: '卡包 x1',
        },
      ],
      victoryCondition: '击败敌方所有单位或摧毁敌方城堡',
      defeatCondition: '己方城堡生命值归零',
      order: 3,
    },
  ],
};

// 第二章：法兰西的复仇
const chapter2: Chapter = {
  id: 'chapter_2',
  scenarioId: 'scenario_hundred_years_war',
  name: '第二章：法兰西的复仇',
  description: '圣女贞德带领法兰西军队反击，收复失地。你将见证百年战争的转折点。',
  storyIntro: '1429年，一位名叫贞德的农家女自称得到上帝的启示，要她带领法兰西军队驱逐英国入侵者。奇迹即将发生。',
  order: 2,
  levels: [
    {
      id: 'level_2_1',
      chapterId: 'chapter_2',
      name: '奥尔良之围',
      description: '解救被围困的奥尔良城',
      difficulty: LevelDifficulty.NORMAL,
      storyText: '奥尔良城已被英军围困半年，城内粮草将尽。贞德率领援军即将抵达。',
      enemyFaction: Faction.ENGLAND,
      enemyDeck: generateEnemyDeck(Faction.ENGLAND, 10),
      playerDeckConstraint: {
        minCards: 10,
        allowedFactions: [Faction.FRANCE],
      },
      rewards: [
        {
          type: 'gold',
          amount: 120,
          description: '120 黄金',
        },
        {
          type: 'card',
          amount: 1,
          cardId: 'FRA_001',
          description: '法兰西重装骑士卡牌',
        },
      ],
      victoryCondition: '击败敌方所有单位或摧毁敌方城堡',
      defeatCondition: '己方城堡生命值归零',
      order: 1,
    },
    {
      id: 'level_2_2',
      chapterId: 'chapter_2',
      name: '帕提之战',
      description: '追击英军，速战速决',
      difficulty: LevelDifficulty.HARD,
      storyText: '英军撤退，贞德率领骑兵追击。这是一场速度与力量的较量。',
      enemyFaction: Faction.ENGLAND,
      enemyDeck: generateEnemyDeck(Faction.ENGLAND, 12),
      playerDeckConstraint: {
        minCards: 12,
        allowedFactions: [Faction.FRANCE],
        maxCost: 5,  // 限制使用低消耗卡牌，考验快速出牌能力
      },
      rewards: [
        {
          type: 'gold',
          amount: 180,
          description: '180 黄金',
        },
        {
          type: 'influence',
          amount: 80,
          description: '80 影响力',
        },
      ],
      victoryCondition: '击败敌方所有单位或摧毁敌方城堡',
      defeatCondition: '己方城堡生命值归零',
      order: 2,
    },
    {
      id: 'level_2_3',
      chapterId: 'chapter_2',
      name: '兰斯的加冕',
      description: '护送查理七世前往兰斯加冕',
      difficulty: LevelDifficulty.EXPERT,
      storyText: '通往兰斯的道路上布满敌人。保护国王安全抵达兰斯，是法兰西复兴的关键。',
      enemyFaction: Faction.HOLY_ROMAN_EMPIRE,
      enemyDeck: generateEnemyDeck(Faction.HOLY_ROMAN_EMPIRE, 14),
      playerDeckConstraint: {
        minCards: 14,
        allowedFactions: [Faction.FRANCE],
      },
      rewards: [
        {
          type: 'gold',
          amount: 300,
          description: '300 黄金',
        },
        {
          type: 'card_pack',
          amount: 2,
          description: '卡包 x2',
        },
        {
          type: 'card',
          amount: 1,
          cardId: 'FRA_003',
          description: '法兰西弓箭手卡牌',
        },
      ],
      victoryCondition: '击败敌方所有单位或摧毁敌方城堡',
      defeatCondition: '己方城堡生命值归零',
      order: 3,
    },
  ],
};

// 第三章：帝国的黄昏
const chapter3: Chapter = {
  id: 'chapter_3',
  scenarioId: 'scenario_hundred_years_war',
  name: '第三章：帝国的黄昏',
  description: '神圣罗马帝国面临内外交困，各地的诸侯蠢蠢欲动。作为皇帝的忠实骑士，你必须维护帝国的统一。',
  storyIntro: '12世纪，神圣罗马帝国正面临分裂的危机。各地诸侯纷纷叛乱，东方的拜占庭帝国也虎视眈眈。',
  order: 3,
  levels: [
    {
      id: 'level_3_1',
      chapterId: 'chapter_3',
      name: '诸侯叛乱',
      description: '平定萨克森公爵的叛乱',
      difficulty: LevelDifficulty.NORMAL,
      storyText: '萨克森公爵宣布脱离帝国，自立为王。皇帝命令你立即平叛。',
      enemyFaction: Faction.VIKING,
      enemyDeck: generateEnemyDeck(Faction.VIKING, 11),
      playerDeckConstraint: {
        minCards: 11,
        allowedFactions: [Faction.HOLY_ROMAN_EMPIRE],
      },
      rewards: [
        {
          type: 'gold',
          amount: 130,
          description: '130 黄金',
        },
        {
          type: 'card',
          amount: 1,
          cardId: 'HRE_002',
          description: '帝国重装步兵卡牌',
        },
      ],
      victoryCondition: '击败敌方所有单位或摧毁敌方城堡',
      defeatCondition: '己方城堡生命值归零',
      order: 1,
    },
    {
      id: 'level_3_2',
      chapterId: 'chapter_3',
      name: '东方来客',
      description: '对抗拜占庭军队的入侵',
      difficulty: LevelDifficulty.HARD,
      storyText: '拜占庭帝国派遣军队支援叛军，你的防线正遭受前所未有的压力。',
      enemyFaction: Faction.BYZANTIUM,
      enemyDeck: generateEnemyDeck(Faction.BYZANTIUM, 13),
      playerDeckConstraint: {
        minCards: 13,
        allowedFactions: [Faction.HOLY_ROMAN_EMPIRE],
      },
      rewards: [
        {
          type: 'gold',
          amount: 200,
          description: '200 黄金',
        },
        {
          type: 'influence',
          amount: 100,
          description: '100 影响力',
        },
      ],
      victoryCondition: '击败敌方所有单位或摧毁敌方城堡',
      defeatCondition: '己方城堡生命值归零',
      order: 2,
    },
  ],
};

// 第四章：维京的黄昏
const chapter4: Chapter = {
  id: 'chapter_4',
  scenarioId: 'scenario_hundred_years_war',
  name: '第四章：维京的黄昏',
  description: '维京时代即将结束，最后的维京勇士们试图在战场上证明自己的价值。',
  storyIntro: '11世纪末，维京时代逐渐走向终结。基督教的传播和各国军队的强大，使得维京海盗的生存空间越来越小。',
  order: 4,
  levels: [
    {
      id: 'level_4_1',
      chapterId: 'chapter_4',
      name: '最后的掠夺',
      description: '最后一次成功掠夺英格兰村庄',
      difficulty: LevelDifficulty.NORMAL,
      storyText: '趁着英格兰军队主力出征，你率领维京勇士突袭沿海村庄。',
      enemyFaction: Faction.ENGLAND,
      enemyDeck: generateEnemyDeck(Faction.ENGLAND, 10),
      playerDeckConstraint: {
        minCards: 10,
        allowedFactions: [Faction.VIKING],
      },
      rewards: [
        {
          type: 'gold',
          amount: 150,
          description: '150 黄金',
        },
        {
          type: 'card',
          amount: 1,
          cardId: 'VIK_001',
          description: '维京狂战士卡牌',
        },
      ],
      victoryCondition: '击败敌方所有单位或摧毁敌方城堡',
      defeatCondition: '己方城堡生命值归零',
      order: 1,
    },
    {
      id: 'level_4_2',
      chapterId: 'chapter_4',
      name: '死守家园',
      description: '保卫维京据点，抵御法兰西军队',
      difficulty: LevelDifficulty.HARD,
      storyText: '法兰西军队发现了你的据点，正在集结兵力准备进攻。',
      enemyFaction: Faction.FRANCE,
      enemyDeck: generateEnemyDeck(Faction.FRANCE, 12),
      playerDeckConstraint: {
        minCards: 12,
        allowedFactions: [Faction.VIKING],
      },
      rewards: [
        {
          type: 'gold',
          amount: 220,
          description: '220 黄金',
        },
        {
          type: 'card_pack',
          amount: 1,
          description: '卡包 x1',
        },
      ],
      victoryCondition: '击败敌方所有单位或摧毁敌方城堡',
      defeatCondition: '己方城堡生命值归零',
      order: 2,
    },
  ],
};

// 第五章：拜占庭的最后防线
const chapter5: Chapter = {
  id: 'chapter_5',
  scenarioId: 'scenario_hundred_years_war',
  name: '第五章：拜占庭的最后防线',
  description: '奥斯曼土耳其大军压境，拜占庭帝国即将迎来最后的命运。作为守城指挥官，你将见证历史的转折点。',
  storyIntro: '1453年，奥斯曼土耳其苏丹穆罕默德二世率领大军围攻君士坦丁堡。这座千年古城正面临前所未有的危机。',
  order: 5,
  levels: [
    {
      id: 'level_5_1',
      chapterId: 'chapter_5',
      name: '城外的威胁',
      description: '击败维京雇佣军',
      difficulty: LevelDifficulty.NORMAL,
      storyText: '奥斯曼帝国雇佣了大量维京雇佣军作为先锋。击败他们，守卫城外防线。',
      enemyFaction: Faction.VIKING,
      enemyDeck: generateEnemyDeck(Faction.VIKING, 12),
      playerDeckConstraint: {
        minCards: 12,
        allowedFactions: [Faction.BYZANTIUM],
      },
      rewards: [
        {
          type: 'gold',
          amount: 140,
          description: '140 黄金',
        },
        {
          type: 'card',
          amount: 1,
          cardId: 'BYZ_002',
          description: '希腊火战士卡牌',
        },
      ],
      victoryCondition: '击败敌方所有单位或摧毁敌方城堡',
      defeatCondition: '己方城堡生命值归零',
      order: 1,
    },
    {
      id: 'level_5_2',
      chapterId: 'chapter_5',
      name: '希腊火的威力',
      description: '使用希腊火对抗大军',
      difficulty: LevelDifficulty.HARD,
      storyText: '奥斯曼主力部队即将抵达，希腊火是你最后的希望。',
      enemyFaction: Faction.HOLY_ROMAN_EMPIRE,
      enemyDeck: generateEnemyDeck(Faction.HOLY_ROMAN_EMPIRE, 14),
      playerDeckConstraint: {
        minCards: 14,
        allowedFactions: [Faction.BYZANTIUM],
      },
      rewards: [
        {
          type: 'gold',
          amount: 250,
          description: '250 黄金',
        },
        {
          type: 'influence',
          amount: 120,
          description: '120 影响力',
        },
      ],
      victoryCondition: '击败敌方所有单位或摧毁敌方城堡',
      defeatCondition: '己方城堡生命值归零',
      order: 2,
    },
    {
      id: 'level_5_3',
      chapterId: 'chapter_5',
      name: '君士坦丁堡陷落',
      description: '绝望的背水一战',
      difficulty: LevelDifficulty.EXPERT,
      storyText: '城门已被攻破，最后的防线正在崩溃。这或许是拜占庭的最后一战。',
      enemyFaction: Faction.FRANCE,
      enemyDeck: generateEnemyDeck(Faction.FRANCE, 16),
      playerDeckConstraint: {
        minCards: 16,
        allowedFactions: [Faction.BYZANTIUM],
      },
      rewards: [
        {
          type: 'gold',
          amount: 400,
          description: '400 黄金',
        },
        {
          type: 'card_pack',
          amount: 3,
          description: '卡包 x3',
        },
      ],
      victoryCondition: '击败敌方所有单位或摧毁敌方城堡',
      defeatCondition: '己方城堡生命值归零',
      order: 3,
    },
  ],
};

// ===== 满洲入关剧本 =====

// 满洲入关章节
const chapterManchu1: Chapter = {
  id: 'chapter_manchu_1',
  scenarioId: 'scenario_manchu_entry',
  name: '第一章：山海关之战',
  description: '1644年，李自成攻破北京，崇祯帝自缢。吴三桂向清军求援，多尔衮率军入关。历史即将改变。',
  storyIntro: '崇祯十七年三月十九日，李自成攻破北京，崇祯帝在煤山自缢。明朝灭亡。山海关守将吴三桂在降顺还是抗清之间犹豫。最终，他选择向清军摄政王多尔衮求援。多尔衮抓住机会，率八旗大军向山海关进发。',
  order: 1,
  levels: [
    {
      id: 'level_manchu_1_1',
      chapterId: 'chapter_manchu_1',
      scenarioId: 'scenario_manchu_entry',
      name: '吴三桂的抉择',
      description: '李自成大军逼近，你必须做出选择',
      difficulty: LevelDifficulty.NORMAL,
      storyText: '李自成的大顺军已至山海关外，吴三桂面临人生中最重要的抉择。他可以投降大顺，也可以向清军求援。历史的十字路口，他会何去何从？',
      enemyFaction: Faction.VIKING,  // 用维京代表起义军
      enemyDeck: generateEnemyDeck(Faction.VIKING, 10),
      playerDeckConstraint: {
        minCards: 10,
        allowedFactions: [Faction.ENGLAND],  // 用英格兰代表明朝
      },
      rewards: [
        {
          type: 'gold',
          amount: 150,
          description: '150 黄金',
        },
        {
          type: 'card',
          amount: 1,
          cardId: 'ENG_002',
          description: '英格兰重步兵卡牌（代表关宁铁骑）',
        },
      ],
      victoryCondition: '击败敌方所有单位或摧毁敌方城堡',
      defeatCondition: '己方城堡生命值归零',
      order: 1,
    },
    {
      id: 'level_manchu_1_2',
      chapterId: 'chapter_manchu_1',
      scenarioId: 'scenario_manchu_entry',
      name: '一片石之战',
      description: '清军与大顺军的首次交锋',
      difficulty: LevelDifficulty.HARD,
      storyText: '多尔衮率领八旗大军抵达一片石，与李自成的大顺军展开激战。这是一场决定中国未来走向的关键之战。',
      enemyFaction: Faction.FRANCE,  // 用法兰西代表大顺军
      enemyDeck: generateEnemyDeck(Faction.FRANCE, 12),
      playerDeckConstraint: {
        minCards: 12,
        allowedFactions: [Faction.HOLY_ROMAN_EMPIRE],  // 用神圣罗马帝国代表清军
      },
      rewards: [
        {
          type: 'gold',
          amount: 250,
          description: '250 黄金',
        },
        {
          type: 'influence',
          amount: 100,
          description: '100 影响力',
        },
        {
          type: 'card',
          amount: 1,
          cardId: 'HRE_002',
          description: '帝国重装步兵卡牌（代表满洲八旗）',
        },
      ],
      victoryCondition: '击败敌方所有单位或摧毁敌方城堡',
      defeatCondition: '己方城堡生命值归零',
      order: 2,
    },
    {
      id: 'level_manchu_1_3',
      chapterId: 'chapter_manchu_1',
      scenarioId: 'scenario_manchu_entry',
      name: '入主中原',
      description: '清军攻入北京，建立新朝',
      difficulty: LevelDifficulty.EXPERT,
      storyText: '一片石之战后，李自成败退，清军顺利进入北京。多尔衮拥立顺治帝入关，清朝正式建立。但南明势力仍在，统一之路漫长。',
      enemyFaction: Faction.BYZANTIUM,  // 用拜占庭代表南明
      enemyDeck: generateEnemyDeck(Faction.BYZANTIUM, 16),
      playerDeckConstraint: {
        minCards: 16,
        allowedFactions: [Faction.HOLY_ROMAN_EMPIRE],
      },
      rewards: [
        {
          type: 'gold',
          amount: 500,
          description: '500 黄金',
        },
        {
          type: 'card_pack',
          amount: 5,
          description: '卡包 x5',
        },
      ],
      victoryCondition: '击败敌方所有单位或摧毁敌方城堡',
      defeatCondition: '己方城堡生命值归零',
      order: 3,
    },
  ],
};

// ===== 剧本数据 =====

// 百年战争剧本（1337-1453）
const scenarioHundredYearsWar: Scenario = {
  id: 'scenario_hundred_years_war',
  name: '百年战争',
  year: 1337,
  era: '中世纪',
  description: '英格兰与法国为争夺法国王位而持续百年的战争',
  historicalBackground: '1337年，英格兰国王爱德华三世宣称自己拥有法国王位的继承权，引发了对法战争。这场战争持续了116年，深刻影响了欧洲的政治格局和军事发展。从黑斯廷斯战役到阿金库尔，从圣女贞德到百年战争结束，无数英雄人物在这场战争中留下了传奇。',
  playerFactions: ['ENGLAND', 'FRANCE', 'HRE', 'VIKING', 'BYZANTIUM'],
  recommendedFaction: 'ENGLAND',
  chapters: [chapter1, chapter2, chapter3, chapter4, chapter5],
  order: 1,
};

// 满洲入关剧本（1644）
const scenarioManchuEntry: Scenario = {
  id: 'scenario_manchu_entry',
  name: '满洲入关',
  year: 1644,
  era: '明末清初',
  description: '清军入关，明朝灭亡，中国历史进入新纪元',
  historicalBackground: '崇祯十七年（1644年），李自成率大顺军攻破北京，崇祯帝自缢。山海关守将吴三桂向清军摄政王多尔衮求援。多尔衮抓住时机，率领八旗大军入关，在一片石击败李自成，随后攻占北京。清朝开始统治中国，标志着中国历史从明朝向清朝的过渡。',
  playerFactions: ['HRE', 'FRANCE', 'VIKING', 'BYZANTIUM'],  // 用神圣罗马代表清，法兰西代表大顺
  recommendedFaction: 'HRE',
  chapters: [chapterManchu1],
  order: 2,
};

// 导出所有章节
export const CAMPAIGN_CHAPTERS: Chapter[] = [
  chapter1,
  chapter2,
  chapter3,
  chapter4,
  chapter5,
  chapterManchu1,
];

// 导出所有剧本
export const CAMPAIGN_SCENARIOS: Scenario[] = [
  scenarioHundredYearsWar,
  scenarioManchuEntry,
];

// 导出所有关卡
export const CAMPAIGN_LEVELS: Level[] = CAMPAIGN_CHAPTERS.flatMap(chapter => chapter.levels);

// 根据ID获取剧本
export function getScenarioById(scenarioId: string): Scenario | undefined {
  return CAMPAIGN_SCENARIOS.find(scenario => scenario.id === scenarioId);
}

// 根据ID获取关卡
export function getLevelById(levelId: string): Level | undefined {
  return CAMPAIGN_LEVELS.find(level => level.id === levelId);
}

// 根据ID获取章节
export function getChapterById(chapterId: string): Chapter | undefined {
  return CAMPAIGN_CHAPTERS.find(chapter => chapter.id === chapterId);
}

// 根据剧本ID获取章节列表
export function getChaptersByScenario(scenarioId: string): Chapter[] {
  return CAMPAIGN_CHAPTERS.filter(chapter => chapter.scenarioId === scenarioId);
}
