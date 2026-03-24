import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  RefreshControl,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { createStyles } from './styles';
import { FontAwesome6 } from '@expo/vector-icons';
import { Spacing } from '@/constants/theme';

// 卡牌类型定义
interface CardData {
  id: string;
  name: string;
  cost: number;
  faction: 'ENGLAND' | 'FRANCE' | 'HRE' | 'VIKING' | 'BYZANTIUM' | 'NEUTRAL';
  type: 'UNIT' | 'TACTIC' | 'BUILDING';
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  description: string;
  flavorText: string | null;
  attack: number | null;
  health: number | null;
  movement: number | null;
  durability: number | null;
  ability: string | null;
}

// 阵营和类型枚举
const FACTIONS = [
  { value: 'ENGLAND', label: '英格兰', icon: 'crown' },
  { value: 'FRANCE', label: '法兰西', icon: 'flag' },
  { value: 'HRE', label: '神圣罗马', icon: 'landmark' },
  { value: 'VIKING', label: '维京', icon: 'axe-battle' },
  { value: 'BYZANTIUM', label: '拜占庭', icon: 'church' },
  { value: 'NEUTRAL', label: '中立', icon: 'shield-halved' },
];

const CARD_TYPES = [
  { value: 'UNIT', label: '单位', icon: 'chess-knight' },
  { value: 'TACTIC', label: '战术', icon: 'scroll' },
  { value: 'BUILDING', label: '建筑', icon: 'tower-observation' },
];

const RARITIES = [
  { value: 'COMMON', label: '普通', color: '#9CA3AF' },
  { value: 'RARE', label: '稀有', color: '#3B82F6' },
  { value: 'EPIC', label: '史诗', color: '#8B5CF6' },
  { value: 'LEGENDARY', label: '传说', color: '#F59E0B' },
];

// 单位类型
const UNIT_TYPES = [
  { value: 'INFANTRY', label: '步兵', icon: 'person-rifle' },
  { value: 'CAVALRY', label: '骑兵', icon: 'horse' },
  { value: 'ARCHER', label: '弓箭手', icon: 'crosshairs' },
  { value: 'SIEGE', label: '攻城', icon: 'tower' },
];

// 建筑类型
const BUILDING_TYPES = [
  { value: 'ECONOMIC', label: '经济', icon: 'coins' },
  { value: 'MILITARY', label: '军事', icon: 'shield' },
  { value: 'DEFENSE', label: '防御', icon: 'fortress' },
];

// 战术类型
const TACTIC_TYPES = [
  { value: 'INSTANT', label: '即时', icon: 'bolt' },
  { value: 'ONGOING', label: '持续', icon: 'hourglass-half' },
  { value: 'EQUIPMENT', label: '装备', icon: 'sword' },
];

export default function CardEditorScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();

  // 状态管理
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaction, setSelectedFaction] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedRarity, setSelectedRarity] = useState<string>('ALL');

  // 编辑 Modal 状态
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCard, setEditingCard] = useState<CardData | null>(null);

  // 表单状态
  const [formData, setFormData] = useState<Partial<CardData>>({});
  const [selectedUnitType, setSelectedUnitType] = useState<string>('INFANTRY');
  const [selectedBuildingType, setSelectedBuildingType] = useState<string>('MILITARY');
  const [selectedTacticType, setSelectedTacticType] = useState<string>('INSTANT');
  const [effects, setEffects] = useState<string[]>([]);

  // 加载卡牌数据
  const loadCards = async () => {
    try {
      setLoading(true);
      /**
       * 服务端文件：server/src/routes/game.ts
       * 接口：GET /api/v1/cards
       */
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/cards`);
      const result = await response.json();

      if (result.success) {
        setCards(result.data);
      } else {
        Alert.alert('错误', '加载卡牌数据失败');
      }
    } catch (error) {
      console.error('加载卡牌失败:', error);
      Alert.alert('错误', '网络请求失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  // 过滤卡牌
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      if (selectedFaction !== 'ALL' && card.faction !== selectedFaction) return false;
      if (selectedType !== 'ALL' && card.type !== selectedType) return false;
      if (selectedRarity !== 'ALL' && card.rarity !== selectedRarity) return false;
      return true;
    });
  }, [cards, selectedFaction, selectedType, selectedRarity]);

  // 创建新卡牌
  const handleCreateCard = () => {
    setEditingCard(null);
    setFormData({
      id: '',
      name: '',
      cost: 0,
      faction: 'ENGLAND',
      type: 'UNIT',
      rarity: 'COMMON',
      description: '',
      flavorText: '',
      attack: 0,
      health: 0,
      movement: 0,
      durability: 0,
      ability: '',
    });
    setSelectedUnitType('INFANTRY');
    setSelectedBuildingType('MILITARY');
    setSelectedTacticType('INSTANT');
    setEffects([]);
    setModalVisible(true);
  };

  // 打开编辑 Modal
  const handleEditCard = (card: CardData) => {
    setEditingCard(card);
    setFormData({ ...card });
    setSelectedUnitType('INFANTRY');
    setSelectedBuildingType('MILITARY');
    setSelectedTacticType('INSTANT');
    setEffects([]);
    setModalVisible(true);
  };

  // 删除卡牌
  const handleDeleteCard = (card: CardData) => {
    Alert.alert(
      '确认删除',
      `确定要删除卡牌 "${card.name}" 吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              /**
               * 服务端文件：server/src/routes/game.ts
               * 接口：DELETE /api/v1/cards/:id
               */
              const response = await fetch(
                `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/cards/${card.id}`,
                {
                  method: 'DELETE',
                }
              );

              const result = await response.json();

              if (result.success) {
                Alert.alert('成功', '卡牌已删除');
                loadCards();
              } else {
                Alert.alert('错误', result.error || '删除失败');
              }
            } catch (error) {
              console.error('删除卡牌失败:', error);
              Alert.alert('错误', '网络请求失败');
            }
          },
        },
      ]
    );
  };

  // 保存卡牌
  const handleSaveCard = async () => {
    if (!formData.name || formData.name.trim() === '') {
      Alert.alert('错误', '卡牌名称不能为空');
      return;
    }

    if (formData.cost === undefined || formData.cost < 0) {
      Alert.alert('错误', '法力消耗必须大于等于0');
      return;
    }

    try {
      const saveData = {
        ...formData,
        ability: effects.join('; '),
      };

      if (editingCard) {
        // 更新现有卡牌
        /**
         * 服务端文件：server/src/routes/game.ts
         * 接口：PUT /api/v1/cards/:id
         * Body 参数：CardData
         */
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/cards/${editingCard.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(saveData),
          }
        );

        const result = await response.json();

        if (result.success) {
          Alert.alert('成功', '卡牌已更新');
          setModalVisible(false);
          loadCards();
        } else {
          Alert.alert('错误', result.error || '保存失败');
        }
      } else {
        // 创建新卡牌
        /**
         * 服务端文件：server/src/routes/game.ts
         * 接口：POST /api/v1/cards
         * Body 参数：CardData
         */
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/cards`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(saveData),
          }
        );

        const result = await response.json();

        if (result.success) {
          Alert.alert('成功', '卡牌已创建');
          setModalVisible(false);
          loadCards();
        } else {
          Alert.alert('错误', result.error || '创建失败');
        }
      }
    } catch (error) {
      console.error('保存卡牌失败:', error);
      Alert.alert('错误', '网络请求失败');
    }
  };

  // 添加效果
  const handleAddEffect = () => {
    setEffects([...effects, '新效果']);
  };

  // 更新效果
  const handleUpdateEffect = (index: number, value: string) => {
    const newEffects = [...effects];
    newEffects[index] = value;
    setEffects(newEffects);
  };

  // 删除效果
  const handleRemoveEffect = (index: number) => {
    setEffects(effects.filter((_, i) => i !== index));
  };

  // 渲染筛选标签
  const renderFilterTabs = () => {
    return (
      <View style={styles.filterContainer}>
        {/* 阵营筛选 */}
        <View style={styles.filterSection}>
          <ThemedText variant="small" color={theme.textMuted} style={styles.filterLabel}>
            阵营
          </ThemedText>
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              <TouchableOpacity
                style={[styles.filterChip, selectedFaction === 'ALL' && styles.filterChipActive]}
                onPress={() => setSelectedFaction('ALL')}
              >
                <ThemedText
                  variant="small"
                  color={selectedFaction === 'ALL' ? '#FFFFFF' : theme.textPrimary}
                >
                  全部
                </ThemedText>
              </TouchableOpacity>
              {FACTIONS.map((faction) => (
                <TouchableOpacity
                  key={faction.value}
                  style={[
                    styles.filterChip,
                    selectedFaction === faction.value && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedFaction(faction.value)}
                >
                  <FontAwesome6
                    name={faction.icon as any}
                    size={12}
                    color={selectedFaction === faction.value ? '#FFFFFF' : theme.textMuted}
                    style={styles.filterChipIcon}
                  />
                  <ThemedText
                    variant="small"
                    color={selectedFaction === faction.value ? '#FFFFFF' : theme.textPrimary}
                  >
                    {faction.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* 类型筛选 */}
        <View style={styles.filterSection}>
          <ThemedText variant="small" color={theme.textMuted} style={styles.filterLabel}>
            类型
          </ThemedText>
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              <TouchableOpacity
                style={[styles.filterChip, selectedType === 'ALL' && styles.filterChipActive]}
                onPress={() => setSelectedType('ALL')}
              >
                <ThemedText
                  variant="small"
                  color={selectedType === 'ALL' ? '#FFFFFF' : theme.textPrimary}
                >
                  全部
                </ThemedText>
              </TouchableOpacity>
              {CARD_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[styles.filterChip, selectedType === type.value && styles.filterChipActive]}
                  onPress={() => setSelectedType(type.value)}
                >
                  <FontAwesome6
                    name={type.icon as any}
                    size={12}
                    color={selectedType === type.value ? '#FFFFFF' : theme.textMuted}
                    style={styles.filterChipIcon}
                  />
                  <ThemedText
                    variant="small"
                    color={selectedType === type.value ? '#FFFFFF' : theme.textPrimary}
                  >
                    {type.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* 稀有度筛选 */}
        <View style={styles.filterSection}>
          <ThemedText variant="small" color={theme.textMuted} style={styles.filterLabel}>
            稀有度
          </ThemedText>
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              <TouchableOpacity
                style={[styles.filterChip, selectedRarity === 'ALL' && styles.filterChipActive]}
                onPress={() => setSelectedRarity('ALL')}
              >
                <ThemedText
                  variant="small"
                  color={selectedRarity === 'ALL' ? '#FFFFFF' : theme.textPrimary}
                >
                  全部
                </ThemedText>
              </TouchableOpacity>
              {RARITIES.map((rarity) => (
                <TouchableOpacity
                  key={rarity.value}
                  style={[
                    styles.filterChip,
                    selectedRarity === rarity.value && styles.filterChipActive,
                    { borderColor: selectedRarity === rarity.value ? rarity.color : theme.borderLight },
                  ]}
                  onPress={() => setSelectedRarity(rarity.value)}
                >
                  <ThemedText
                    variant="small"
                    color={selectedRarity === rarity.value ? '#FFFFFF' : theme.textPrimary}
                  >
                    {rarity.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  };

  // 渲染卡牌列表
  const renderCardsList = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ThemedText variant="body" color={theme.textMuted}>加载中...</ThemedText>
        </View>
      );
    }

    if (filteredCards.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <FontAwesome6 name="clone" size={64} color={theme.textMuted} />
          <ThemedText variant="body" color={theme.textMuted} style={styles.emptyText}>
            没有找到符合条件的卡牌
          </ThemedText>
        </View>
      );
    }

    return (
      <View style={styles.cardsGrid}>
        {filteredCards.map((card, index) => {
          // 获取稀有度配置
          const rarityConfig = RARITIES.find(r => r.value === card.rarity);
          const factionConfig = FACTIONS.find(f => f.value === card.faction);

          // 根据稀有度选择边框颜色（塔罗牌风格）
          const getBorderColor = () => {
            switch (card.rarity) {
              case 'LEGENDARY': return '#C17A5B'; // 黏土橙（传说）
              case 'EPIC': return '#8B7355';      // 暖棕色（史诗）
              case 'RARE': return '#D4A574';      // 土黄色（稀有）
              default: return '#C17A5B';         // 默认黏土橙
            }
          };

          // 根据阵营选择背景色（塔罗牌风格）
          const getFactionColor = () => {
            switch (card.faction) {
              case 'ENGLAND': return '#4A6FA5';   // 钴蓝色
              case 'FRANCE': return '#E84A4A';    // 亮红色
              case 'HRE': return '#8B7355';       // 暖棕色
              case 'VIKING': return '#059669';    // 维京绿
              case 'BYZANTIUM': return '#7C3AED';  // 拜占庭紫
              default: return '#6B7280';          // 中立灰
            }
          };

          // 获取卡牌类型图标
          const getTypeIcon = () => {
            switch (card.type) {
              case 'UNIT': return 'user-shield';
              case 'TACTIC': return 'crosshairs';
              case 'BUILDING': return 'landmark';
              default: return 'clone';
            }
          };

          return (
            <TouchableOpacity
              key={`${card.id}-${index}`}
              onPress={() => handleEditCard(card)}
              activeOpacity={0.7}
              onLongPress={() => handleDeleteCard(card)}
            >
              <View style={[styles.cardWrapper, { borderColor: getBorderColor() }]}>
                {/* 阵营背景层 */}
                <View style={[styles.cardBackground, { backgroundColor: getFactionColor() }]} />

                {/* 卡牌内边框装饰 */}
                <View style={styles.cardInnerBorder} />

                {/* 顶部费用区域 */}
                <View style={styles.cardCostSection}>
                  {/* 费用徽章 */}
                  <View style={[
                    styles.costBadge,
                    card.rarity === 'LEGENDARY' && styles.costBadgeLegendary,
                    card.rarity === 'EPIC' && styles.costBadgeEpic,
                    card.rarity === 'RARE' && styles.costBadgeRare,
                  ]}>
                    <Text style={styles.costText}>{card.cost}</Text>
                  </View>

                  {/* 稀有度标记 */}
                  <View style={[styles.rarityBadge, { backgroundColor: rarityConfig?.color || '#9CA3AF' }]} />
                </View>

                {/* 卡牌图片/图标区域 */}
                <View style={styles.cardImageArea}>
                  {card.type === 'UNIT' ? (
                    // 单位卡显示士兵图标
                    <FontAwesome6
                      name={getTypeIcon() as any}
                      size={64}
                      color="rgba(139, 115, 85, 0.4)"
                    />
                  ) : (
                    // 战术/建筑卡显示对应图标
                    <FontAwesome6
                      name={getTypeIcon() as any}
                      size={72}
                      color="rgba(139, 115, 85, 0.5)"
                    />
                  )}
                </View>

                {/* 卡牌信息区域 */}
                <View style={styles.cardInfoSection}>
                  {/* 卡牌名称 */}
                  <Text style={styles.cardName} numberOfLines={2}>
                    {card.name}
                  </Text>

                  {/* 阵营标签 */}
                  <View style={styles.factionBadge}>
                    <FontAwesome6
                      name={factionConfig?.icon as any}
                      size={14}
                      color={theme.textPrimary}
                    />
                    <Text style={styles.factionBadgeText}>
                      {factionConfig?.label}
                    </Text>
                  </View>

                  {/* 类型标签 */}
                  <View style={styles.typeBadge}>
                    <FontAwesome6
                      name={getTypeIcon() as any}
                      size={14}
                      color={theme.textSecondary}
                    />
                    <Text style={styles.typeBadgeText}>
                      {CARD_TYPES.find(t => t.value === card.type)?.label}
                    </Text>
                  </View>
                </View>

                {/* 底部属性区域 */}
                <View style={styles.cardStatsSection}>
                  {/* 单位卡：攻击力和生命值 */}
                  {card.type === 'UNIT' && (
                    <>
                      {card.attack !== null && (
                        <View style={styles.attackBadge}>
                          <Text style={styles.attackText}>{card.attack}</Text>
                        </View>
                      )}
                      {card.health !== null && (
                        <View style={styles.healthBadge}>
                          <Text style={styles.healthText}>{card.health}</Text>
                        </View>
                      )}
                    </>
                  )}

                  {/* 建筑卡：耐久度 */}
                  {card.type === 'BUILDING' && card.durability !== null && (
                    <View style={[styles.healthBadge, { borderColor: '#F59E0B' }]}>
                      <Text style={styles.healthText}>{card.durability}</Text>
                    </View>
                  )}

                  {/* 战术卡：无属性 */}
                  {card.type === 'TACTIC' && <View />}
                </View>

                {/* 底部稀有度边框 */}
                <View style={[styles.rarityBorder, { backgroundColor: getBorderColor() }]} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // 渲染选择器
  const renderSelector = (
    label: string,
    options: { value: string; label: string; icon?: string }[],
    selected: string,
    onSelect: (value: string) => void
  ) => {
    return (
      <View style={styles.inputGroup}>
        <ThemedText variant="small" color={theme.textSecondary} style={styles.inputLabel}>
          {label}
        </ThemedText>
        <View style={styles.selectorContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.selectorChip,
                  selected === option.value && styles.selectorChipActive,
                  {
                    backgroundColor: selected === option.value ? theme.primary : theme.backgroundTertiary,
                    borderColor: selected === option.value ? theme.primary : theme.borderLight,
                  },
                ]}
                onPress={() => onSelect(option.value)}
              >
                {option.icon && (
                  <FontAwesome6
                    name={option.icon as any}
                    size={12}
                    color={selected === option.value ? '#FFFFFF' : theme.textMuted}
                    style={styles.selectorChipIcon}
                  />
                )}
                <ThemedText
                  variant="small"
                  color={selected === option.value ? '#FFFFFF' : theme.textPrimary}
                >
                  {option.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  // 渲染表单输入框
  const renderInput = (
    label: string,
    key: keyof CardData,
    keyboardType: 'default' | 'numeric' = 'default',
    multiline: boolean = false
  ) => {
    const value = formData[key]?.toString() || '';

    return (
      <View style={styles.inputGroup}>
        <ThemedText variant="small" color={theme.textSecondary} style={styles.inputLabel}>
          {label}
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.backgroundTertiary, color: theme.textPrimary },
            multiline && styles.inputMultiline,
          ]}
          value={value}
          onChangeText={(text) => {
            const numValue = keyboardType === 'numeric' ? Number(text) : text;
            setFormData({ ...formData, [key]: numValue });
          }}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
        />
      </View>
    );
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle="dark">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadCards} />}
      >
        <ThemedView level="root" style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <ThemedText variant="h2" color={theme.textPrimary}>卡牌编辑器</ThemedText>
              <ThemedText variant="small" color={theme.textMuted}>
                图形化设计游戏卡牌
              </ThemedText>
            </View>
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: theme.primary }]}
              onPress={handleCreateCard}
            >
              <FontAwesome6 name="plus" size={16} color="#FFFFFF" />
              <ThemedText variant="small" color="#FFFFFF" style={styles.createButtonText}>
                新建卡牌
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>

        {/* 筛选器 */}
        {renderFilterTabs()}

        {/* 卡牌列表 */}
        {renderCardsList()}

        {/* 提示信息 */}
        <ThemedView level="tertiary" style={styles.hintBox}>
          <FontAwesome6 name="circle-info" size={16} color={theme.textMuted} />
          <ThemedText variant="small" color={theme.textMuted} style={styles.hintText}>
            点击卡牌编辑，长按删除
          </ThemedText>
        </ThemedView>
      </ScrollView>

      {/* 编辑/创建 Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={'padding' as const}>
            <View style={styles.modalContainer}>
              <View style={[styles.modalContent, { backgroundColor: theme.backgroundDefault }]}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <ThemedText variant="h3" color={theme.textPrimary}>
                  {editingCard ? '编辑卡牌' : '创建卡牌'}
                </ThemedText>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <FontAwesome6 name="xmark" size={24} color={theme.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Body */}
              <ScrollView style={styles.modalBody}>
                {/* 基础信息 */}
                <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
                  基础信息
                </ThemedText>
                {renderInput('卡牌名称', 'name')}
                {renderInput('法力消耗', 'cost', 'numeric')}
                {renderInput('描述', 'description', 'default', true)}
                {renderInput('背景文本', 'flavorText', 'default', true)}

                {/* 阵营和类型 */}
                <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
                  阵营与分类
                </ThemedText>
                {renderSelector('阵营', FACTIONS, formData.faction || 'ENGLAND', (value) =>
                  setFormData({ ...formData, faction: value as any })
                )}
                {renderSelector('类型', CARD_TYPES, formData.type || 'UNIT', (value) =>
                  setFormData({ ...formData, type: value as any })
                )}
                {renderSelector('稀有度', RARITIES, formData.rarity || 'COMMON', (value) =>
                  setFormData({ ...formData, rarity: value as any })
                )}

                {/* 子类型选择 */}
                {formData.type === 'UNIT' && (
                  <>
                    <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
                      单位属性
                    </ThemedText>
                    {renderSelector('单位类型', UNIT_TYPES, selectedUnitType, setSelectedUnitType)}
                    {renderInput('攻击力', 'attack', 'numeric')}
                    {renderInput('生命值', 'health', 'numeric')}
                    {renderInput('移动力', 'movement', 'numeric')}
                  </>
                )}

                {formData.type === 'BUILDING' && (
                  <>
                    <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
                      建筑属性
                    </ThemedText>
                    {renderSelector('建筑类型', BUILDING_TYPES, selectedBuildingType, setSelectedBuildingType)}
                    {renderInput('耐久度', 'durability', 'numeric')}
                  </>
                )}

                {formData.type === 'TACTIC' && (
                  <>
                    <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
                      战术属性
                    </ThemedText>
                    {renderSelector('战术类型', TACTIC_TYPES, selectedTacticType, setSelectedTacticType)}
                  </>
                )}

                {/* 效果编辑器 */}
                {(formData.type === 'UNIT' || formData.type === 'BUILDING' || formData.type === 'TACTIC') && (
                  <>
                    <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
                      能力效果
                    </ThemedText>
                    <View style={styles.effectsList}>
                      {effects.map((effect, index) => (
                        <View key={index} style={styles.effectItem}>
                          <TextInput
                            style={[styles.input, styles.effectInput, { backgroundColor: theme.backgroundTertiary, color: theme.textPrimary }]}
                            value={effect}
                            onChangeText={(text) => handleUpdateEffect(index, text)}
                            placeholder="输入效果描述"
                          />
                          <TouchableOpacity
                            style={styles.effectRemoveButton}
                            onPress={() => handleRemoveEffect(index)}
                          >
                            <FontAwesome6 name="trash" size={16} color={theme.error} />
                          </TouchableOpacity>
                        </View>
                      ))}
                      <TouchableOpacity
                        style={[styles.effectAddButton, { backgroundColor: theme.backgroundTertiary, borderColor: theme.borderLight }]}
                        onPress={handleAddEffect}
                      >
                        <FontAwesome6 name="plus" size={14} color={theme.textMuted} />
                        <ThemedText variant="small" color={theme.textMuted}>
                          添加效果
                        </ThemedText>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </ScrollView>

              {/* Footer */}
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <ThemedText variant="bodyMedium" color={theme.textMuted}>
                    取消
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton, { backgroundColor: theme.primary }]}
                  onPress={handleSaveCard}
                >
                  <ThemedText variant="bodyMedium" color="#FFFFFF">
                    {editingCard ? '保存' : '创建'}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      </Modal>
    </Screen>
  );
}
