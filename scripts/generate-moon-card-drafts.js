const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'server', 'src', 'data', 'moon-cards.generated.ts');
const outputPath = path.join(root, 'client', 'data', 'moon-card-drafts.ts');

let src = fs.readFileSync(sourcePath, 'utf8');
src = src.replace(/^\uFEFF?import type[\s\S]*?;\r?\n/, '');
src = src.replace(/export const MOON_CARDS: AnyCard\[\] = /, 'const MOON_CARDS = ');
src = src.replace(/\] as unknown as AnyCard\[\];\s*$/, '];');
src += '\nmodule.exports = { MOON_CARDS };\n';

const sandbox = { module: { exports: {} }, exports: {}, require, console };
vm.createContext(sandbox);
vm.runInContext(src, sandbox, { filename: sourcePath });

const moonCards = sandbox.module.exports.MOON_CARDS || sandbox.exports.MOON_CARDS;
if (!Array.isArray(moonCards)) {
  throw new Error('Failed to load moon cards from source data.');
}

const pickRarity = (card) => {
  const rarity = String(card.rarity || 'COMMON').toUpperCase();
  return ['COMMON', 'RARE', 'EPIC', 'LEGENDARY'].includes(rarity) ? rarity : 'COMMON';
};

const pickFactionEnum = (card) => {
  const faction = String(card.faction || 'FRANCE').toUpperCase();
  if (faction === 'HRE') return 'HOLY_ROMAN_EMPIRE';
  if (['ENGLAND', 'FRANCE', 'HOLY_ROMAN_EMPIRE', 'VIKING', 'BYZANTIUM'].includes(faction)) return faction;
  return 'FRANCE';
};

const pickUnitType = (card) => {
  const text = `${card.name || ''} ${card.description || ''} ${card.ability || ''}`;
  if (/[箭弓]/.test(text)) return 'ARCHER';
  if (/[骑馬马]/.test(text)) return 'CAVALRY';
  if (/[塔械机石像城]/.test(text)) return 'SIEGE';
  return 'INFANTRY';
};

const pickTacticType = (card) => {
  const text = `${card.description || ''} ${card.ability || ''}`;
  if (text.includes('装备') || text.includes('道具')) return 'EQUIPMENT';
  if (text.includes('持续') || text.includes('每回合') || text.includes('回合开始') || text.includes('回合结束') || text.includes('长')) {
    return 'ONGOING';
  }
  return 'INSTANT';
};

const pickBuildingType = (card) => {
  const text = `${card.description || ''} ${card.ability || ''}`;
  if (text.includes('经济') || text.includes('资源') || text.includes('摸牌') || text.includes('抽取')) return 'ECONOMIC';
  if (text.includes('防御') || text.includes('护盾') || text.includes('减伤') || text.includes('不可被攻击')) return 'DEFENSE';
  return 'MILITARY';
};

const splitAbilityLines = (text) => {
  const raw = String(text || '').trim();
  if (!raw) return [];
  return raw
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((description) => {
      const idx = description.search(/[:：]/);
      const value = idx > 0 ? description.slice(0, idx).trim() : '';
      const label = idx > 0 ? description.slice(idx + 1).trim() : description;
      return {
        type: value ? value.toUpperCase().replace(/[^A-Z0-9_]+/g, '_') : 'CUSTOM',
        value,
        description: label || description,
      };
    });
};

const toStringOrEmpty = (value) => String(value ?? '');

const drafts = moonCards.map((card, index) => {
  const type = toStringOrEmpty(card.type || 'UNIT').toUpperCase();
  const sourceCategory = toStringOrEmpty(card.sourceCategory || 'character');
  const sourceFile = toStringOrEmpty(card.sourceFile || 'unknown');
  const description = toStringOrEmpty(card.description || card.ability || '').trim();
  const ability = toStringOrEmpty(card.ability || '').trim();

  return {
    id: `moon-${String(index + 1).padStart(3, '0')}`,
    name: toStringOrEmpty(card.name || `月球卡 ${index + 1}`),
    cost: Number.isFinite(Number(card.cost)) ? Number(card.cost) : 0,
    faction: pickFactionEnum(card),
    type,
    rarity: pickRarity(card),
    description,
    flavorText: toStringOrEmpty(card.flavorText || '').trim(),
    imageUrl: '',
    attack: card.attack === null || card.attack === undefined ? null : Number(card.attack),
    health: card.health === null || card.health === undefined ? null : Number(card.health),
    movement: card.movement === null || card.movement === undefined ? null : Number(card.movement),
    durability: card.durability === null || card.durability === undefined ? null : Number(card.durability),
    effect: type === 'UNIT' ? '' : (ability || description),
    duration: card.duration === null || card.duration === undefined ? null : Number(card.duration),
    unitType: type === 'UNIT' ? pickUnitType(card) : 'INFANTRY',
    tacticType: type === 'TACTIC' ? pickTacticType(card) : 'INSTANT',
    buildingType: type === 'BUILDING' ? pickBuildingType(card) : 'MILITARY',
    abilities: type === 'UNIT' ? splitAbilityLines(ability) : [],
    notes: [
      '粗坯定位：来自月球设计资料，已并入卡编辑器，可直接继续编辑。',
      `来源：${sourceCategory} / ${sourceFile}`,
    ].join('\n'),
    sourceCategory,
    sourceFile,
    localOnly: true,
    needsSync: false,
    updatedAt: Date.now(),
  };
});

const escape = (value) => JSON.stringify(value);

const lines = [];
lines.push("import { BuildingType, CardType, Faction, TacticType, UnitType } from '@/types/game';");
lines.push('');
lines.push("type MoonCardRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';");
lines.push('');
lines.push('type MoonAbilityDraft = {');
lines.push('  type: string;');
lines.push('  value: string;');
lines.push('  description: string;');
lines.push('};');
lines.push('');
lines.push('export type MoonCardDraftSeed = {');
lines.push('  id: string;');
lines.push('  name: string;');
lines.push('  cost: number;');
lines.push('  faction: Faction;');
lines.push('  type: CardType;');
lines.push('  rarity: MoonCardRarity;');
lines.push('  description: string;');
lines.push('  flavorText: string;');
lines.push('  imageUrl: string;');
lines.push('  attack: number | null;');
lines.push('  health: number | null;');
lines.push('  movement: number | null;');
lines.push('  durability: number | null;');
lines.push('  effect: string;');
lines.push('  duration: number | null;');
lines.push('  unitType: UnitType;');
lines.push('  tacticType: TacticType;');
lines.push('  buildingType: BuildingType;');
lines.push('  abilities: MoonAbilityDraft[];');
lines.push('  notes: string;');
lines.push('  sourceCategory: string;');
lines.push('  sourceFile: string;');
lines.push('};');
lines.push('');
lines.push('export const MOON_CARD_DRAFTS: MoonCardDraftSeed[] = [');

for (const card of drafts) {
  lines.push('  {');
  lines.push(`    id: ${escape(card.id)},`);
  lines.push(`    name: ${escape(card.name)},`);
  lines.push(`    cost: ${card.cost},`);
  lines.push(`    faction: Faction.${card.faction},`);
  lines.push(`    type: CardType.${card.type},`);
  lines.push(`    rarity: ${escape(card.rarity)},`);
  lines.push(`    description: ${escape(card.description)},`);
  lines.push(`    flavorText: ${escape(card.flavorText)},`);
  lines.push(`    imageUrl: ${escape(card.imageUrl)},`);
  lines.push(`    attack: ${card.attack === null ? 'null' : card.attack},`);
  lines.push(`    health: ${card.health === null ? 'null' : card.health},`);
  lines.push(`    movement: ${card.movement === null ? 'null' : card.movement},`);
  lines.push(`    durability: ${card.durability === null ? 'null' : card.durability},`);
  lines.push(`    effect: ${escape(card.effect)},`);
  lines.push(`    duration: ${card.duration === null ? 'null' : card.duration},`);
  lines.push(`    unitType: UnitType.${card.unitType},`);
  lines.push(`    tacticType: TacticType.${card.tacticType},`);
  lines.push(`    buildingType: BuildingType.${card.buildingType},`);
  lines.push('    abilities: [');
  for (const ability of card.abilities) {
    lines.push('      {');
    lines.push(`        type: ${escape(ability.type)},`);
    lines.push(`        value: ${escape(ability.value)},`);
    lines.push(`        description: ${escape(ability.description)},`);
    lines.push('      },');
  }
  lines.push('    ],');
  lines.push(`    notes: ${escape(card.notes)},`);
  lines.push(`    sourceCategory: ${escape(card.sourceCategory)},`);
  lines.push(`    sourceFile: ${escape(card.sourceFile)},`);
  lines.push('  },');
}

lines.push('];');
lines.push('');

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, lines.join('\r\n'), 'utf8');
console.log(`Wrote ${drafts.length} moon draft cards to ${outputPath}`);
