import type { Chapter, Level, Scenario } from '../types/campaign';
import { LevelDifficulty } from '../types/campaign';
import { Faction } from '../types/game';
import { INITIAL_CARDS } from './cards';

const ALL_CARD_IDS = INITIAL_CARDS.map((card) => card.id);

const ENGLAND_CARDS = INITIAL_CARDS.filter((card) => card.faction === Faction.ENGLAND).map((card) => card.id);
const FRANCE_CARDS = INITIAL_CARDS.filter((card) => card.faction === Faction.FRANCE).map((card) => card.id);
const HRE_CARDS = INITIAL_CARDS.filter((card) => card.faction === Faction.HOLY_ROMAN_EMPIRE).map((card) => card.id);
const VIKING_CARDS = INITIAL_CARDS.filter((card) => card.faction === Faction.VIKING).map((card) => card.id);
const BYZANTIUM_CARDS = INITIAL_CARDS.filter((card) => card.faction === Faction.BYZANTIUM).map((card) => card.id);

function generateEnemyDeck(faction: string, cardCount = 10): string[] {
  const factionCards = {
    [Faction.ENGLAND]: ENGLAND_CARDS,
    [Faction.FRANCE]: FRANCE_CARDS,
    [Faction.HOLY_ROMAN_EMPIRE]: HRE_CARDS,
    [Faction.VIKING]: VIKING_CARDS,
    [Faction.BYZANTIUM]: BYZANTIUM_CARDS,
  };

  const cards = factionCards[faction as Faction] || ALL_CARD_IDS;
  if (cards.length === 0) {
    return ALL_CARD_IDS.slice(0, Math.max(cardCount, 1));
  }

  const deck: string[] = [];
  for (let i = 0; i < cardCount; i += 1) {
    deck.push(cards[i % cards.length]);
  }
  return deck;
}

const level1: Level = {
  id: 'level_1_1',
  chapterId: 'chapter_1',
  name: '黑斯廷斯初战',
  description: '守住第一波冲击，稳住故事的开端。',
  difficulty: LevelDifficulty.NORMAL,
  storyText:
    '诺曼军队正在逼近，英格兰的前线必须先站稳。你将带领第一支部队迎战，撑过这场开局之战。',
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
      type: 'influence',
      amount: 20,
      description: '20 影响力',
    },
  ],
  victoryCondition: '击败敌方全部单位，或摧毁敌方城墙',
  defeatCondition: '己方城墙生命值归零',
  order: 1,
};

const chapter1: Chapter = {
  id: 'chapter_1',
  scenarioId: 'scenario_hundred_years_war',
  name: '第一章：英格兰的崛起',
  description: '百年战争的开端，英格兰必须站稳脚跟。',
  storyIntro:
    '1337年，英格兰与法兰西之间的矛盾全面爆发。王位、领土与荣誉交织成漫长的战争，第一场战斗决定了故事的走向。',
  order: 1,
  levels: [level1],
};

const scenarioHundredYearsWar: Scenario = {
  id: 'scenario_hundred_years_war',
  name: '百年战争',
  year: 1337,
  era: '中世纪',
  description: '英格兰与法兰西之间持续百年的争夺。',
  historicalBackground:
    '1337年，英格兰国王爱德华三世宣称自己拥有法兰西王位继承权，引发百年战争。战争持续一百余年，改变了欧洲的政治格局。',
  playerFactions: [Faction.ENGLAND, Faction.FRANCE, Faction.HOLY_ROMAN_EMPIRE, Faction.VIKING, Faction.BYZANTIUM],
  recommendedFaction: Faction.ENGLAND,
  chapters: [chapter1],
  order: 1,
};

export const CAMPAIGN_CHAPTERS: Chapter[] = [chapter1];
export const CAMPAIGN_SCENARIOS: Scenario[] = [scenarioHundredYearsWar];
export const CAMPAIGN_LEVELS: Level[] = CAMPAIGN_CHAPTERS.flatMap((chapter) => chapter.levels);

export function getScenarioById(scenarioId: string): Scenario | undefined {
  return CAMPAIGN_SCENARIOS.find((scenario) => scenario.id === scenarioId);
}

export function getLevelById(levelId: string): Level | undefined {
  return CAMPAIGN_LEVELS.find((level) => level.id === levelId);
}

export function getChapterById(chapterId: string): Chapter | undefined {
  return CAMPAIGN_CHAPTERS.find((chapter) => chapter.id === chapterId);
}

export function getChaptersByScenario(scenarioId: string): Chapter[] {
  return CAMPAIGN_CHAPTERS.filter((chapter) => chapter.scenarioId === scenarioId);
}
