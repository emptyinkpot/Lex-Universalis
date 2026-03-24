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
      gap: Spacing.lg,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: BorderRadius.lg,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitleContainer: {
      flex: 1,
    },
    headerSubtitle: {
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 4,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
    },
    introSection: {
      padding: Spacing.lg,
    },
    introCard: {
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.borderLight,
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
    chaptersSection: {
      padding: Spacing.lg,
      paddingTop: 0,
    },
    sectionTitle: {
      marginBottom: Spacing.lg,
    },
    chapterSection: {
      marginBottom: Spacing.xl,
    },
    chapterHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.lg,
      paddingBottom: Spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    levelsList: {
      gap: Spacing.md,
    },
    levelCard: {
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      flexDirection: 'row',
      gap: Spacing.lg,
      borderWidth: 1,
      borderColor: theme.border,
      position: 'relative',
    },
    levelCardLocked: {
      backgroundColor: theme.backgroundTertiary,
      opacity: 0.6,
    },
    levelCardCompleted: {
      backgroundColor: 'rgba(16, 185, 129, 0.05)',
      borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    levelNumber: {
      width: 44,
      height: 44,
      borderRadius: BorderRadius.lg,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    levelNumberLocked: {
      backgroundColor: theme.border,
    },
    levelNumberCompleted: {
      backgroundColor: '#10B981',
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
    },
    levelDescription: {
      lineHeight: 18,
      marginBottom: Spacing.sm,
    },
    levelMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.lg,
    },
    difficultyBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    difficultyText: {
      fontWeight: '500',
    },
    factionBadge: {
      padding: 2,
      borderRadius: BorderRadius.sm,
    },
    starsContainer: {
      flexDirection: 'row',
      gap: 2,
    },
    lockOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'transparent',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      padding: Spacing.lg,
    },
    modalContent: {
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.lg,
      maxHeight: '85%',
      borderWidth: 1,
      borderColor: theme.border,
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
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.lg,
    },
    storyIconContainer: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.lg,
      backgroundColor: 'rgba(201, 169, 110, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.md,
      alignSelf: 'center',
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
      padding: Spacing.md,
      borderRadius: BorderRadius.md,
    },
    conditionTextContainer: {
      flex: 1,
    },
    rewardsContainer: {
      padding: Spacing.lg,
      backgroundColor: theme.backgroundTertiary,
      borderRadius: BorderRadius.lg,
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
      padding: Spacing.lg,
      gap: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    modalButton: {
      flex: 1,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButton: {
      backgroundColor: theme.backgroundTertiary,
    },
    startButton: {
      backgroundColor: theme.primary,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
  });
};
