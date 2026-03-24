import { pgTable, serial, timestamp, text, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 卡牌表
export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // 卡牌名称
  cost: integer("cost").notNull().default(0), // 费用/资源

  // 基本属性
  faction: text("faction", { enum: ["ENGLAND", "FRANCE", "HRE", "VIKING", "BYZANTIUM", "NEUTRAL"] }).notNull(), // 阵营
  type: text("type", { enum: ["UNIT", "TACTIC", "BUILDING"] }).notNull(), // 卡牌类型
  rarity: text("rarity", { enum: ["COMMON", "RARE", "EPIC", "LEGENDARY"] }).notNull(), // 稀有度

  // 文本描述
  description: text("description"), // 卡牌描述
  flavorText: text("flavor_text"), // 趣味文本

  // 游戏属性（仅 UNIT 类型）
  attack: integer("attack"), // 攻击力
  health: integer("health"), // 生命值
  movement: integer("movement"), // 移动力

  // 建筑属性（仅 BUILDING 类型）
  durability: integer("durability"), // 耐久度
  ability: text("ability"), // 能力描述

  // 时间戳
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 卡牌类型
export type CardType = "UNIT" | "TACTIC" | "BUILDING";
// 阵营类型
export type FactionType = "ENGLAND" | "FRANCE" | "HRE" | "VIKING" | "BYZANTIUM" | "NEUTRAL";
// 稀有度类型
export type RarityType = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
