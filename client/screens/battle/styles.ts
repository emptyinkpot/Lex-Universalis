import { StyleSheet, Dimensions } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundRoot,
    },
    // 敌方信息栏 - 紧凑设计
    enemyInfoBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.md,
      paddingVertical: 8,
      backgroundColor: '#002FA7',
      borderBottomWidth: 0.5,
      borderBottomColor: '#C9A96E',
      minHeight: 44,
    },
    enemyNameSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    enemyName: {
      letterSpacing: 1,
      fontWeight: '500',
    },
    enemyStats: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    // 紧凑统计项
    statItemCompact: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    statTextCompact: {
      fontWeight: '600',
      fontSize: 13,
    },
    statDivider: {
      width: 1,
      height: 14,
      backgroundColor: 'rgba(255,255,255,0.3)',
      marginHorizontal: 4,
    },
    // 战场区域 - 自适应高度
    battlefield: {
      flex: 1,
      padding: Spacing.md,
      justifyContent: 'center',
      minHeight: 180,
    },
    battlefieldZone: {
      justifyContent: 'center',
      paddingVertical: Spacing.xs,
    },
    zoneRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      gap: Spacing.sm,
    },
    zoneSlot: {
      width: (width - Spacing.md * 2 - Spacing.sm * 2) / 3,
      aspectRatio: 3/4,
      backgroundColor: theme.backgroundTertiary,
      borderWidth: 1,
      borderColor: 'rgba(0,47,167,0.1)',
      borderRadius: BorderRadius.sm,
    },
    zoneSlotEmpty: {
      width: (width - Spacing.md * 2 - Spacing.sm * 2) / 3,
      aspectRatio: 3/4,
      backgroundColor: theme.backgroundTertiary,
      borderWidth: 1,
      borderColor: 'rgba(0,47,167,0.1)',
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: BorderRadius.sm,
    },
    divider: {
      height: 1,
      backgroundColor: 'rgba(0,47,167,0.1)',
      marginVertical: Spacing.sm,
    },
    // 手牌区域 - 扇形布局
    handContainer: {
      borderTopWidth: 0.5,
      borderTopColor: theme.border,
      paddingVertical: Spacing.xs, // 减小padding，让卡牌和操作栏更近
      backgroundColor: theme.backgroundDefault,
      height: 280, // 减小高度，避免actionBar被挤出屏幕
    },
    handInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.md,
      marginBottom: 4, // 减小margin
    },
    handLabel: {
      letterSpacing: 1,
      fontWeight: '600',
    },
    // 扇形布局容器 - 圆心在底部中央，扇形向上展开
    handFanContainer: {
      position: 'relative',
      width: '100%',
      height: 230, // 减小高度，避免actionBar被挤出屏幕
      alignItems: 'center',
      justifyContent: 'flex-end', // 圆心在底部
      paddingBottom: 0, // 移除padding，让卡牌底部和操作栏相切
    },
    // 操作按钮 - 包含玩家统计信息，在最底部
    actionBar: {
      flexDirection: 'row',
      gap: Spacing.sm,
      padding: Spacing.md,
      paddingTop: Spacing.sm, // 减小顶部padding，让卡牌和操作栏更近
      backgroundColor: theme.backgroundRoot,
      minHeight: 56,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    actionButtonSecondary: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      borderWidth: 1,
      borderColor: '#002FA7',
      borderRadius: BorderRadius.md,
      flexDirection: 'row',
      gap: Spacing.xs,
      alignItems: 'center',
    },
    buttonTextSecondary: {
      fontWeight: '600',
    },
    // 玩家统计信息 - 紧凑布局
    playerStatsCompact: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    statRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    // 回合徽章
    turnBadge: {
      backgroundColor: '#C9A96E',
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      borderRadius: 2,
    },
    turnText: {
      letterSpacing: 1,
      fontWeight: '600',
      fontSize: 11,
    },
    actionButtonPrimary: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.xl,
      backgroundColor: '#002FA7',
      borderWidth: 0.5,
      borderColor: '#C9A96E',
      borderRadius: BorderRadius.md,
    },
    buttonTextPrimary: {
      fontWeight: '700',
    },
  });
};
