import express from 'express';
import { INITIAL_CARDS } from '../data/cards';
import { CAMPAIGN_CHAPTERS, CAMPAIGN_LEVELS, CAMPAIGN_SCENARIOS, getChapterById, getLevelById, getScenarioById, getChaptersByScenario } from '../data/campaign';
import { MOON_CARDS } from '../data/moon-cards.generated';
import type { Ability, Card, Position } from '../types/game';
import { Faction, CardType, GamePhase, ActionType } from '../types/game';
import { cards } from '../storage/database/shared/schema';
import { db } from '../storage/database/shared/db';
import { eq } from 'drizzle-orm';

// 本地定义接口（避免循环导入）
interface BattlefieldUnit {
  cardId: string;
  id: string;
  position: Position;
  attack: number;
  health: number;
  maxHealth: number;
  abilities: Ability[];
  hasAttacked: boolean;
  hasMoved: boolean;
}

interface Battlefield {
  rows: number;
  cols: number;
  units: Map<string, BattlefieldUnit>;
}

interface PlayerResources {
  gold: number;
  influence: number;
  morale: number;
}

interface PlayerState {
  id: string;
  name: string;
  faction: Faction;
  health: number;
  resources: PlayerResources;
  hand: Card[];
  deck: Card[];
  graveyard: Card[];
  battlefield: Battlefield;
  canPlayCard: boolean;
}

interface GameState {
  id: string;
  player1: PlayerState;
  player2: PlayerState;
  currentTurn: number;
  currentPlayer: 'player1' | 'player2';
  phase: GamePhase;
  winner: 'player1' | 'player2' | null;
  isGameOver: boolean;
}

interface PlayerAction {
  type: ActionType;
  playerId: string;
  cardId?: string;
  targetPosition?: Position;
  attackerId?: string;
  targetId?: string;
  timestamp: number;
}

const router = express.Router();

function createDefaultCampaignProgress(userId: string) {
  const firstChapter = CAMPAIGN_CHAPTERS[0];
  const firstLevel = CAMPAIGN_LEVELS[0];

  return {
    userId,
    currentChapter: firstChapter?.id ?? '',
    currentLevel: firstLevel?.id ?? '',
    completedLevels: [],
    totalStars: 0,
    unlockedChapters: firstChapter ? [firstChapter.id] : [],
    lastPlayedAt: Date.now(),
  };
}

type ApiCard = {
  id: string;
  name: string;
  cost: number;
  faction: string;
  type: string;
  rarity: string;
  description: string;
  flavorText: string | null;
  attack: number | null;
  health: number | null;
  movement: number | null;
  durability: number | null;
  ability: string | null;
};

function toApiCard(card: any, fallbackId?: string): ApiCard {
  return {
    id: String(card.id ?? fallbackId ?? card.name),
    name: String(card.name ?? ''),
    cost: Number(card.cost ?? 0),
    faction: String(card.faction ?? 'BYZANTIUM'),
    type: String(card.type ?? 'TACTIC'),
    rarity: String(card.rarity ?? 'COMMON'),
    description: String(card.description ?? ''),
    flavorText: card.flavorText ?? null,
    attack: card.attack ?? null,
    health: card.health ?? null,
    movement: card.movement ?? null,
    durability: card.durability ?? null,
    ability: card.ability ?? null,
  };
}

function cardKey(card: { name: string; type: string; faction: string }) {
  return `${card.name}|${card.type}|${card.faction}`.toLowerCase();
}

function moonFallbackCards(): ApiCard[] {
  return MOON_CARDS.map((card) => toApiCard(card, `moon-${Buffer.from(card.name, 'utf8').toString('hex').slice(0, 16)}`));
}

let cachedCards: ApiCard[] | null = null;

async function loadCards(): Promise<ApiCard[]> {
  if (cachedCards) {
    return cachedCards;
  }

  try {
    const dbCards = await db.select().from(cards);
    const normalizedDbCards = dbCards.map((card: any) => toApiCard(card));
    const known = new Set(normalizedDbCards.map(cardKey));
    const moonCards = moonFallbackCards().filter((card) => !known.has(cardKey(card)));
    cachedCards = [...normalizedDbCards, ...moonCards];
    return cachedCards;
  } catch (error) {
    console.warn('Falling back to bundled moon cards:', error);
    cachedCards = moonFallbackCards();
    return cachedCards;
  }
}

// 存储游戏状态（实际应用中应该使用数据库）
const gameRooms = new Map<string, GameState>();

// 健康检查
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'game' });
});

/**
 * GET /api/v1/cards
 * 获取所有卡牌
 */
router.get('/cards', async (req, res) => {
  try {
    const formattedCards = await loadCards();

    res.status(200).json({
      success: true,
      data: formattedCards,
      count: formattedCards.length,
    });
  } catch (error) {
    console.error('鑾峰彇鍗＄墝澶辫触:', error);
    res.status(500).json({
      success: false,
      error: '鑾峰彇鍗＄墝澶辫触',
    });
  }
});

router.get('/cards/:id', async (req, res) => {
  try {
    const cardId = parseInt(req.params.id);
    const allCards = await loadCards();
    const formattedCard = Number.isNaN(cardId)
      ? allCards.find((card) => card.id === req.params.id)
      : allCards.find((card) => card.id === String(cardId));

    if (!formattedCard) {
      return res.status(404).json({
        success: false,
        error: '卡牌不存在',
      });
    }

    res.status(200).json({
      success: true,
      data: formattedCard,
    });
  } catch (error) {
    console.error('鑾峰彇鍗＄墝澶辫触:', error);
    res.status(500).json({
      success: false,
      error: '鑾峰彇鍗＄墝澶辫触',
    });
  }
});

router.put('/cards/:id', async (req, res) => {
  try {
    const cardId = parseInt(req.params.id);

    if (isNaN(cardId)) {
      return res.status(400).json({
        success: false,
        error: '无效的卡牌ID',
      });
    }

    // 验证必要字段
    const { name, cost, faction, type, rarity, description } = req.body;

    if (!name || cost === undefined || !faction || !type || !rarity || !description) {
      return res.status(400).json({
        success: false,
        error: '缺少必要字段',
      });
    }

    // 验证字段类型
    if (typeof cost !== 'number' || cost < 0) {
      return res.status(400).json({
        success: false,
        error: '法力消耗必须是非负数',
      });
    }

    if (!Object.values(Faction).includes(faction)) {
      return res.status(400).json({
        success: false,
        error: '无效的阵营',
      });
    }

    if (!Object.values(CardType).includes(type)) {
      return res.status(400).json({
        success: false,
        error: '无效的卡牌类型',
      });
    }

    // 检查卡牌是否存在
    const [existingCard] = await db.select().from(cards).where(eq(cards.id, cardId));
    if (!existingCard) {
      return res.status(404).json({
        success: false,
        error: '卡牌不存在',
      });
    }

    // 根据卡牌类型验证字段
    if (type === 'UNIT') {
      if (req.body.attack === undefined || req.body.health === undefined || req.body.movement === undefined) {
        return res.status(400).json({
          success: false,
          error: '单位卡牌必须包含攻击力、生命值和移动力',
        });
      }
    }

    if (type === 'BUILDING') {
      if (req.body.durability === undefined) {
        return res.status(400).json({
          success: false,
          error: '建筑卡牌必须包含耐久度',
        });
      }
    }

    // 更新卡牌数据
    const updateData: any = {
      name,
      cost,
      faction,
      type,
      rarity,
      description,
      flavorText: req.body.flavorText || null,
      attack: type === 'UNIT' ? req.body.attack : null,
      health: type === 'UNIT' ? req.body.health : null,
      movement: type === 'UNIT' ? req.body.movement : null,
      durability: type === 'BUILDING' ? req.body.durability : null,
      ability: (type === 'TACTIC' || type === 'BUILDING') ? req.body.ability : null,
    };

    await db.update(cards).set(updateData).where(eq(cards.id, cardId));

    // 返回更新后的卡牌
    const [updatedCard] = await db.select().from(cards).where(eq(cards.id, cardId));

    const formattedCard = {
      id: String(updatedCard.id),
      name: updatedCard.name,
      cost: updatedCard.cost,
      faction: updatedCard.faction,
      type: updatedCard.type,
      rarity: updatedCard.rarity,
      description: updatedCard.description,
      flavorText: updatedCard.flavorText,
      attack: updatedCard.attack,
      health: updatedCard.health,
      movement: updatedCard.movement,
      durability: updatedCard.durability,
      ability: updatedCard.ability,
    };

    res.status(200).json({
      success: true,
      data: formattedCard,
    });
  } catch (error) {
    console.error('更新卡牌失败:', error);
    res.status(500).json({
      success: false,
      error: '更新卡牌失败',
    });
  }
});

/**
 * POST /api/v1/cards
 * 创建新卡牌
 */
router.post('/cards', async (req, res) => {
  try {
    // 验证必要字段
    const { name, cost, faction, type, rarity, description } = req.body;

    if (!name || cost === undefined || !faction || !type || !rarity || !description) {
      return res.status(400).json({
        success: false,
        error: '缺少必要字段',
      });
    }

    // 验证字段类型
    if (typeof cost !== 'number' || cost < 0) {
      return res.status(400).json({
        success: false,
        error: '法力消耗必须是非负数',
      });
    }

    if (!Object.values(Faction).includes(faction)) {
      return res.status(400).json({
        success: false,
        error: '无效的阵营',
      });
    }

    if (!Object.values(CardType).includes(type)) {
      return res.status(400).json({
        success: false,
        error: '无效的卡牌类型',
      });
    }

    // 根据卡牌类型验证字段
    if (type === 'UNIT') {
      if (req.body.attack === undefined || req.body.health === undefined || req.body.movement === undefined) {
        return res.status(400).json({
          success: false,
          error: '单位卡牌必须包含攻击力、生命值和移动力',
        });
      }
    }

    if (type === 'BUILDING') {
      if (req.body.durability === undefined) {
        return res.status(400).json({
          success: false,
          error: '建筑卡牌必须包含耐久度',
        });
      }
    }

    // 创建卡牌数据
    const insertData: any = {
      name,
      cost,
      faction,
      type,
      rarity,
      description,
      flavorText: req.body.flavorText || null,
      attack: type === 'UNIT' ? req.body.attack : null,
      health: type === 'UNIT' ? req.body.health : null,
      movement: type === 'UNIT' ? req.body.movement : null,
      durability: type === 'BUILDING' ? req.body.durability : null,
      ability: (type === 'TACTIC' || type === 'BUILDING') ? req.body.ability : null,
    };

    const [newCard] = await db.insert(cards).values(insertData).returning();

    const formattedCard = {
      id: String(newCard.id),
      name: newCard.name,
      cost: newCard.cost,
      faction: newCard.faction,
      type: newCard.type,
      rarity: newCard.rarity,
      description: newCard.description,
      flavorText: newCard.flavorText,
      attack: newCard.attack,
      health: newCard.health,
      movement: newCard.movement,
      durability: newCard.durability,
      ability: newCard.ability,
    };

    res.status(201).json({
      success: true,
      data: formattedCard,
    });
  } catch (error) {
    console.error('创建卡牌失败:', error);
    res.status(500).json({
      success: false,
      error: '创建卡牌失败',
    });
  }
});

/**
 * DELETE /api/v1/cards/:id
 * 删除卡牌
 */
router.delete('/cards/:id', async (req, res) => {
  try {
    const cardId = parseInt(req.params.id);

    if (isNaN(cardId)) {
      return res.status(400).json({
        success: false,
        error: '无效的卡牌ID',
      });
    }

    // 检查卡牌是否存在
    const [existingCard] = await db.select().from(cards).where(eq(cards.id, cardId));
    if (!existingCard) {
      return res.status(404).json({
        success: false,
        error: '卡牌不存在',
      });
    }

    // 删除卡牌
    await db.delete(cards).where(eq(cards.id, cardId));

    res.status(200).json({
      success: true,
      message: '卡牌已删除',
    });
  } catch (error) {
    console.error('删除卡牌失败:', error);
    res.status(500).json({
      success: false,
      error: '删除卡牌失败',
    });
  }
});

/**
 * GET /api/v1/cards/faction/:faction
 * 根据阵营获取卡牌
 */
router.get('/cards/faction/:faction', async (req, res) => {
  try {
    const faction = req.params.faction.toUpperCase() as any;

    if (!Object.values(Faction).includes(faction as Faction)) {
      return res.status(400).json({
        success: false,
        error: '鏃犳晥鐨勯樀钀?',
      });
    }

    const formattedCards = (await loadCards()).filter((card) => card.faction === faction);

    res.status(200).json({
      success: true,
      data: formattedCards,
      count: formattedCards.length,
    });
  } catch (error) {
    console.error('鑾峰彇鍗＄墝澶辫触:', error);
    res.status(500).json({
      success: false,
      error: '鑾峰彇鍗＄墝澶辫触',
    });
  }
});

router.get('/cards/type/:type', async (req, res) => {
  try {
    const type = req.params.type.toUpperCase() as any;

    if (!Object.values(CardType).includes(type as CardType)) {
      return res.status(400).json({
        success: false,
        error: '鏃犳晥鐨勫崱鐗岀被鍨?',
      });
    }

    const formattedCards = (await loadCards()).filter((card) => card.type === type);

    res.status(200).json({
      success: true,
      data: formattedCards,
      count: formattedCards.length,
    });
  } catch (error) {
    console.error('鑾峰彇鍗＄墝澶辫触:', error);
    res.status(500).json({
      success: false,
      error: '鑾峰彇鍗＄墝澶辫触',
    });
  }
});

router.post('/battle/create', async (req, res) => {
  try {
    const { player1Name, player1Faction, player2Name, player2Faction } = req.body;

    if (!player1Name || !player1Faction || !player2Name || !player2Faction) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数',
      });
    }

    // 创建空战场
    const battlefield: Battlefield = {
      rows: 3,
      cols: 3,
      units: new Map(),
    };

    // 创建玩家资源
    const playerResources: PlayerResources = {
      gold: 1,
      influence: 0,
      morale: 100,
    };

    // 从数据库获取阵营卡牌
    const player1FactionCards = await db.select().from(cards).where(eq(cards.faction, player1Faction));
    const player1Cards = player1FactionCards.map((card: any) => ({
      id: String(card.id),
      name: card.name,
      cost: card.cost,
      faction: card.faction,
      type: card.type,
      rarity: card.rarity,
      description: card.description,
      flavorText: card.flavorText,
      attack: card.attack,
      health: card.health,
      movement: card.movement,
      durability: card.durability,
      ability: card.ability,
    }));

    // 创建初始手牌（抽5张）
    const playerHand = player1Cards.slice(0, 5);
    const playerDeck = [...player1Cards].slice(5);

    // 获取玩家2的阵营卡牌
    const player2FactionCards = await db.select().from(cards).where(eq(cards.faction, player2Faction));
    const player2Cards = player2FactionCards.map((card: any) => ({
      id: String(card.id),
      name: card.name,
      cost: card.cost,
      faction: card.faction,
      type: card.type,
      rarity: card.rarity,
      description: card.description,
      flavorText: card.flavorText,
      attack: card.attack,
      health: card.health,
      movement: card.movement,
      durability: card.durability,
      ability: card.ability,
    }));

    // 创建玩家状态
    const player1: PlayerState = {
      id: 'player1',
      name: player1Name,
      faction: player1Faction,
      health: 30,
      resources: { ...playerResources },
      hand: playerHand,
      deck: playerDeck,
      graveyard: [],
      battlefield: { ...battlefield },
      canPlayCard: true,
    };

    const player2: PlayerState = {
      id: 'player2',
      name: player2Name,
      faction: player2Faction,
      health: 30,
      resources: { ...playerResources },
      hand: [],
      deck: player2Cards,
      graveyard: [],
      battlefield: { ...battlefield },
      canPlayCard: false,
    };

    // 创建游戏状态
    const gameId = `game_${Date.now()}`;
    const gameState: GameState = {
      id: gameId,
      player1,
      player2,
      currentTurn: 1,
      currentPlayer: 'player1',
      phase: GamePhase.DRAW,
      winner: null,
      isGameOver: false,
    };

    // 存储游戏状态
    gameRooms.set(gameId, gameState);

    res.status(200).json({
      success: true,
      data: {
        gameId,
        gameState,
      },
    });
  } catch (error) {
    console.error('创建战斗失败:', error);
    res.status(500).json({
      success: false,
      error: '创建战斗失败',
    });
  }
});

/**
 * GET /api/v1/battle/:gameId
 * 获取战斗状态
 */
router.get('/battle/:gameId', (req, res) => {
  try {
    const { gameId } = req.params;
    const gameState = gameRooms.get(gameId);

    if (!gameState) {
      return res.status(404).json({
        success: false,
        error: '游戏不存在',
      });
    }

    res.status(200).json({
      success: true,
      data: gameState,
    });
  } catch (error) {
    console.error('获取战斗状态失败:', error);
    res.status(500).json({
      success: false,
      error: '获取战斗状态失败',
    });
  }
});

/**
 * POST /api/v1/battle/:gameId/action
 * 执行玩家操作
 */
router.post('/battle/:gameId/action', (req, res) => {
  try {
    const { gameId } = req.params;
    const action: PlayerAction = req.body;

    const gameState = gameRooms.get(gameId);

    if (!gameState) {
      return res.status(404).json({
        success: false,
        error: '游戏不存在',
      });
    }

    // 验证操作合法性
    if (action.playerId !== gameState.currentPlayer) {
      return res.status(400).json({
        success: false,
        error: '不是你的回合',
      });
    }

    // 处理不同类型的操作
    switch (action.type) {
      case ActionType.PLAY_CARD:
        // 处理出牌逻辑
        const currentPlayerState = gameState.currentPlayer === 'player1' ? gameState.player1 : gameState.player2;
        const cardIndex = currentPlayerState.hand.findIndex(c => c.id === action.cardId);
        
        if (cardIndex === -1) {
          return res.status(400).json({
            success: false,
            error: '卡牌不在手牌中',
          });
        }

        const card = currentPlayerState.hand[cardIndex];
        
        // 检查资源是否足够
        if (currentPlayerState.resources.gold < card.cost) {
          return res.status(400).json({
            success: false,
            error: '黄金不足',
          });
        }

        // 移除手牌
        currentPlayerState.hand.splice(cardIndex, 1);
        
        // 消耗资源
        currentPlayerState.resources.gold -= card.cost;

        // 如果是单位卡，部署到战场
        if (card.type === 'UNIT' && action.targetPosition) {
          const unitId = `unit_${Date.now()}_${Math.random()}`;
          const unit: BattlefieldUnit = {
            cardId: card.id,
            id: unitId,
            position: action.targetPosition,
            attack: (card as any).attack,
            health: (card as any).health,
            maxHealth: (card as any).health,
            abilities: (card as any).abilities,
            hasAttacked: false,
            hasMoved: false,
          };
          currentPlayerState.battlefield.units.set(unitId, unit);
        }

        break;

      case ActionType.END_TURN:
        // 结束回合逻辑
        gameState.currentPlayer = gameState.currentPlayer === 'player1' ? 'player2' : 'player1';
        gameState.currentTurn += 1;
        gameState.phase = GamePhase.DRAW;

        // 重置单位状态
        const nextPlayerState = gameState.currentPlayer === 'player1' ? gameState.player1 : gameState.player2;
        nextPlayerState.battlefield.units.forEach(unit => {
          unit.hasAttacked = false;
          unit.hasMoved = false;
        });

        // 增加资源
        nextPlayerState.resources.gold += 1;
        nextPlayerState.resources.influence += 1;

        break;

      default:
        return res.status(400).json({
          success: false,
          error: '不支持的操作类型',
        });
    }

    // 检查胜利条件
    if (gameState.player1.health <= 0) {
      gameState.winner = 'player2';
      gameState.isGameOver = true;
    } else if (gameState.player2.health <= 0) {
      gameState.winner = 'player1';
      gameState.isGameOver = true;
    }

    res.status(200).json({
      success: true,
      data: gameState,
    });
  } catch (error) {
    console.error('执行操作失败:', error);
    res.status(500).json({
      success: false,
      error: '执行操作失败',
    });
  }
});

// ===== 故事模式相关接口 =====

// 存储玩家战役进度（实际应用中应该使用数据库）
const campaignProgresses = new Map<string, any>();

/**
 * GET /api/v1/campaign/chapters
 * 获取所有章节
 */
router.get('/campaign/chapters', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: CAMPAIGN_CHAPTERS,
      count: CAMPAIGN_CHAPTERS.length,
    });
  } catch (error) {
    console.error('获取章节失败:', error);
    res.status(500).json({
      success: false,
      error: '获取章节失败',
    });
  }
});

/**
 * GET /api/v1/campaign/chapters/:chapterId
 * 获取单个章节详情
 */
router.get('/campaign/chapters/:chapterId', (req, res) => {
  try {
    const { chapterId } = req.params;
    const chapter = getChapterById(chapterId);
    
    if (!chapter) {
      return res.status(404).json({
        success: false,
        error: '章节不存在',
      });
    }

    res.status(200).json({
      success: true,
      data: chapter,
    });
  } catch (error) {
    console.error('获取章节失败:', error);
    res.status(500).json({
      success: false,
      error: '获取章节失败',
    });
  }
});

/**
 * GET /api/v1/campaign/levels/:levelId
 * 获取单个关卡详情
 */
router.get('/campaign/levels/:levelId', (req, res) => {
  try {
    const { levelId } = req.params;
    const level = getLevelById(levelId);
    
    if (!level) {
      return res.status(404).json({
        success: false,
        error: '关卡不存在',
      });
    }

    res.status(200).json({
      success: true,
      data: level,
    });
  } catch (error) {
    console.error('获取关卡失败:', error);
    res.status(500).json({
      success: false,
      error: '获取关卡失败',
    });
  }
});

/**
 * GET /api/v1/campaign/progress/:userId
 * 获取玩家故事进度
 */
router.get('/campaign/progress/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    let progress = campaignProgresses.get(userId);

    // 如果没有进度记录，创建初始进度
    if (!progress) {
      progress = createDefaultCampaignProgress(userId);
      campaignProgresses.set(userId, progress);
    }

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error('获取故事进度失败:', error);
    res.status(500).json({
      success: false,
      error: '获取故事进度失败',
    });
  }
});

/**
 * POST /api/v1/campaign/progress/:userId
 * 更新玩家故事进度
 */
router.post('/campaign/progress/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { levelId, completed, stars } = req.body;

    if (!levelId || typeof completed !== 'boolean' || typeof stars !== 'number') {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数',
      });
    }

    let progress = campaignProgresses.get(userId);

    // 如果没有进度记录，创建初始进度
    if (!progress) {
      progress = createDefaultCampaignProgress(userId);
      campaignProgresses.set(userId, progress);
    }

    // 如果关卡完成
    if (completed) {
      // 检查关卡是否已存在
      const existingLevelIndex = progress.completedLevels.findIndex(
        (l: any) => l.levelId === levelId
      );

      if (existingLevelIndex !== -1) {
        // 更新已有记录（取最高星级）
        if (stars > progress.completedLevels[existingLevelIndex].stars) {
          progress.totalStars -= progress.completedLevels[existingLevelIndex].stars;
          progress.completedLevels[existingLevelIndex].stars = stars;
          progress.completedLevels[existingLevelIndex].completedAt = Date.now();
          progress.totalStars += stars;
        }
      } else {
        // 添加新完成记录
        progress.completedLevels.push({
          levelId,
          completed: true,
          stars,
          completedAt: Date.now(),
        });
        progress.totalStars += stars;
      }

      // 获取当前关卡信息
      const currentLevel = getLevelById(levelId);
      if (currentLevel) {
        // 更新当前进度
        progress.currentLevel = levelId;

        // 检查是否解锁下一章
        const currentChapter = getChapterById(currentLevel.chapterId);
        if (currentChapter) {
          const isLastLevelInChapter =
            currentLevel.order === currentChapter.levels.length;

          if (isLastLevelInChapter && completed) {
            // 查找下一章
            const nextChapterOrder = currentChapter.order + 1;
            const nextChapter = CAMPAIGN_CHAPTERS.find(
              (ch) => ch.order === nextChapterOrder
            );

            if (nextChapter && !progress.unlockedChapters.includes(nextChapter.id)) {
              progress.unlockedChapters.push(nextChapter.id);
              progress.currentChapter = nextChapter.id;
              // 下一章第一个关卡
              if (nextChapter.levels.length > 0) {
                progress.currentLevel = nextChapter.levels[0].id;
              }
            }
          } else if (!isLastLevelInChapter) {
            // 解锁下一关
            const nextLevelInChapter = currentChapter.levels.find(
              (l) => l.order === currentLevel.order + 1
            );
            if (nextLevelInChapter) {
              progress.currentLevel = nextLevelInChapter.id;
            }
          }
        }
      }

      progress.lastPlayedAt = Date.now();
    }

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error('更新故事进度失败:', error);
    res.status(500).json({
      success: false,
      error: '更新故事进度失败',
    });
  }
});

// ===== 剧本相关接口 =====

/**
 * GET /api/v1/campaign/scenarios
 * 获取所有剧本
 */
router.get('/campaign/scenarios', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: CAMPAIGN_SCENARIOS,
      count: CAMPAIGN_SCENARIOS.length,
    });
  } catch (error) {
    console.error('获取剧本失败:', error);
    res.status(500).json({
      success: false,
      error: '获取剧本失败',
    });
  }
});

/**
 * GET /api/v1/campaign/scenarios/:scenarioId
 * 获取单个剧本详情
 */
router.get('/campaign/scenarios/:scenarioId', (req, res) => {
  try {
    const { scenarioId } = req.params;
    const scenario = getScenarioById(scenarioId);
    
    if (!scenario) {
      return res.status(404).json({
        success: false,
        error: '剧本不存在',
      });
    }

    res.status(200).json({
      success: true,
      data: scenario,
    });
  } catch (error) {
    console.error('获取剧本失败:', error);
    res.status(500).json({
      success: false,
      error: '获取剧本失败',
    });
  }
});

/**
 * GET /api/v1/campaign/scenarios/:scenarioId/chapters
 * 获取剧本下的所有章节
 */
router.get('/campaign/scenarios/:scenarioId/chapters', (req, res) => {
  try {
    const { scenarioId } = req.params;
    const chapters = getChaptersByScenario(scenarioId);
    
    res.status(200).json({
      success: true,
      data: chapters,
      count: chapters.length,
    });
  } catch (error) {
    console.error('获取剧本章节失败:', error);
    res.status(500).json({
      success: false,
      error: '获取剧本章节失败',
    });
  }
});

export default router;
