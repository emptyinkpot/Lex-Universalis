import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      paddingBottom: Spacing['5xl'],
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.md,
    },
    loadingText: {
      marginTop: Spacing.md,
    },
    headerSection: {
      backgroundColor: '#002FA7', // 克莱因蓝
      paddingTop: Spacing['2xl'],
      paddingBottom: Spacing.xl,
      paddingHorizontal: Spacing.lg,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      padding: Spacing.sm,
      marginRight: Spacing.md,
    },
    headerTitleContainer: {
      flex: 1,
    },
    headerSubtitle: {
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginBottom: Spacing.xs,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
    },
    introSection: {
      padding: Spacing.lg,
    },
    introCard: {
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      backgroundColor: theme.backgroundDefault,
    },
    introHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      marginBottom: Spacing.md,
    },
    introText: {
      lineHeight: 22,
    },
    levelsSection: {
      padding: Spacing.lg,
      paddingTop: 0,
    },
    sectionTitle: {
      marginBottom: Spacing.lg,
    },
    levelsList: {
      gap: Spacing.md,
    },
    levelCard: {
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      flexDirection: 'row',
      gap: Spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
      position: 'relative',
      overflow: 'hidden',
    },
    levelCardLocked: {
      opacity: 0.5,
      backgroundColor: theme.backgroundTertiary,
    },
    levelCardCompleted: {
      borderColor: '#10B981', // 绿色
      borderWidth: 1.5,
    },
    levelNumber: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.md,
      backgroundColor: theme.backgroundTertiary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    levelNumberLocked: {
      backgroundColor: theme.border,
    },
    levelNumberCompleted: {
      backgroundColor: '#10B981', // 绿色
      borderColor: '#10B981',
    },
    levelContent: {
      flex: 1,
      justifyContent: 'center',
    },
    levelHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.xs,
    },
    levelName: {
      flex: 1,
      marginRight: Spacing.sm,
    },
    levelDescription: {
      marginBottom: Spacing.sm,
      lineHeight: 18,
    },
    levelMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    difficultyBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: theme.backgroundTertiary,
    },
    difficultyText: {
      textTransform: 'uppercase',
      fontSize: 11,
    },
    starsContainer: {
      flexDirection: 'row',
      gap: 2,
    },
    lockOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing.lg,
    },
    modalContent: {
      backgroundColor: theme.backgroundRoot,
      borderRadius: BorderRadius.lg,
      width: '100%',
      maxHeight: '80%',
      overflow: 'hidden',
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: Spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    modalBody: {
      padding: Spacing.lg,
    },
    storyCard: {
      borderRadius: BorderRadius.md,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
      backgroundColor: theme.backgroundTertiary,
    },
    storyIconContainer: {
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    storyText: {
      lineHeight: 22,
      textAlign: 'center',
    },
    conditionsContainer: {
      gap: Spacing.md,
      marginBottom: Spacing.lg,
    },
    conditionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      backgroundColor: theme.backgroundTertiary,
    },
    conditionTextContainer: {
      flex: 1,
    },
    rewardsContainer: {
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
    },
    rewardsTitle: {
      marginBottom: Spacing.md,
    },
    rewardItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      marginBottom: Spacing.sm,
    },
    modalFooter: {
      flexDirection: 'row',
      gap: Spacing.md,
      padding: Spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    modalButton: {
      flex: 1,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButton: {
      backgroundColor: theme.backgroundTertiary,
    },
    startButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#002FA7', // 克莱因蓝
    },
  });
};
