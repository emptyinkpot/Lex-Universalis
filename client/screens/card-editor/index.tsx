import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Modal, Platform, Pressable, RefreshControl, ScrollView, Share, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome6 } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FactionIcon } from '@/components/FactionIcon';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { MOON_CARD_DRAFTS, type MoonCardDraftSeed } from '@/data/moon-card-drafts';
import { BuildingType, CardType, Faction, TacticType, UnitType } from '@/types/game';
import { createStyles } from './styles';

/* eslint-disable reactnative/wrap-horizontal-scrollview-inside-view */

type CardRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
type AbilityDraft = { type: string; value: string; description: string };
type CardTemplate = {
  id: string;
  name: string;
  defaults: Omit<Partial<EditorCard>, 'id'>;
  createdAt: number;
  updatedAt: number;
};

type EditorCard = {
  id: string;
  name: string;
  cost: number;
  faction: Faction;
  type: CardType;
  rarity: CardRarity;
  description: string;
  flavorText: string;
  imageUrl: string;
  attack: number | null;
  health: number | null;
  movement: number | null;
  durability: number | null;
  effect: string;
  duration: number | null;
  unitType: UnitType;
  tacticType: TacticType;
  buildingType: BuildingType;
  abilities: AbilityDraft[];
  notes: string;
  localOnly: boolean;
  needsSync: boolean;
  updatedAt: number;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL ?? 'http://127.0.0.1:9091';
const STORAGE_KEY = 'lex-universalis.card-editor.cards.v1';
const TEMPLATE_STORAGE_KEY = 'lex-universalis.card-editor.templates.v1';
const MOON_DRAFT_STORAGE_KEY = 'lex-universalis.card-editor.moon-drafts.v1';
const tempId = () => `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const isNumericId = (value: string) => /^\d+$/.test(value);
const isMoonDraftId = (value: string) => value.startsWith('moon-');
const withAlpha = (hex: string, alpha: number) => {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return `rgba(0, 0, 0, ${alpha})`;
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const FACTION_OPTIONS = [
  { value: Faction.ENGLAND, label: '英格兰', icon: 'crown' },
  { value: Faction.FRANCE, label: '法兰西', icon: 'flag' },
  { value: Faction.HOLY_ROMAN_EMPIRE, label: '神罗', icon: 'landmark' },
  { value: Faction.VIKING, label: '维京', icon: 'helmet-battle' },
  { value: Faction.BYZANTIUM, label: '拜占庭', icon: 'church' },
] as const;

const TYPE_OPTIONS = [
  { value: CardType.UNIT, label: '单位', icon: 'chess-knight' },
  { value: CardType.TACTIC, label: '战术', icon: 'scroll' },
  { value: CardType.BUILDING, label: '建筑', icon: 'tower-observation' },
] as const;

const RARITY_OPTIONS: Array<{ value: CardRarity; label: string; color: string }> = [
  { value: 'COMMON', label: '普通', color: '#9CA3AF' },
  { value: 'RARE', label: '稀有', color: '#3B82F6' },
  { value: 'EPIC', label: '史诗', color: '#8B5CF6' },
  { value: 'LEGENDARY', label: '传说', color: '#F59E0B' },
];

const UNIT_TYPES = [
  { value: UnitType.INFANTRY, label: '步兵' },
  { value: UnitType.CAVALRY, label: '骑兵' },
  { value: UnitType.ARCHER, label: '弓手' },
  { value: UnitType.SIEGE, label: '攻城' },
] as const;

const TACTIC_TYPES = [
  { value: TacticType.INSTANT, label: '即时' },
  { value: TacticType.ONGOING, label: '持续' },
  { value: TacticType.EQUIPMENT, label: '装备' },
] as const;

const BUILDING_TYPES = [
  { value: BuildingType.ECONOMIC, label: '经济' },
  { value: BuildingType.MILITARY, label: '军事' },
  { value: BuildingType.DEFENSE, label: '防御' },
] as const;

function emptyCard(type: CardType = CardType.UNIT): EditorCard {
  return {
    id: tempId(),
    name: '',
    cost: 0,
    faction: Faction.ENGLAND,
    type,
    rarity: 'COMMON',
    description: '',
    flavorText: '',
    imageUrl: '',
    attack: type === CardType.UNIT ? 0 : null,
    health: type === CardType.UNIT ? 0 : null,
    movement: type === CardType.UNIT ? 0 : null,
    durability: type === CardType.BUILDING ? 0 : null,
    effect: '',
    duration: type === CardType.TACTIC ? 0 : null,
    unitType: UnitType.INFANTRY,
    tacticType: TacticType.INSTANT,
    buildingType: BuildingType.MILITARY,
    abilities: [],
    notes: '',
    localOnly: true,
    needsSync: true,
    updatedAt: Date.now(),
  };
}

function safeNumber(value: string, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseAbilities(text: string | null | undefined): AbilityDraft[] {
  if (!text) return [];
  const trimmed = text.trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => ({ type: String(item?.type ?? 'CUSTOM'), value: String(item?.value ?? ''), description: String(item?.description ?? '') }))
        .filter((item) => item.description.trim());
    }
  } catch {
    // ignore
  }
  return trimmed.split(/\r?\n|;+/).map((part) => part.trim()).filter(Boolean).map((description) => ({ type: 'CUSTOM', value: '', description }));
}

function serializeAbilities(card: EditorCard) {
  if (card.type === CardType.UNIT) return card.abilities.map((item) => item.description || item.type).filter(Boolean).join('\n');
  return [card.effect, card.duration !== null ? `持续 ${card.duration} 回合` : ''].filter(Boolean).join(' | ');
}

function normalizeApiCard(raw: any, fallback?: EditorCard): EditorCard {
  const base = fallback ?? emptyCard(raw?.type === CardType.BUILDING ? CardType.BUILDING : CardType.UNIT);
  const type = raw?.type === CardType.UNIT || raw?.type === CardType.TACTIC || raw?.type === CardType.BUILDING ? raw.type : base.type;
  return {
    ...base,
    id: String(raw?.id ?? base.id),
    name: String(raw?.name ?? base.name),
    cost: safeNumber(String(raw?.cost ?? base.cost), base.cost),
    faction: String(raw?.faction ?? base.faction) as Faction,
    type,
    rarity: String(raw?.rarity ?? base.rarity) as CardRarity,
    description: String(raw?.description ?? base.description),
    flavorText: String(raw?.flavorText ?? base.flavorText),
    imageUrl: String(raw?.imageUrl ?? base.imageUrl),
    attack: raw?.attack !== undefined ? Number(raw.attack) : base.attack,
    health: raw?.health !== undefined ? Number(raw.health) : base.health,
    movement: raw?.movement !== undefined ? Number(raw.movement) : base.movement,
    durability: raw?.durability !== undefined ? Number(raw.durability) : base.durability,
    effect: type === CardType.UNIT ? base.effect : String(raw?.ability ?? base.effect),
    duration: raw?.duration !== undefined ? Number(raw.duration) : base.duration,
    unitType: String(raw?.unitType ?? base.unitType) as UnitType,
    tacticType: String(raw?.tacticType ?? base.tacticType) as TacticType,
    buildingType: String(raw?.buildingType ?? base.buildingType) as BuildingType,
    abilities: type === CardType.UNIT ? (base.abilities.length > 0 ? base.abilities : parseAbilities(raw?.ability)) : [],
    notes: String(raw?.notes ?? base.notes),
    localOnly: base.localOnly,
    needsSync: base.needsSync,
    updatedAt: base.updatedAt,
  };
}

function stripRuntime(card: EditorCard) {
  const { localOnly, needsSync, ...rest } = card;
  return rest;
}

function buildPayload(card: EditorCard) {
  return {
    name: card.name.trim(),
    cost: card.cost,
    faction: card.faction,
    type: card.type,
    rarity: card.rarity,
    description: card.description.trim(),
    flavorText: card.flavorText.trim() || null,
    attack: card.type === CardType.UNIT ? card.attack : null,
    health: card.type === CardType.UNIT ? card.health : null,
    movement: card.type === CardType.UNIT ? card.movement : null,
    durability: card.type === CardType.BUILDING ? card.durability : null,
    ability: serializeAbilities(card) || null,
  };
}

function replaceCard(cards: EditorCard[], nextCard: EditorCard) {
  const index = cards.findIndex((item) => item.id === nextCard.id);
  if (index === -1) return [...cards, nextCard];
  const next = [...cards];
  next[index] = nextCard;
  return next;
}

function removeCard(cards: EditorCard[], id: string) {
  return cards.filter((item) => item.id !== id);
}

function EditorBadge({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <View style={{ backgroundColor: color, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 }}>
      <ThemedText variant="tiny" color="#FFFFFF">
        {label}
      </ThemedText>
    </View>
  );
}

function templateFromCard(card: EditorCard, name: string): CardTemplate {
  const { localOnly, needsSync, updatedAt, id, ...defaults } = card;
  return {
    id: tempId(),
    name,
    defaults,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function mergeTemplateIntoCard(baseCard: EditorCard, template?: CardTemplate | null): EditorCard {
  if (!template) return baseCard;
  const defaults = template.defaults;
  return {
    ...baseCard,
    name: baseCard.name || defaults.name || baseCard.name,
    cost: baseCard.cost || defaults.cost || 0,
    faction: baseCard.faction || defaults.faction || baseCard.faction,
    type: baseCard.type || defaults.type || baseCard.type,
    rarity: baseCard.rarity || defaults.rarity || baseCard.rarity,
    description: baseCard.description || defaults.description || '',
    flavorText: baseCard.flavorText || defaults.flavorText || '',
    imageUrl: baseCard.imageUrl || defaults.imageUrl || '',
    attack: baseCard.attack ?? defaults.attack ?? null,
    health: baseCard.health ?? defaults.health ?? null,
    movement: baseCard.movement ?? defaults.movement ?? null,
    durability: baseCard.durability ?? defaults.durability ?? null,
    effect: baseCard.effect || defaults.effect || '',
    duration: baseCard.duration ?? defaults.duration ?? null,
    unitType: baseCard.unitType || defaults.unitType || baseCard.unitType,
    tacticType: baseCard.tacticType || defaults.tacticType || baseCard.tacticType,
    buildingType: baseCard.buildingType || defaults.buildingType || baseCard.buildingType,
    abilities: baseCard.abilities.length > 0 ? baseCard.abilities : (defaults.abilities ?? []),
    notes: baseCard.notes || defaults.notes || '',
  };
}

function hydrateMoonDraft(seed: MoonCardDraftSeed): EditorCard {
  return {
    id: seed.id,
    name: seed.name,
    cost: seed.cost,
    faction: seed.faction,
    type: seed.type,
    rarity: seed.rarity,
    description: seed.description,
    flavorText: seed.flavorText,
    imageUrl: '',
    attack: seed.attack,
    health: seed.health,
    movement: seed.movement,
    durability: seed.durability,
    effect: seed.effect,
    duration: seed.duration,
    unitType: seed.unitType,
    tacticType: seed.tacticType,
    buildingType: seed.buildingType,
    abilities: seed.abilities.map((item) => ({ ...item })),
    notes: `${seed.notes}\n来源：${seed.sourceCategory} / ${seed.sourceFile}`,
    localOnly: true,
    needsSync: false,
    updatedAt: Date.now(),
  };
}

function mergeMoonDraftsIntoCards(cards: EditorCard[]) {
  const nextMap = new Map(cards.map((item) => [item.id, item]));
  const moonCards = MOON_CARD_DRAFTS.map((seed) => nextMap.get(seed.id) ?? hydrateMoonDraft(seed));
  const rest = cards.filter((item) => !isMoonDraftId(item.id));
  return [...moonCards, ...rest];
}
export default function CardEditorScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();

  const [cards, setCards] = useState<EditorCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [factionFilter, setFactionFilter] = useState<'ALL' | Faction>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | CardType>('ALL');
  const [rarityFilter, setRarityFilter] = useState<'ALL' | CardRarity>('ALL');
  const [editorVisible, setEditorVisible] = useState(false);
  const [editorMode, setEditorMode] = useState<'create' | 'edit' | 'template'>('create');
  const [draft, setDraft] = useState<EditorCard>(emptyCard());
  const [templates, setTemplates] = useState<CardTemplate[]>([]);
  const [templateVisible, setTemplateVisible] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [renamingTemplateId, setRenamingTemplateId] = useState<string | null>(null);
  const [renamingTemplateName, setRenamingTemplateName] = useState('');
  const [importVisible, setImportVisible] = useState(false);
  const [exportVisible, setExportVisible] = useState(false);
  const [importText, setImportText] = useState('');
  const [importTemplateId, setImportTemplateId] = useState<string>('none');
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');
  const [syncingAll, setSyncingAll] = useState(false);

  const selectedCard = useMemo(() => cards.find((item) => item.id === selectedId) ?? cards[0] ?? null, [cards, selectedId]);
  const exportJson = useMemo(() => JSON.stringify(cards.map(stripRuntime), null, 2), [cards]);

  const stats = useMemo(() => ({
    total: cards.length,
    pending: cards.filter((item) => item.needsSync).length,
    moon: cards.filter((item) => isMoonDraftId(item.id)).length,
    unit: cards.filter((item) => item.type === CardType.UNIT).length,
    tactic: cards.filter((item) => item.type === CardType.TACTIC).length,
    building: cards.filter((item) => item.type === CardType.BUILDING).length,
  }), [cards]);

  const filteredCards = useMemo(() => {
    const query = search.trim().toLowerCase();
    return cards.filter((item) => {
      if (factionFilter !== 'ALL' && item.faction !== factionFilter) return false;
      if (typeFilter !== 'ALL' && item.type !== typeFilter) return false;
      if (rarityFilter !== 'ALL' && item.rarity !== rarityFilter) return false;
      if (!query) return true;
      const haystack = [item.name, item.description, item.flavorText, item.effect, item.notes, item.abilities.map((ability) => ability.description).join(' ')].join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }, [cards, factionFilter, rarityFilter, search, typeFilter]);

  const loadCards = async () => {
    setLoading(true);
    try {
      const [response, cached, moonFlag] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/cards`),
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(MOON_DRAFT_STORAGE_KEY),
      ]);
      const cachedCards = cached ? (JSON.parse(cached) as EditorCard[]) : [];
      const cachedMap = new Map(cachedCards.map((item: EditorCard) => [item.id, item]));
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      const remoteCards = Array.isArray(result?.data) ? result.data : [];
      const merged = remoteCards.map((item: any) => normalizeApiCard(item, cachedMap.get(String(item.id))));
      const remoteIds = new Set(merged.map((item: any) => item.id));
      const extras = cachedCards.filter((item: EditorCard) => !remoteIds.has(item.id));
      let next = [...merged, ...extras];
      const hasMoonDrafts = next.some((item) => isMoonDraftId(item.id));
      if (hasMoonDrafts) {
        if (moonFlag !== 'true') {
          await AsyncStorage.setItem(MOON_DRAFT_STORAGE_KEY, 'true');
        }
      } else if (moonFlag !== 'true') {
        next = mergeMoonDraftsIntoCards(next);
        await AsyncStorage.setItem(MOON_DRAFT_STORAGE_KEY, 'true');
      }
      setCards(next);
      const preferred = next.find((item) => isMoonDraftId(item.id)) ?? next[0] ?? null;
      setSelectedId(preferred?.id ?? null);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.error('加载卡牌失败:', error);
      const cached = await AsyncStorage.getItem(STORAGE_KEY);
      if (cached) {
        const cachedCards = JSON.parse(cached) as EditorCard[];
        const cachedMoonFlag = await AsyncStorage.getItem(MOON_DRAFT_STORAGE_KEY);
        let next = cachedCards;
        const hasMoonDrafts = next.some((item) => isMoonDraftId(item.id));
        if (hasMoonDrafts) {
          if (cachedMoonFlag !== 'true') {
            await AsyncStorage.setItem(MOON_DRAFT_STORAGE_KEY, 'true');
          }
        } else if (cachedMoonFlag !== 'true') {
          next = mergeMoonDraftsIntoCards(next);
          await AsyncStorage.setItem(MOON_DRAFT_STORAGE_KEY, 'true');
        }
        setCards(next);
        const preferred = next.find((item) => isMoonDraftId(item.id)) ?? next[0] ?? null;
        setSelectedId(preferred?.id ?? null);
      } else {
        Alert.alert('加载失败', '服务器和本地缓存都没有卡牌数据。');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(TEMPLATE_STORAGE_KEY)
      .then((value) => {
        if (!value) return;
        const parsed = JSON.parse(value) as CardTemplate[];
        setTemplates(Array.isArray(parsed) ? parsed : []);
      })
      .catch((error) => {
        console.error('加载模板失败:', error);
      });
  }, []);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cards)).catch((error) => {
        console.error('保存本地缓存失败:', error);
      });
    }
  }, [cards, loading]);

  useEffect(() => {
    AsyncStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates)).catch((error) => {
      console.error('保存模板失败:', error);
    });
  }, [templates]);

  const openCreate = (type: CardType = CardType.UNIT) => {
    setEditorMode('create');
    setDraft(emptyCard(type));
    setTemplateName('');
    setEditingTemplateId(null);
    setEditorVisible(true);
  };

  const openEdit = (card: EditorCard) => {
    setEditorMode('edit');
    setDraft({ ...card, abilities: card.abilities.map((item) => ({ ...item })) });
    setTemplateName(card.name);
    setEditingTemplateId(null);
    setEditorVisible(true);
  };

  const saveTemplate = () => {
    const name = templateName.trim() || `${draft.name || '未命名'} 模板`;
    const nextTemplate = templateFromCard(draft, name);
    setTemplates((current) => {
      if (editorMode === 'template' && editingTemplateId) {
        return current.map((item) => (item.id === editingTemplateId ? { ...item, ...nextTemplate, id: item.id, name } : item));
      }
      const existingIndex = current.findIndex((item) => item.name === name);
      if (existingIndex === -1) return [nextTemplate, ...current];
      const next = [...current];
      next[existingIndex] = { ...current[existingIndex], ...nextTemplate, id: current[existingIndex].id, name };
      return next;
    });
    setTemplateName(name);
    setEditingTemplateId(null);
    if (editorMode === 'template') {
      setEditorVisible(false);
    }
    Alert.alert('模板已保存', `模板「${name}」已加入模板库。`);
  };

  const openTemplateEditor = (template: CardTemplate) => {
    setEditorMode('template');
    setDraft(mergeTemplateIntoCard(emptyCard(template.defaults.type ?? CardType.UNIT), template));
    setTemplateName(template.name);
    setEditingTemplateId(template.id);
    setEditorVisible(true);
  };

  const openTemplateRename = (template: CardTemplate) => {
    setRenamingTemplateId(template.id);
    setRenamingTemplateName(template.name);
  };

  const saveTemplateRename = () => {
    const nextName = renamingTemplateName.trim();
    if (!nextName) {
      Alert.alert('名称不能为空', '请输入一个模板名称。');
      return;
    }
    if (!renamingTemplateId) return;
    setTemplates((current) => current.map((item) => (item.id === renamingTemplateId ? { ...item, name: nextName, updatedAt: Date.now() } : item)));
    setRenamingTemplateId(null);
    setRenamingTemplateName('');
  };

  const exportTemplate = async (template: CardTemplate) => {
    const payload = JSON.stringify(template, null, 2);
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(payload);
      } else {
        await Share.share({ message: payload });
      }
      Alert.alert('已导出', `模板「${template.name}」的 JSON 已复制/分享。`);
    } catch (error) {
      console.error('导出模板失败:', error);
      Alert.alert('导出失败', '模板 JSON 无法复制到剪贴板。');
    }
  };

  const applyTemplateToDraft = (templateId: string) => {
    if (templateId === 'none') return;
    const template = templates.find((item) => item.id === templateId);
    if (!template) return;
    setDraft((current) => mergeTemplateIntoCard(current, template));
  };

  const updateDraft = <K extends keyof EditorCard>(key: K, value: EditorCard[K]) => {
    setDraft((current) => ({ ...current, [key]: value, updatedAt: Date.now() }));
  };

  const addAbility = () => {
    setDraft((current) => ({ ...current, abilities: [...current.abilities, { type: 'CUSTOM', value: '', description: '' }], updatedAt: Date.now() }));
  };

  const updateAbility = (index: number, field: keyof AbilityDraft, value: string) => {
    setDraft((current) => ({
      ...current,
      abilities: current.abilities.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
      updatedAt: Date.now(),
    }));
  };

  const removeAbility = (index: number) => {
    setDraft((current) => ({ ...current, abilities: current.abilities.filter((_, itemIndex) => itemIndex !== index), updatedAt: Date.now() }));
  };

  const saveCard = async () => {
    const cleaned: EditorCard = {
      ...draft,
      name: draft.name.trim(),
      description: draft.description.trim(),
      flavorText: draft.flavorText.trim(),
      imageUrl: draft.imageUrl.trim(),
      notes: draft.notes.trim(),
      updatedAt: Date.now(),
      needsSync: true,
      localOnly: draft.localOnly || editorMode === 'create' || !isNumericId(draft.id),
    };

    if (!cleaned.name) {
      Alert.alert('无法保存', '卡牌名称不能为空。');
      return;
    }

    const optimistic = editorMode === 'edit' ? cards.map((item) => (item.id === draft.id ? cleaned : item)) : [...cards, cleaned];
    setCards(optimistic);
    setSelectedId(cleaned.id);
    setEditorVisible(false);

    try {
      const url = editorMode === 'edit' && isNumericId(draft.id) ? `${API_BASE_URL}/api/v1/cards/${draft.id}` : `${API_BASE_URL}/api/v1/cards`;
      const method = editorMode === 'edit' && isNumericId(draft.id) ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(cleaned)),
      });
      const result = await response.json();
      if (!response.ok || !result?.success) throw new Error(result?.error || `HTTP ${response.status}`);
      const synced = normalizeApiCard(result.data, cleaned);
      synced.id = String(result.data?.id ?? cleaned.id);
      synced.localOnly = false;
      synced.needsSync = false;
      synced.updatedAt = Date.now();
      const next = editorMode === 'edit' ? replaceCard(cards, synced) : replaceCard(optimistic.filter((item) => item.id !== cleaned.id), synced);
      setCards(next);
      setSelectedId(synced.id);
    } catch (error) {
      console.error('保存失败:', error);
      Alert.alert('已保存到本地', '服务器同步失败，稍后可点击同步待处理按钮。');
      setCards((current) => current.map((item) => (item.id === cleaned.id ? { ...item, localOnly: true, needsSync: true } : item)));
    }
  };

  const deleteCard = (card: EditorCard) => {
    Alert.alert('删除卡牌', `确认删除「${card.name}」吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          setCards((current) => removeCard(current, card.id));
          setSelectedId((current) => (current === card.id ? null : current));
          if (!isNumericId(card.id)) return;
          try {
            const response = await fetch(`${API_BASE_URL}/api/v1/cards/${card.id}`, { method: 'DELETE' });
            const result = await response.json();
            if (!response.ok || !result?.success) throw new Error(result?.error || `HTTP ${response.status}`);
          } catch (error) {
            console.error('删除服务器卡牌失败:', error);
            Alert.alert('本地删除完成', '服务器端删除失败，稍后可以重新同步。');
          }
        },
      },
    ]);
  };
  const duplicateCard = (card: EditorCard) => {
    const copy: EditorCard = { ...card, id: tempId(), name: `${card.name} 副本`, localOnly: true, needsSync: true, updatedAt: Date.now() };
    const next = [...cards, copy];
    setCards(next);
    setSelectedId(copy.id);
    setEditorMode('edit');
    setDraft(copy);
    setEditorVisible(true);
  };

  const syncPending = async () => {
    setSyncingAll(true);
    try {
      const next = [...cards];
      for (let i = 0; i < next.length; i += 1) {
        const card = next[i];
        if (!card.needsSync && isNumericId(card.id)) continue;
        const response = await fetch(isNumericId(card.id) ? `${API_BASE_URL}/api/v1/cards/${card.id}` : `${API_BASE_URL}/api/v1/cards`, {
          method: isNumericId(card.id) ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buildPayload(card)),
        });
        const result = await response.json();
        if (!response.ok || !result?.success) throw new Error(result?.error || `HTTP ${response.status}`);
        const synced = normalizeApiCard(result.data, card);
        synced.id = String(result.data?.id ?? card.id);
        synced.localOnly = false;
        synced.needsSync = false;
        synced.updatedAt = Date.now();
        next[i] = synced;
      }
      setCards(next);
      Alert.alert('同步完成', '所有待处理卡牌都已同步到服务器。');
    } catch (error) {
      console.error('同步失败:', error);
      Alert.alert('同步失败', '至少有一张卡牌没有成功写入服务器。');
    } finally {
      setSyncingAll(false);
    }
  };

  const performImport = async (syncNow: boolean) => {
    try {
      const parsed = JSON.parse(importText.trim());
      const incoming = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.cards) ? parsed.cards : null;
      if (!incoming) throw new Error('JSON 必须是数组，或者包含 cards 字段。');
      const selectedTemplate = templates.find((item) => item.id === importTemplateId) ?? null;
      const importedCards = incoming.map((item: any) => {
        const card = normalizeApiCard(item, emptyCard(item?.type));
        const merged = mergeTemplateIntoCard(card, selectedTemplate);
        return {
          ...merged,
          id: importMode === 'append' ? tempId() : merged.id,
          localOnly: !syncNow,
          needsSync: !syncNow,
          updatedAt: Date.now(),
        };
      });
      const next = importMode === 'append' ? [...cards, ...importedCards] : importedCards;
      setCards(next);
      setSelectedId(next[0]?.id ?? null);
      setImportVisible(false);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      if (syncNow) setTimeout(() => { syncPending(); }, 0);
    } catch (error) {
      console.error('导入失败:', error);
      Alert.alert('导入失败', '请确认 JSON 格式正确。');
    }
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates((current) => current.filter((item) => item.id !== templateId));
  };

  const restoreMoonDrafts = async () => {
    const next = mergeMoonDraftsIntoCards(cards);
    setCards(next);
    const preferred = next.find((item) => isMoonDraftId(item.id)) ?? next[0] ?? null;
    setSelectedId(preferred?.id ?? null);
    await AsyncStorage.setItem(MOON_DRAFT_STORAGE_KEY, 'true');
    Alert.alert('月球毛坯已注入', `已将 ${MOON_CARD_DRAFTS.length} 张月球卡并入编辑器。`);
  };

  const createCardFromTemplate = (template: CardTemplate) => {
    setEditorMode('create');
    setDraft(mergeTemplateIntoCard(emptyCard(template.defaults.type ?? CardType.UNIT), template));
    setTemplateName(template.name);
    setTemplateVisible(false);
    setEditorVisible(true);
  };

  const renderChip = (label: string, active: boolean, onPress: () => void, color?: string) => (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive, { backgroundColor: active ? color ?? theme.primary : theme.backgroundTertiary, borderColor: active ? color ?? theme.primary : theme.borderLight }]}>
      <ThemedText variant="small" color={active ? '#FFFFFF' : theme.textPrimary}>{label}</ThemedText>
    </Pressable>
  );

  const renderCardTile = (card: EditorCard) => {
    const active = selectedCard?.id === card.id;
    const rarityColor = RARITY_OPTIONS.find((item) => item.value === card.rarity)?.color ?? theme.primary;
    const factionColor = {
      [Faction.ENGLAND]: '#1D4ED8',
      [Faction.FRANCE]: '#B91C1C',
      [Faction.HOLY_ROMAN_EMPIRE]: '#B45309',
      [Faction.VIKING]: '#0F766E',
      [Faction.BYZANTIUM]: '#6D28D9',
    }[card.faction] ?? theme.primary;
    const typeIcon = card.type === CardType.UNIT ? 'chess-knight' : card.type === CardType.TACTIC ? 'scroll' : 'tower-observation';
    return (
      <Pressable key={card.id} onPress={() => setSelectedId(card.id)} style={[styles.cardTile, active && styles.cardTileActive]}>
        <View style={[styles.cardTileFace, { borderColor: active ? theme.primary : theme.borderLight }]}>
          <View style={[styles.cardTileBackdrop, { backgroundColor: withAlpha(factionColor, 0.12) }]} />
          <View style={styles.cardTileFaceContent}>
            <View style={styles.cardTileTopBar}>
              <View style={[styles.cardTileCostOrb, { borderColor: rarityColor, backgroundColor: withAlpha(factionColor, 0.16) }]}>
                <ThemedText variant="smallMedium" color={theme.textPrimary}>{card.cost}</ThemedText>
                <ThemedText variant="tiny" color={theme.textMuted}>费</ThemedText>
              </View>
              <View style={styles.cardTileTopMeta}>
                {isMoonDraftId(card.id) ? <EditorBadge color="#7C3AED" label="月球毛坯" /> : null}
                <EditorBadge color={factionColor} label={card.faction} />
                <EditorBadge color={rarityColor} label={card.rarity} />
              </View>
            </View>

            <View style={[styles.cardTileArtwork, { borderColor: factionColor }]}>
              {card.imageUrl ? (
                <Image source={{ uri: card.imageUrl }} style={styles.cardTileArtworkImage} resizeMode="cover" />
              ) : (
                <View style={[styles.cardTileArtworkPlaceholder, { backgroundColor: withAlpha(factionColor, 0.08) }]}>
                  <FactionIcon faction={card.faction} size={48} />
                  <ThemedText variant="small" color={theme.textMuted} style={{ marginTop: 6 }}>
                    未设置图片
                  </ThemedText>
                </View>
              )}
              <View style={[styles.cardTileTypeRibbon, { backgroundColor: withAlpha(factionColor, 0.9) }]}>
                <FontAwesome6 name={typeIcon as any} size={12} color="#FFFFFF" />
                <ThemedText variant="tiny" color="#FFFFFF">{card.type}</ThemedText>
              </View>
            </View>

            <View style={styles.cardTileTitleBlock}>
              <ThemedText variant="bodyMedium" color={theme.textPrimary} numberOfLines={2} style={styles.cardTileTitle}>
                {card.name || '未命名卡牌'}
              </ThemedText>
              <ThemedText variant="tiny" color={theme.textMuted} numberOfLines={2}>
                {card.type} · {card.description || '暂无描述'}
              </ThemedText>
            </View>

            {card.type === CardType.UNIT ? (
              <View style={styles.cardTileStats}>
                <ThemedView level="tertiary" style={styles.cardTileStatPill}>
                  <FontAwesome6 name="crosshairs" size={11} color={theme.error} />
                  <ThemedText variant="tiny" color={theme.textPrimary}>{card.attack ?? 0}</ThemedText>
                </ThemedView>
                <ThemedView level="tertiary" style={styles.cardTileStatPill}>
                  <FontAwesome6 name="heart" size={11} color={theme.success} />
                  <ThemedText variant="tiny" color={theme.textPrimary}>{card.health ?? 0}</ThemedText>
                </ThemedView>
                <ThemedView level="tertiary" style={styles.cardTileStatPill}>
                  <FontAwesome6 name="person-walking" size={11} color={theme.primary} />
                  <ThemedText variant="tiny" color={theme.textPrimary}>{card.movement ?? 0}</ThemedText>
                </ThemedView>
              </View>
            ) : null}
          </View>
        </View>
        <View style={styles.tileActions}>
          <Pressable onPress={() => openEdit(card)} style={styles.tileAction}><FontAwesome6 name="pen-to-square" size={12} color={theme.textPrimary} /><Text style={{ color: theme.textPrimary, fontSize: 12 }}>编辑</Text></Pressable>
          <Pressable onPress={() => duplicateCard(card)} style={styles.tileAction}><FontAwesome6 name="clone" size={12} color={theme.textPrimary} /><Text style={{ color: theme.textPrimary, fontSize: 12 }}>复制</Text></Pressable>
          <Pressable onPress={() => deleteCard(card)} style={styles.tileAction}><FontAwesome6 name="trash" size={12} color={theme.error} /><Text style={{ color: theme.error, fontSize: 12 }}>删除</Text></Pressable>
        </View>
      </Pressable>
    );
  };

  const renderPreview = (card: EditorCard | null) => {
    if (!card) {
      return <ThemedView level="tertiary" style={styles.previewEmpty}><FontAwesome6 name="rectangle-list" size={40} color={theme.textMuted} /><ThemedText variant="bodyMedium" color={theme.textPrimary}>选择一张卡牌查看详情</ThemedText><ThemedText variant="small" color={theme.textMuted}>你可以新建、复制、删除、导入和导出卡牌数据。</ThemedText></ThemedView>;
    }

    const factionColorMap: Record<Faction, string> = {
      [Faction.ENGLAND]: '#1D4ED8',
      [Faction.FRANCE]: '#B91C1C',
      [Faction.HOLY_ROMAN_EMPIRE]: '#B45309',
      [Faction.VIKING]: '#0F766E',
      [Faction.BYZANTIUM]: '#6D28D9',
    } as const;
    const factionColor = factionColorMap[card.faction] ?? theme.primary;
    const rarityColor = RARITY_OPTIONS.find((item) => item.value === card.rarity)?.color ?? theme.primary;
    const typeIcon = card.type === CardType.UNIT ? 'chess-knight' : card.type === CardType.TACTIC ? 'scroll' : 'tower-observation';

    return (
      <ThemedView level="default" style={styles.cardFrame}>
        <View style={[styles.cardBackdrop, { backgroundColor: withAlpha(factionColor, 0.12) }]} />
        <View style={[styles.cardRim, { borderColor: rarityColor }]} />

        <View style={styles.cardContent}>
          <View style={styles.cardTopBar}>
            <View style={[styles.cardCostOrb, { borderColor: rarityColor, backgroundColor: withAlpha(factionColor, 0.16) }]}>
              <ThemedText variant="h4" color={theme.textPrimary}>{card.cost}</ThemedText>
              <ThemedText variant="tiny" color={theme.textMuted}>费用</ThemedText>
            </View>
            <View style={styles.cardTopMeta}>
              {isMoonDraftId(card.id) ? <EditorBadge color="#7C3AED" label="月球毛坯" /> : null}
              <EditorBadge color={factionColor} label={card.faction} />
              <EditorBadge color={rarityColor} label={card.rarity} />
            </View>
          </View>

          <View style={[styles.cardArtwork, { borderColor: factionColor }]}>
            {card.imageUrl ? (
              <Image source={{ uri: card.imageUrl }} style={styles.cardArtworkImage} resizeMode="cover" />
            ) : (
              <View style={[styles.cardArtworkPlaceholder, { backgroundColor: withAlpha(factionColor, 0.08) }]}>
                <FactionIcon faction={card.faction} size={64} />
                <ThemedText variant="smallMedium" color={theme.textMuted} style={{ marginTop: 8 }}>
                  未设置图片
                </ThemedText>
              </View>
            )}
            <View style={[styles.cardTypeRibbon, { backgroundColor: withAlpha(factionColor, 0.9) }]}>
              <FontAwesome6 name={typeIcon as any} size={12} color="#FFFFFF" />
              <ThemedText variant="tiny" color="#FFFFFF">{card.type}</ThemedText>
            </View>
          </View>

          <View style={styles.cardTitleBlock}>
            <ThemedText variant="h4" color={theme.textPrimary} style={styles.cardTitle} numberOfLines={2}>
              {card.name || '未命名卡牌'}
            </ThemedText>
            <ThemedText variant="small" color={theme.textMuted} numberOfLines={3}>
              {card.description || '暂无描述'}
            </ThemedText>
            {card.flavorText ? (
              <ThemedText variant="small" color={theme.textMuted} style={styles.cardFlavorText} numberOfLines={2}>
                {card.flavorText}
              </ThemedText>
            ) : null}
          </View>

          {card.type === CardType.UNIT && (
            <View style={styles.cardStatGrid}>
              <ThemedView level="tertiary" style={styles.cardStatPill}>
                <FontAwesome6 name="crosshairs" size={13} color={theme.error} />
                <ThemedText variant="smallMedium" color={theme.textPrimary}>{card.attack ?? 0}</ThemedText>
              </ThemedView>
              <ThemedView level="tertiary" style={styles.cardStatPill}>
                <FontAwesome6 name="heart" size={13} color={theme.success} />
                <ThemedText variant="smallMedium" color={theme.textPrimary}>{card.health ?? 0}</ThemedText>
              </ThemedView>
              <ThemedView level="tertiary" style={styles.cardStatPill}>
                <FontAwesome6 name="person-walking" size={13} color={theme.primary} />
                <ThemedText variant="smallMedium" color={theme.textPrimary}>{card.movement ?? 0}</ThemedText>
              </ThemedView>
            </View>
          )}

          {card.type === CardType.BUILDING && (
            <ThemedView level="tertiary" style={styles.cardAbilityBox}>
              <ThemedText variant="smallMedium" color={theme.textPrimary}>
                耐久 {card.durability ?? 0}
              </ThemedText>
              <ThemedText variant="small" color={theme.textMuted} numberOfLines={3}>
                {card.effect || '暂无建筑效果'}
              </ThemedText>
            </ThemedView>
          )}

          {card.type === CardType.TACTIC && (
            <ThemedView level="tertiary" style={styles.cardAbilityBox}>
              <ThemedText variant="smallMedium" color={theme.textPrimary} numberOfLines={4}>
                {card.effect || '暂无战术效果'}
              </ThemedText>
              {card.duration !== null ? (
                <ThemedText variant="tiny" color={theme.textMuted}>持续 {card.duration} 回合</ThemedText>
              ) : null}
            </ThemedView>
          )}

          {card.type === CardType.UNIT && card.abilities.length > 0 && (
            <ThemedView level="tertiary" style={styles.cardAbilityBox}>
              <ThemedText variant="smallMedium" color={theme.textPrimary}>能力</ThemedText>
              {card.abilities.slice(0, 3).map((ability, index) => (
                <Text key={`${ability.type}-${index}`} style={{ color: theme.textSecondary, marginTop: 4 }}>
                  • {ability.description || ability.type}
                </Text>
              ))}
            </ThemedView>
          )}

          {card.notes ? (
            <ThemedView level="tertiary" style={styles.cardAbilityBox}>
              <ThemedText variant="smallMedium" color={theme.textPrimary}>备注</ThemedText>
              <ThemedText variant="small" color={theme.textMuted} numberOfLines={2}>{card.notes}</ThemedText>
            </ThemedView>
          ) : null}

          <View style={styles.previewActions}>
          <Pressable onPress={() => openEdit(card)} style={[styles.previewAction, { backgroundColor: theme.primary }]}>
            <FontAwesome6 name="pen-to-square" size={14} color="#FFFFFF" />
            <ThemedText variant="smallMedium" color="#FFFFFF">编辑</ThemedText>
          </Pressable>
          <Pressable onPress={() => duplicateCard(card)} style={[styles.previewAction, { backgroundColor: theme.backgroundTertiary }]}>
            <FontAwesome6 name="clone" size={14} color={theme.textPrimary} />
            <ThemedText variant="smallMedium" color={theme.textPrimary}>复制</ThemedText>
          </Pressable>
          </View>
        </View>
      </ThemedView>
    );
  };
  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle="dark">
      <ScrollView contentContainerStyle={styles.page} refreshControl={<RefreshControl refreshing={loading} onRefresh={loadCards} />}>
        <ThemedView level="root" style={styles.headerCard}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} style={styles.iconButton}><FontAwesome6 name="arrow-left" size={14} color={theme.textPrimary} /></Pressable>
            <View style={styles.titleBlock}><ThemedText variant="h2" color={theme.textPrimary}>卡牌编辑器</ThemedText><ThemedText variant="small" color={theme.textMuted}>完整编辑、复制、删除、导入导出和服务器同步。月球毛坯会自动注入，也可手动恢复。</ThemedText></View>
            <View style={styles.headerActions}>
              <Pressable onPress={loadCards} style={styles.iconButton}><FontAwesome6 name="rotate" size={14} color={theme.textPrimary} /></Pressable>
              <Pressable onPress={restoreMoonDrafts} style={styles.iconButton}><FontAwesome6 name="moon" size={14} color={theme.textPrimary} /></Pressable>
              <Pressable onPress={() => setExportVisible(true)} style={styles.iconButton}><FontAwesome6 name="download" size={14} color={theme.textPrimary} /></Pressable>
              <Pressable onPress={() => setImportVisible(true)} style={styles.iconButton}><FontAwesome6 name="upload" size={14} color={theme.textPrimary} /></Pressable>
              <Pressable onPress={() => setTemplateVisible(true)} style={styles.iconButton}><FontAwesome6 name="bookmark" size={14} color={theme.textPrimary} /></Pressable>
              <Pressable onPress={() => openCreate(CardType.UNIT)} style={[styles.primaryButton, { backgroundColor: theme.primary }]}><FontAwesome6 name="plus" size={14} color="#FFFFFF" /><ThemedText variant="smallMedium" color="#FFFFFF">新建卡牌</ThemedText></Pressable>
            </View>
          </View>

          <View style={styles.statsRow}>
            <ThemedView level="tertiary" style={styles.statCard}><ThemedText variant="stat" color={theme.textPrimary}>{stats.total}</ThemedText><ThemedText variant="tiny" color={theme.textMuted}>总卡牌</ThemedText></ThemedView>
            <ThemedView level="tertiary" style={styles.statCard}><ThemedText variant="stat" color={theme.textPrimary}>{stats.pending}</ThemedText><ThemedText variant="tiny" color={theme.textMuted}>待同步</ThemedText></ThemedView>
            <ThemedView level="tertiary" style={styles.statCard}><ThemedText variant="stat" color={theme.textPrimary}>{stats.unit}</ThemedText><ThemedText variant="tiny" color={theme.textMuted}>单位</ThemedText></ThemedView>
            <ThemedView level="tertiary" style={styles.statCard}><ThemedText variant="stat" color={theme.textPrimary}>{stats.tactic + stats.building}</ThemedText><ThemedText variant="tiny" color={theme.textMuted}>战术/建筑</ThemedText></ThemedView>
            <ThemedView level="tertiary" style={styles.statCard}><ThemedText variant="stat" color={theme.textPrimary}>{stats.moon}</ThemedText><ThemedText variant="tiny" color={theme.textMuted}>月球毛坯</ThemedText></ThemedView>
          </View>
        </ThemedView>

        <View style={styles.bodyGrid}>
          <View style={styles.leftPane}>
            <ThemedView level="default" style={styles.toolbarCard}>
              <TextInput value={search} onChangeText={setSearch} placeholder="搜索卡牌名称、描述、能力或备注" placeholderTextColor={theme.textMuted} style={[styles.searchInput, { color: theme.textPrimary, backgroundColor: theme.backgroundTertiary, borderColor: theme.borderLight }]} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>{renderChip('全部阵营', factionFilter === 'ALL', () => setFactionFilter('ALL'))}{FACTION_OPTIONS.map((item) => renderChip(item.label, factionFilter === item.value, () => setFactionFilter(item.value)))}</ScrollView>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>{renderChip('全部类型', typeFilter === 'ALL', () => setTypeFilter('ALL'))}{TYPE_OPTIONS.map((item) => renderChip(item.label, typeFilter === item.value, () => setTypeFilter(item.value)))}</ScrollView>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>{renderChip('全部稀有度', rarityFilter === 'ALL', () => setRarityFilter('ALL'))}{RARITY_OPTIONS.map((item) => renderChip(item.label, rarityFilter === item.value, () => setRarityFilter(item.value), item.color))}</ScrollView>
              <View style={styles.toolbarFooter}><ThemedText variant="small" color={theme.textMuted}>当前显示 {filteredCards.length} 张</ThemedText><Pressable onPress={syncPending} disabled={syncingAll || stats.pending === 0} style={[styles.primaryButton, { backgroundColor: stats.pending === 0 ? theme.borderLight : theme.primary, opacity: syncingAll ? 0.75 : 1 }]}><FontAwesome6 name="cloud-arrow-up" size={14} color="#FFFFFF" /><ThemedText variant="smallMedium" color="#FFFFFF">{syncingAll ? '同步中...' : `同步待处理(${stats.pending})`}</ThemedText></Pressable></View>
            </ThemedView>

            <View style={styles.cardsGrid}>{filteredCards.length > 0 ? filteredCards.map(renderCardTile) : <ThemedView level="tertiary" style={styles.emptyState}><FontAwesome6 name="magnifying-glass" size={40} color={theme.textMuted} /><ThemedText variant="bodyMedium" color={theme.textPrimary}>没有匹配的卡牌</ThemedText><ThemedText variant="small" color={theme.textMuted}>试着调整筛选条件，或者直接新建一张卡牌。</ThemedText></ThemedView>}</View>
          </View>

          <View style={styles.rightPane}>{renderPreview(selectedCard)}<ThemedView level="default" style={styles.quickHint}><FontAwesome6 name="circle-info" size={16} color={theme.textMuted} /><ThemedText variant="small" color={theme.textMuted} style={{ flex: 1 }}>点击卡牌查看详情，使用右上角按钮可以导入、导出或者刷新数据。</ThemedText></ThemedView></View>
        </View>
      </ScrollView>

      <Modal visible={editorVisible} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.modalBackdrop} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable style={styles.modalBackdrop} onPress={() => setEditorVisible(false)}>
            <Pressable style={styles.modalCard} onPress={() => undefined}>
              <ScrollView contentContainerStyle={styles.modalContent}>
                <View style={styles.modalHeader}><View style={{ flex: 1 }}><ThemedText variant="h3" color={theme.textPrimary}>{editorMode === 'create' ? '新建卡牌' : '编辑卡牌'}</ThemedText><ThemedText variant="small" color={theme.textMuted}>把基础信息、类型属性和附加说明一起编辑完整。</ThemedText></View><Pressable onPress={() => setEditorVisible(false)} style={styles.iconButton}><FontAwesome6 name="xmark" size={14} color={theme.textPrimary} /></Pressable></View>

                <View style={styles.formSection}><ThemedText variant="h4" color={theme.textPrimary}>基础信息</ThemedText><View style={styles.fieldRow}><View style={styles.fieldHalf}><ThemedText variant="small" color={theme.textMuted}>名称</ThemedText><TextInput value={draft.name} onChangeText={(value) => updateDraft('name', value)} style={[styles.fieldInput, { color: theme.textPrimary, backgroundColor: theme.backgroundTertiary, borderColor: theme.borderLight }]} placeholder="输入卡牌名称" placeholderTextColor={theme.textMuted} /></View><View style={styles.fieldHalf}><ThemedText variant="small" color={theme.textMuted}>费用</ThemedText><TextInput value={String(draft.cost)} onChangeText={(value) => updateDraft('cost', safeNumber(value, 0))} keyboardType="numeric" style={[styles.fieldInput, { color: theme.textPrimary, backgroundColor: theme.backgroundTertiary, borderColor: theme.borderLight }]} /></View></View>
                  <ThemedText variant="small" color={theme.textMuted}>阵营</ThemedText><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorRow}>{FACTION_OPTIONS.map((item) => <Pressable key={item.value} onPress={() => updateDraft('faction', item.value)} style={[styles.selectorChip, draft.faction === item.value && styles.selectorChipActive, { backgroundColor: draft.faction === item.value ? theme.primary : theme.backgroundTertiary, borderColor: draft.faction === item.value ? theme.primary : theme.borderLight }]}><FontAwesome6 name={item.icon as any} size={12} color={draft.faction === item.value ? '#FFFFFF' : theme.textMuted} /><ThemedText variant="small" color={draft.faction === item.value ? '#FFFFFF' : theme.textPrimary}>{item.label}</ThemedText></Pressable>)}</ScrollView>
                  <ThemedText variant="small" color={theme.textMuted}>类型</ThemedText><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorRow}>{TYPE_OPTIONS.map((item) => <Pressable key={item.value} onPress={() => updateDraft('type', item.value)} style={[styles.selectorChip, draft.type === item.value && styles.selectorChipActive, { backgroundColor: draft.type === item.value ? theme.primary : theme.backgroundTertiary, borderColor: draft.type === item.value ? theme.primary : theme.borderLight }]}><FontAwesome6 name={item.icon as any} size={12} color={draft.type === item.value ? '#FFFFFF' : theme.textMuted} /><ThemedText variant="small" color={draft.type === item.value ? '#FFFFFF' : theme.textPrimary}>{item.label}</ThemedText></Pressable>)}</ScrollView>
                  <ThemedText variant="small" color={theme.textMuted}>稀有度</ThemedText><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorRow}>{RARITY_OPTIONS.map((item) => <Pressable key={item.value} onPress={() => updateDraft('rarity', item.value)} style={[styles.selectorChip, draft.rarity === item.value && styles.selectorChipActive, { backgroundColor: draft.rarity === item.value ? item.color : theme.backgroundTertiary, borderColor: draft.rarity === item.value ? item.color : theme.borderLight }]}><ThemedText variant="small" color={draft.rarity === item.value ? '#FFFFFF' : theme.textPrimary}>{item.label}</ThemedText></Pressable>)}</ScrollView>
                  <ThemedText variant="small" color={theme.textMuted}>描述</ThemedText><TextInput value={draft.description} onChangeText={(value) => updateDraft('description', value)} multiline placeholder="写下卡牌效果描述" placeholderTextColor={theme.textMuted} style={[styles.fieldTextarea, { color: theme.textPrimary, backgroundColor: theme.backgroundTertiary, borderColor: theme.borderLight }]} />
                  <ThemedText variant="small" color={theme.textMuted}>背景文本</ThemedText><TextInput value={draft.flavorText} onChangeText={(value) => updateDraft('flavorText', value)} multiline placeholder="写下风味文本" placeholderTextColor={theme.textMuted} style={[styles.fieldTextarea, { color: theme.textPrimary, backgroundColor: theme.backgroundTertiary, borderColor: theme.borderLight }]} />
                  <ThemedText variant="small" color={theme.textMuted}>图片地址</ThemedText><TextInput value={draft.imageUrl} onChangeText={(value) => updateDraft('imageUrl', value)} placeholder="https://..." placeholderTextColor={theme.textMuted} style={[styles.fieldInput, { color: theme.textPrimary, backgroundColor: theme.backgroundTertiary, borderColor: theme.borderLight }]} /></View>

                {draft.type === CardType.UNIT && <View style={styles.formSection}><ThemedText variant="h4" color={theme.textPrimary}>单位属性</ThemedText><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorRow}>{UNIT_TYPES.map((item) => <Pressable key={item.value} onPress={() => updateDraft('unitType', item.value)} style={[styles.selectorChip, draft.unitType === item.value && styles.selectorChipActive, { backgroundColor: draft.unitType === item.value ? theme.primary : theme.backgroundTertiary, borderColor: draft.unitType === item.value ? theme.primary : theme.borderLight }]}><ThemedText variant="small" color={draft.unitType === item.value ? '#FFFFFF' : theme.textPrimary}>{item.label}</ThemedText></Pressable>)}</ScrollView><View style={styles.fieldRow}><View style={styles.fieldHalf}><ThemedText variant="small" color={theme.textMuted}>攻击</ThemedText><TextInput value={String(draft.attack ?? 0)} onChangeText={(value) => updateDraft('attack', safeNumber(value, 0))} keyboardType="numeric" style={[styles.fieldInput, { color: theme.textPrimary, backgroundColor: theme.backgroundTertiary, borderColor: theme.borderLight }]} /></View><View style={styles.fieldHalf}><ThemedText variant="small" color={theme.textMuted}>生命</ThemedText><TextInput value={String(draft.health ?? 0)} onChangeText={(value) => updateDraft('health', safeNumber(value, 0))} keyboardType="numeric" style={[styles.fieldInput, { color: theme.textPrimary, backgroundColor: theme.backgroundTertiary, borderColor: theme.borderLight }]} /></View></View><View style={styles.fieldRow}><View style={styles.fieldHalf}><ThemedText variant="small" color={theme.textMuted}>移动</ThemedText><TextInput value={String(draft.movement ?? 0)} onChangeText={(value) => updateDraft('movement', safeNumber(value, 0))} keyboardType="numeric" style={[styles.fieldInput, { color: theme.textPrimary, backgroundColor: theme.backgroundTertiary, borderColor: theme.borderLight }]} /></View></View><ThemedText variant="small" color={theme.textMuted}>能力</ThemedText>{draft.abilities.map((ability, index) => <View key={`${ability.type}-${index}`} style={styles.abilityRow}><TextInput value={ability.description} onChangeText={(value) => updateAbility(index, 'description', value)} placeholder="能力描述" placeholderTextColor={theme.textMuted} style={[styles.abilityInput, { color: theme.textPrimary, backgroundColor: theme.backgroundTertiary, borderColor: theme.borderLight }]} /><Pressable onPress={() => removeAbility(index)} style={styles.abilityDelete}><FontAwesome6 name="trash" size={14} color={theme.error} /></Pressable></View>)}<Pressable onPress={addAbility} style={[styles.addRowButton, { borderColor: theme.borderLight, backgroundColor: theme.backgroundTertiary }]}><FontAwesome6 name="plus" size={14} color={theme.textMuted} /><ThemedText variant="small" color={theme.textMuted}>添加能力</ThemedText></Pressable></View>}

                {draft.type === CardType.TACTIC && <View style={styles.formSection}><ThemedText variant="h4" color={theme.textPrimary}>战术属性</ThemedText><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorRow}>{TACTIC_TYPES.map((item) => <Pressable key={item.value} onPress={() => updateDraft('tacticType', item.value)} style={[styles.selectorChip, draft.tacticType === item.value && styles.selectorChipActive, { backgroundColor: draft.tacticType === item.value ? theme.primary : theme.backgroundTertiary, borderColor: draft.tacticType === item.value ? theme.primary : theme.borderLight }]}><ThemedText variant="small" color={draft.tacticType === item.value ? '#FFFFFF' : theme.textPrimary}>{item.label}</ThemedText></Pressable>)}</ScrollView><TextInput value={draft.effect} onChangeText={(value) => updateDraft('effect', value)} multiline placeholder="输入战术效果" placeholderTextColor={theme.textMuted} style={[styles.fieldTextarea, { color: theme.textPrimary, backgroundColor: theme.backgroundTertiary, borderColor: theme.borderLight }]} /><View style={styles.fieldRow}><View style={styles.fieldHalf}><ThemedText variant="small" color={theme.textMuted}>持续回合</ThemedText><TextInput value={String(draft.duration ?? 0)} onChangeText={(value) => updateDraft('duration', safeNumber(value, 0))} keyboardType="numeric" style={[styles.fieldInput, { color: theme.textPrimary, backgroundColor: theme.backgroundTertiary, borderColor: theme.borderLight }]} /></View></View></View>}

                {draft.type === CardType.BUILDING && <View style={styles.formSection}><ThemedText variant="h4" color={theme.textPrimary}>建筑属性</ThemedText><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorRow}>{BUILDING_TYPES.map((item) => <Pressable key={item.value} onPress={() => updateDraft('buildingType', item.value)} style={[styles.selectorChip, draft.buildingType === item.value && styles.selectorChipActive, { backgroundColor: draft.buildingType === item.value ? theme.primary : theme.backgroundTertiary, borderColor: draft.buildingType === item.value ? theme.primary : theme.borderLight }]}><ThemedText variant="small" color={draft.buildingType === item.value ? '#FFFFFF' : theme.textPrimary}>{item.label}</ThemedText></Pressable>)}</ScrollView><View style={styles.fieldRow}><View style={styles.fieldHalf}><ThemedText variant="small" color={theme.textMuted}>耐久</ThemedText><TextInput value={String(draft.durability ?? 0)} onChangeText={(value) => updateDraft('durability', safeNumber(value, 0))} keyboardType="numeric" style={[styles.fieldInput, { color: theme.textPrimary, backgroundColor: theme.backgroundTertiary, borderColor: theme.borderLight }]} /></View></View><TextInput value={draft.effect} onChangeText={(value) => updateDraft('effect', value)} multiline placeholder="输入建筑效果" placeholderTextColor={theme.textMuted} style={[styles.fieldTextarea, { color: theme.textPrimary, backgroundColor: theme.backgroundTertiary, borderColor: theme.borderLight }]} /></View>}

                <View style={styles.formSection}><ThemedText variant="h4" color={theme.textPrimary}>备注</ThemedText><TextInput value={draft.notes} onChangeText={(value) => updateDraft('notes', value)} multiline placeholder="编辑器备注，不会影响对局" placeholderTextColor={theme.textMuted} style={[styles.fieldTextarea, { color: theme.textPrimary, backgroundColor: theme.backgroundTertiary, borderColor: theme.borderLight }]} /><ThemedText variant="small" color={theme.textMuted}>模板名称（可选）</ThemedText><TextInput value={templateName} onChangeText={setTemplateName} placeholder="比如：帝国步兵模板" placeholderTextColor={theme.textMuted} style={[styles.fieldInput, { color: theme.textPrimary, backgroundColor: theme.backgroundTertiary, borderColor: theme.borderLight }]} /></View>
              </ScrollView>
              <View style={styles.modalFooter}>
                <Pressable onPress={() => setEditorVisible(false)} style={[styles.footerButton, styles.footerGhostButton]}>
                  <ThemedText variant="smallMedium" color={theme.textPrimary}>取消</ThemedText>
                </Pressable>
                <Pressable onPress={saveTemplate} style={[styles.footerButton, styles.footerGhostButton]}>
                  <FontAwesome6 name="bookmark" size={14} color={theme.textPrimary} />
                  <ThemedText variant="smallMedium" color={theme.textPrimary}>保存模板</ThemedText>
                </Pressable>
                {editorMode !== 'template' ? (
                  <Pressable onPress={saveCard} style={[styles.footerButton, styles.footerPrimaryButton, { backgroundColor: theme.primary }]}>
                    <FontAwesome6 name="floppy-disk" size={14} color="#FFFFFF" />
                    <ThemedText variant="smallMedium" color="#FFFFFF">保存</ThemedText>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={async () => {
                      const currentTemplate = editingTemplateId ? templates.find((item) => item.id === editingTemplateId) : null;
                      await exportTemplate(
                        currentTemplate
                          ? { ...currentTemplate, name: templateName.trim() || currentTemplate.name, defaults: draft, updatedAt: Date.now() }
                          : templateFromCard(draft, templateName.trim() || `${draft.name || '未命名'} 模板`),
                      );
                    }}
                    style={[styles.footerButton, styles.footerPrimaryButton, { backgroundColor: theme.success }]}
                  >
                    <FontAwesome6 name="download" size={14} color="#FFFFFF" />
                    <ThemedText variant="smallMedium" color="#FFFFFF">导出模板</ThemedText>
                  </Pressable>
                )}
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={importVisible} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.modalBackdrop} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable style={styles.modalBackdrop} onPress={() => setImportVisible(false)}>
            <Pressable style={styles.modalCard} onPress={() => undefined}>
              <View style={styles.modalHeader}><View style={{ flex: 1 }}><ThemedText variant="h3" color={theme.textPrimary}>导入 JSON</ThemedText><ThemedText variant="small" color={theme.textMuted}>支持数组，或者包含 cards 字段的对象。可以选择模板后批量套用。</ThemedText></View><Pressable onPress={() => setImportVisible(false)} style={styles.iconButton}><FontAwesome6 name="xmark" size={14} color={theme.textPrimary} /></Pressable></View>
              <ScrollView contentContainerStyle={styles.modalContent}>
                <View style={styles.formSection}>
                  <ThemedText variant="small" color={theme.textMuted}>导入模式</ThemedText>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorRow}>
                    <Pressable onPress={() => setImportMode('replace')} style={[styles.selectorChip, importMode === 'replace' && styles.selectorChipActive, { backgroundColor: importMode === 'replace' ? theme.primary : theme.backgroundTertiary, borderColor: importMode === 'replace' ? theme.primary : theme.borderLight }]}><ThemedText variant="small" color={importMode === 'replace' ? '#FFFFFF' : theme.textPrimary}>覆盖现有</ThemedText></Pressable>
                    <Pressable onPress={() => setImportMode('append')} style={[styles.selectorChip, importMode === 'append' && styles.selectorChipActive, { backgroundColor: importMode === 'append' ? theme.primary : theme.backgroundTertiary, borderColor: importMode === 'append' ? theme.primary : theme.borderLight }]}><ThemedText variant="small" color={importMode === 'append' ? '#FFFFFF' : theme.textPrimary}>追加到列表</ThemedText></Pressable>
                  </ScrollView>

                  <ThemedText variant="small" color={theme.textMuted}>导入模板</ThemedText>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorRow}>
                    <Pressable onPress={() => setImportTemplateId('none')} style={[styles.selectorChip, importTemplateId === 'none' && styles.selectorChipActive, { backgroundColor: importTemplateId === 'none' ? theme.primary : theme.backgroundTertiary, borderColor: importTemplateId === 'none' ? theme.primary : theme.borderLight }]}><ThemedText variant="small" color={importTemplateId === 'none' ? '#FFFFFF' : theme.textPrimary}>不套模板</ThemedText></Pressable>
                    {templates.map((template) => (
                      <Pressable key={template.id} onPress={() => setImportTemplateId(template.id)} style={[styles.selectorChip, importTemplateId === template.id && styles.selectorChipActive, { backgroundColor: importTemplateId === template.id ? theme.primary : theme.backgroundTertiary, borderColor: importTemplateId === template.id ? theme.primary : theme.borderLight }]}><ThemedText variant="small" color={importTemplateId === template.id ? '#FFFFFF' : theme.textPrimary}>{template.name}</ThemedText></Pressable>
                    ))}
                  </ScrollView>

                  <TextInput value={importText} onChangeText={setImportText} multiline placeholder="把 JSON 粘贴到这里" placeholderTextColor={theme.textMuted} style={[styles.longInput, { color: theme.textPrimary, backgroundColor: theme.backgroundTertiary, borderColor: theme.borderLight }]} />
                </View>
              </ScrollView>
              <View style={styles.modalFooter}><Pressable onPress={() => setImportVisible(false)} style={[styles.footerButton, styles.footerGhostButton]}><ThemedText variant="smallMedium" color={theme.textPrimary}>取消</ThemedText></Pressable><Pressable onPress={() => performImport(false)} style={[styles.footerButton, styles.footerPrimaryButton, { backgroundColor: theme.primary }]}><ThemedText variant="smallMedium" color="#FFFFFF">仅导入本地</ThemedText></Pressable><Pressable onPress={() => performImport(true)} style={[styles.footerButton, styles.footerPrimaryButton, { backgroundColor: theme.success }]}><ThemedText variant="smallMedium" color="#FFFFFF">导入并同步</ThemedText></Pressable></View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={exportVisible} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.modalBackdrop} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable style={styles.modalBackdrop} onPress={() => setExportVisible(false)}>
            <Pressable style={styles.modalCard} onPress={() => undefined}>
              <View style={styles.modalHeader}><View style={{ flex: 1 }}><ThemedText variant="h3" color={theme.textPrimary}>导出 JSON</ThemedText><ThemedText variant="small" color={theme.textMuted}>复制后可以直接保存，或者发给其他人导入。</ThemedText></View><Pressable onPress={() => setExportVisible(false)} style={styles.iconButton}><FontAwesome6 name="xmark" size={14} color={theme.textPrimary} /></Pressable></View>
              <ScrollView contentContainerStyle={styles.modalContent}><TextInput value={exportJson} editable={false} multiline style={[styles.longInput, { color: theme.textPrimary, backgroundColor: theme.backgroundTertiary, borderColor: theme.borderLight }]} /></ScrollView>
              <View style={styles.modalFooter}><Pressable onPress={async () => { if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) { await navigator.clipboard.writeText(exportJson); } else { await Share.share({ message: exportJson }); } Alert.alert('已复制', '卡牌 JSON 已经复制到剪贴板。'); }} style={[styles.footerButton, styles.footerPrimaryButton, { backgroundColor: theme.primary }]}><FontAwesome6 name="copy" size={14} color="#FFFFFF" /><ThemedText variant="smallMedium" color="#FFFFFF">复制</ThemedText></Pressable><Pressable onPress={() => setExportVisible(false)} style={[styles.footerButton, styles.footerGhostButton]}><ThemedText variant="smallMedium" color={theme.textPrimary}>关闭</ThemedText></Pressable></View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={templateVisible} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.modalBackdrop} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable style={styles.modalBackdrop} onPress={() => setTemplateVisible(false)}>
            <Pressable style={styles.modalCard} onPress={() => undefined}>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <ThemedText variant="h3" color={theme.textPrimary}>模板库</ThemedText>
                  <ThemedText variant="small" color={theme.textMuted}>保存当前编辑内容为模板，后续可以直接创建或批量导入套用。</ThemedText>
                </View>
                <Pressable onPress={() => setTemplateVisible(false)} style={styles.iconButton}>
                  <FontAwesome6 name="xmark" size={14} color={theme.textPrimary} />
                </Pressable>
              </View>
              <ScrollView contentContainerStyle={styles.modalContent}>
                {templates.length > 0 ? templates.map((template) => {
                  const summary = `${template.defaults.type ?? 'UNIT'} · ${template.defaults.faction ?? 'ENGLAND'} · ${template.defaults.rarity ?? 'COMMON'}`;
                  return (
                    <ThemedView key={template.id} level="tertiary" style={styles.templateCard}>
                      <View style={{ flex: 1, gap: 4 }}>
                        <ThemedText variant="bodyMedium" color={theme.textPrimary}>{template.name}</ThemedText>
                        <ThemedText variant="tiny" color={theme.textMuted}>{summary}</ThemedText>
                      </View>
                      <View style={styles.templateActions}>
                        <Pressable onPress={() => createCardFromTemplate(template)} style={[styles.footerButton, { backgroundColor: theme.primary, flex: 1 }]}><ThemedText variant="smallMedium" color="#FFFFFF">应用到新卡</ThemedText></Pressable>
                        <Pressable onPress={() => openTemplateEditor(template)} style={[styles.footerButton, styles.footerGhostButton]}><ThemedText variant="smallMedium" color={theme.textPrimary}>编辑</ThemedText></Pressable>
                        <Pressable onPress={() => openTemplateRename(template)} style={[styles.footerButton, styles.footerGhostButton]}><ThemedText variant="smallMedium" color={theme.textPrimary}>重命名</ThemedText></Pressable>
                        <Pressable onPress={() => exportTemplate(template)} style={[styles.footerButton, styles.footerGhostButton]}><FontAwesome6 name="download" size={14} color={theme.textPrimary} /><ThemedText variant="smallMedium" color={theme.textPrimary}>导出模板</ThemedText></Pressable>
                        <Pressable onPress={() => deleteTemplate(template.id)} style={[styles.footerButton, styles.footerGhostButton]}><ThemedText variant="smallMedium" color={theme.textPrimary}>删除</ThemedText></Pressable>
                      </View>
                    </ThemedView>
                  );
                }) : (
                  <ThemedView level="tertiary" style={styles.emptyState}>
                    <FontAwesome6 name="bookmark" size={40} color={theme.textMuted} />
                    <ThemedText variant="bodyMedium" color={theme.textPrimary}>还没有保存过模板</ThemedText>
                    <ThemedText variant="small" color={theme.textMuted}>先从编辑器里点“保存模板”。</ThemedText>
                  </ThemedView>
                )}
              </ScrollView>
              <View style={styles.modalFooter}>
                <Pressable onPress={() => setTemplateVisible(false)} style={[styles.footerButton, styles.footerGhostButton]}>
                  <ThemedText variant="smallMedium" color={theme.textPrimary}>关闭</ThemedText>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={renamingTemplateId !== null} transparent animationType="fade">
        <KeyboardAvoidingView style={styles.modalBackdrop} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable style={styles.modalBackdrop} onPress={() => setRenamingTemplateId(null)}>
            <Pressable style={styles.modalCard} onPress={() => undefined}>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <ThemedText variant="h3" color={theme.textPrimary}>重命名模板</ThemedText>
                  <ThemedText variant="small" color={theme.textMuted}>修改模板在模板库中的显示名称。</ThemedText>
                </View>
                <Pressable onPress={() => setRenamingTemplateId(null)} style={styles.iconButton}>
                  <FontAwesome6 name="xmark" size={14} color={theme.textPrimary} />
                </Pressable>
              </View>
              <View style={styles.modalContent}>
                <ThemedText variant="small" color={theme.textMuted}>模板名称</ThemedText>
                <TextInput
                  value={renamingTemplateName}
                  onChangeText={setRenamingTemplateName}
                  placeholder="输入新的模板名称"
                  placeholderTextColor={theme.textMuted}
                  style={[styles.fieldInput, { color: theme.textPrimary, backgroundColor: theme.backgroundTertiary, borderColor: theme.borderLight }]}
                />
              </View>
              <View style={styles.modalFooter}>
                <Pressable onPress={() => setRenamingTemplateId(null)} style={[styles.footerButton, styles.footerGhostButton]}>
                  <ThemedText variant="smallMedium" color={theme.textPrimary}>取消</ThemedText>
                </Pressable>
                <Pressable onPress={saveTemplateRename} style={[styles.footerButton, styles.footerPrimaryButton, { backgroundColor: theme.primary }]}>
                  <ThemedText variant="smallMedium" color="#FFFFFF">保存</ThemedText>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </Screen>
  );
}
