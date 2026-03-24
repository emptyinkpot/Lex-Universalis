import { db } from '../storage/database/shared/db';
import { cards } from '../storage/database/shared/schema';
import { MOON_CARDS } from './moon-cards.generated';

function cardKey(card: { name: string; type: string; faction: string }) {
  return `${card.name}|${card.type}|${card.faction}`.toLowerCase();
}

export async function seedMoonCards() {
  const existing = await db.select({
    name: cards.name,
    type: cards.type,
    faction: cards.faction,
  }).from(cards);

  const known = new Set(existing.map((card) => cardKey(card)));
  const missing = MOON_CARDS.filter((card) => !known.has(cardKey(card)));

  if (missing.length === 0) {
    return {
      inserted: 0,
      skipped: MOON_CARDS.length,
    };
  }

  const insertedRows = missing.map((card) => {
    const normalized = card as any;
    return {
      name: normalized.name,
      cost: normalized.cost ?? 0,
      faction: normalized.faction,
      type: normalized.type,
      rarity: normalized.rarity,
      description: normalized.description ?? '',
      flavorText: normalized.flavorText ?? null,
      attack: normalized.attack ?? null,
      health: normalized.health ?? null,
      movement: normalized.movement ?? null,
      durability: normalized.durability ?? null,
      ability: normalized.ability ?? null,
    };
  });

  await db.insert(cards).values(insertedRows);

  return {
    inserted: insertedRows.length,
    skipped: MOON_CARDS.length - insertedRows.length,
  };
}
