import { StyleSheet, Dimensions } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

const { width } = Dimensions.get('window');

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundRoot,
    },
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
    rulesBar: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      backgroundColor: theme.backgroundDefault,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    ruleChip: {
      flexGrow: 1,
      minWidth: 145,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.lg,
      backgroundColor: theme.backgroundTertiary,
      borderWidth: 1,
      borderColor: theme.borderLight,
      gap: 2,
    },
    ruleChipLabel: {
      letterSpacing: 1,
    },
    ruleChipValue: {
      lineHeight: 18,
    },
    battlefield: {
      flex: 1,
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.md,
      paddingBottom: Spacing.sm,
      gap: Spacing.sm,
    },
    battlefieldHeader: {
      gap: Spacing.xs,
    },
    battlefieldFocusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.sm,
    },
    battlefieldLabel: {
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    targetBadge: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      borderRadius: BorderRadius.full,
      backgroundColor: '#002FA7',
    },
    targetBadgeText: {
      letterSpacing: 1,
      fontWeight: '700',
    },
    selectionText: {
      lineHeight: 20,
    },
    swipeHintRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.xs,
    },
    swipeHint: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      borderRadius: BorderRadius.full,
      backgroundColor: theme.backgroundTertiary,
      overflow: 'hidden',
    },
    slotRowBlock: {
      gap: Spacing.sm,
    },
    rowHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    rowHeaderLabel: {
      letterSpacing: 1,
      fontWeight: '700',
    },
    rowHeaderHint: {
      lineHeight: 18,
      textAlign: 'right',
      flexShrink: 1,
    },
    slotRowGrid: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    battleDivider: {
      height: 1,
      backgroundColor: 'rgba(0,47,167,0.12)',
      marginVertical: Spacing.xs,
    },
    logPanel: {
      flexDirection: 'row',
      gap: Spacing.sm,
      paddingHorizontal: Spacing.md,
      paddingBottom: Spacing.sm,
      backgroundColor: theme.backgroundDefault,
      flexWrap: 'wrap',
    },
    logItem: {
      flex: 1,
      minWidth: 180,
      flexDirection: 'row',
      gap: Spacing.sm,
      padding: Spacing.sm,
      borderRadius: BorderRadius.lg,
      backgroundColor: theme.backgroundTertiary,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    logAccent: {
      width: 4,
      borderRadius: 999,
    },
    logCopy: {
      flex: 1,
      gap: 2,
    },
    logDetail: {
      lineHeight: 18,
    },
    handContainer: {
      borderTopWidth: 0.5,
      borderTopColor: theme.border,
      paddingVertical: Spacing.xs,
      backgroundColor: theme.backgroundDefault,
      height: 280,
    },
    handInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.md,
      marginBottom: 4,
    },
    handLabel: {
      letterSpacing: 1,
      fontWeight: '600',
    },
    handFanContainer: {
      position: 'relative',
      width: '100%',
      height: 230,
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingBottom: 0,
    },
    actionBar: {
      flexDirection: 'row',
      gap: Spacing.sm,
      padding: Spacing.md,
      paddingTop: Spacing.sm,
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
