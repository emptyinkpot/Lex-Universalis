import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

// 塔罗牌风格的配色方案（大地色系）
const TAROT_COLORS = {
  // 主色系
  warmBrown: '#8B7355',      // 暖棕色
  earthYellow: '#D4A574',     // 土黄色
  clayOrange: '#C17A5B',       // 黏土橙

  // 辅色系
  cobaltBlue: '#4A6FA5',      // 钴蓝色
  brightRed: '#E84A4A',        // 亮红色
  offWhite: '#F5F5DC',         // 米白色

  // 背景
  cardInner: '#FDF5E6',        // 卡片内部背景（米杏色）
  cardOuter: '#C17A5B',        // 卡片外框

  // 文字
  darkBrown: '#5D4E37',        // 深棕色
  orange: '#C17A5B',           // 暖橙色
};

// 阵营主题色配置
const FACTION_COLORS = {
  ENGLAND: '#1E40AF',    // 英格兰蓝
  FRANCE: '#DC2626',     // 法兰西红
  HRE: '#F59E0B',        // 神圣罗马帝国金
  VIKING: '#059669',     // 维京绿
  BYZANTIUM: '#7C3AED',  // 拜占庭紫
  NEUTRAL: '#6B7280',    // 中立灰
};

// 稀有度颜色
const RARITY_COLORS = {
  COMMON: '#9CA3AF',     // 普通 - 灰色
  RARE: '#3B82F6',       // 稀有 - 蓝色
  EPIC: '#A855F7',       // 史诗 - 紫色
  LEGENDARY: '#F59E0B',  // 传说 - 金色
};

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing['2xl'],
      paddingBottom: Spacing['5xl'],
    },
    header: {
      marginBottom: Spacing.xl,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    createButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
      gap: Spacing.xs,
    },
    createButtonText: {
      marginLeft: Spacing.xs,
    },
    filterContainer: {
      marginBottom: Spacing.xl,
    },
    filterSection: {
      marginBottom: Spacing.md,
    },
    filterLabel: {
      marginBottom: Spacing.sm,
    },
    filterScroll: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
    },
    filterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      marginRight: Spacing.sm,
      borderRadius: BorderRadius.md,
      backgroundColor: theme.backgroundTertiary,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    filterChipActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    filterChipIcon: {
      marginRight: Spacing.xs,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: Spacing['3xl'],
    },
    emptyText: {
      marginTop: Spacing.md,
      textAlign: 'center',
    },

    // ========== 塔罗牌风格网格布局 ==========
    cardsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: Spacing.lg,
      justifyContent: 'center',
    },
    gridCard: {
      width: '48%', // 2列布局，每列48%（留2%间距）
      aspectRatio: 0.714, // 固定卡牌比例 5:7 (标准扑克牌)
      marginHorizontal: '1%',
      marginBottom: Spacing.md,
    },

    // ========== 塔罗牌风格卡牌样式 ==========
    cardWrapper: {
      width: '100%',
      height: '100%',
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: TAROT_COLORS.cardInner,
      borderWidth: 3,
      borderColor: TAROT_COLORS.cardOuter,
      position: 'relative',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
    },

    // 卡牌背景层（根据阵营显示不同颜色）
    cardBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.12,
    },

    // 卡牌内边框装饰
    cardInnerBorder: {
      position: 'absolute',
      top: 4,
      left: 4,
      right: 4,
      bottom: 4,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(139, 115, 85, 0.2)',
      pointerEvents: 'none',
    },

    // 顶部费用区域
    cardCostSection: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '16%',
      paddingHorizontal: 10,
      paddingTop: 6,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      zIndex: 10,
    },

    // 费用徽章（塔罗牌风格六边形样式）
    costBadge: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: TAROT_COLORS.warmBrown,
      borderWidth: 2,
      borderColor: '#C9A96E', // 香槟金
      elevation: 3,
    },
    costBadgeLegendary: {
      borderColor: '#F59E0B', // 传说金
    },
    costBadgeEpic: {
      borderColor: '#A855F7', // 史诗紫
    },
    costBadgeRare: {
      borderColor: '#3B82F6', // 稀有蓝
    },

    costText: {
      fontSize: 18,
      fontWeight: '800',
      color: '#ffffff',
    },

    // 稀有度标记（右上角）
    rarityBadge: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#9CA3AF',
    },

    // 卡牌图片区域（单位卡显示图片，战术/建筑显示图标）
    cardImageArea: {
      position: 'absolute',
      top: '15%',
      left: 10,
      right: 10,
      height: '36%',
      borderRadius: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.15)',
      borderWidth: 1,
      borderColor: 'rgba(139, 115, 85, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },

    // 卡牌中央图标（战术/建筑使用）
    cardCenterIcon: {
      fontSize: 56,
      color: 'rgba(139, 115, 85, 0.4)',
    },

    // 卡牌信息区域
    cardInfoSection: {
      position: 'absolute',
      top: '54%',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 10,
      paddingTop: 6,
    },

    // 卡牌名称（塔罗牌风格标题）
    cardName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: TAROT_COLORS.darkBrown,
      textAlign: 'center',
      marginBottom: 8,
      lineHeight: 18,
      letterSpacing: 0.5,
      textTransform: 'uppercase' as const,
    },

    // 阵营标签
    factionBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      backgroundColor: 'rgba(139, 115, 85, 0.15)',
      marginBottom: 8,
      gap: 4,
    },

    factionBadgeText: {
      fontSize: 12,
      fontWeight: '600',
      color: TAROT_COLORS.darkBrown,
    },

    // 卡牌类型标签
    typeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
      backgroundColor: 'rgba(139, 115, 85, 0.1)',
      marginBottom: 12,
      gap: 4,
    },

    typeBadgeText: {
      fontSize: 12,
      color: '#666666',
    },

    // 底部属性区域
    cardStatsSection: {
      position: 'absolute',
      bottom: 8,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      alignItems: 'flex-end',
    },

    // 攻击力徽章
    attackBadge: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: TAROT_COLORS.warmBrown,
      borderWidth: 2,
      borderColor: '#DC2626', // 攻击力红色
      elevation: 3,
    },

    attackText: {
      fontSize: 18,
      fontWeight: '800',
      color: '#ffffff',
    },

    // 生命值徽章
    healthBadge: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: TAROT_COLORS.warmBrown,
      borderWidth: 2,
      borderColor: '#059669', // 生命值绿色
      elevation: 3,
    },

    healthText: {
      fontSize: 18,
      fontWeight: '800',
      color: '#ffffff',
    },

    // 底部稀有度边框
    rarityBorder: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 4,
      backgroundColor: '#9CA3AF',
    },

    hintBox: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.md,
      marginTop: Spacing.lg,
      borderRadius: BorderRadius.md,
      gap: Spacing.sm,
    },
    hintText: {
      flex: 1,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: Spacing.lg,
    },
    modalContent: {
      width: '100%',
      maxHeight: '90%',
      borderRadius: BorderRadius.xl,
      overflow: 'hidden',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: Spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    modalBody: {
      padding: Spacing.lg,
      maxHeight: '65%',
    },
    modalFooter: {
      flexDirection: 'row',
      padding: Spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.borderLight,
      gap: Spacing.md,
    },
    modalButton: {
      flex: 1,
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButton: {
      backgroundColor: theme.backgroundTertiary,
    },
    saveButton: {
      backgroundColor: theme.primary,
    },
    sectionTitle: {
      marginTop: Spacing.lg,
      marginBottom: Spacing.md,
    },
    inputGroup: {
      marginBottom: Spacing.lg,
    },
    inputLabel: {
      marginBottom: Spacing.xs,
    },
    input: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.md,
      fontSize: 14,
    },
    inputMultiline: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    selectorContainer: {
      marginTop: Spacing.xs,
    },
    selectorChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      marginRight: Spacing.sm,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
    },
    selectorChipActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    selectorChipIcon: {
      marginRight: Spacing.xs,
    },
    effectsList: {
      marginTop: Spacing.xs,
    },
    effectItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    effectInput: {
      flex: 1,
      marginRight: Spacing.sm,
    },
    effectRemoveButton: {
      padding: Spacing.sm,
      borderRadius: BorderRadius.sm,
      backgroundColor: theme.backgroundTertiary,
    },
    effectAddButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.md,
      marginTop: Spacing.sm,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      gap: Spacing.xs,
    },
  });
};
