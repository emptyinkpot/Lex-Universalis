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
    heroSection: {
      backgroundColor: '#002FA7', // 克莱因蓝
      paddingTop: Spacing['2xl'],
      paddingBottom: Spacing.xl,
      paddingHorizontal: Spacing.lg,
    },
    heroHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    heroTitleContainer: {
      flex: 1,
    },
    heroSubtitle: {
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginBottom: Spacing.xs,
    },
    heroTitle: {
      fontSize: 36,
      fontWeight: 'bold',
    },
    heroDivider: {
      height: 1,
      backgroundColor: 'rgba(201, 169, 110, 0.3)', // 香槟金
      marginVertical: Spacing.lg,
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    progressLabel: {
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    progressValue: {
      fontSize: 28,
      fontWeight: 'bold',
    },
    scenariosContainer: {
      padding: Spacing.lg,
      gap: Spacing.lg,
    },
    sectionTitle: {
      marginBottom: Spacing.lg,
    },
    scenarioCard: {
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      flexDirection: 'row',
      gap: Spacing.lg,
      borderWidth: 1,
      borderColor: theme.border,
      position: 'relative',
      overflow: 'hidden',
    },
    yearBadge: {
      width: 72,
      height: 72,
      borderRadius: BorderRadius.lg,
      backgroundColor: '#C9A96E', // 香槟金
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#C9A96E',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    yearText: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    scenarioContent: {
      flex: 1,
      justifyContent: 'center',
    },
    scenarioHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.sm,
    },
    scenarioName: {
      flex: 1,
      marginRight: Spacing.sm,
    },
    eraBadge: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      backgroundColor: 'rgba(201, 169, 110, 0.1)',
      borderRadius: BorderRadius.sm,
    },
    scenarioDescription: {
      marginBottom: Spacing.xs,
      lineHeight: 20,
    },
    scenarioBackground: {
      marginBottom: Spacing.sm,
      lineHeight: 18,
    },
    scenarioMeta: {
      flexDirection: 'row',
      gap: Spacing.lg,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
  });
};
