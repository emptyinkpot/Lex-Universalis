import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundRoot,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.lg,
      borderBottomWidth: 0.5,
      borderBottomColor: 'rgba(0,47,167,0.15)',
    },
    factionSelector: {
      flexDirection: 'row',
      padding: Spacing.lg,
      gap: Spacing.sm,
    },
    factionButton: {
      flex: 1,
      paddingVertical: Spacing.sm,
      alignItems: 'center',
      backgroundColor: theme.backgroundTertiary,
      borderWidth: 0.5,
      borderColor: 'rgba(0,47,167,0.15)',
    },
    factionButtonActive: {
      backgroundColor: '#002FA7',
      borderColor: '#C9A96E',
    },
    deckStats: {
      flexDirection: 'row',
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.lg,
      borderBottomWidth: 0.5,
      borderBottomColor: 'rgba(0,47,167,0.15)',
      gap: Spacing.xl,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    statValue: {
      fontSize: 32,
      fontWeight: '200' as const,
    },
    statLabel: {
      marginLeft: 4,
    },
    section: {
      marginTop: Spacing.xl,
    },
    sectionTitle: {
      paddingHorizontal: Spacing.xl,
      marginBottom: Spacing.md,
      letterSpacing: 2,
      textTransform: 'uppercase' as const,
    },
    cardsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: Spacing.md,
      justifyContent: 'center',
      gap: Spacing.sm,
    },
    gridCard: {
      margin: Spacing.xs,
    },
    emptyDeck: {
      alignItems: 'center',
      paddingVertical: Spacing["4xl"],
      paddingHorizontal: Spacing.xl,
    },
    emptyText: {
      marginTop: Spacing.md,
      textAlign: 'center',
    },
    saveButton: {
      margin: Spacing.xl,
      marginTop: Spacing["2xl"],
      backgroundColor: '#002FA7',
      paddingVertical: Spacing.lg,
      alignItems: 'center',
      borderWidth: 0.5,
      borderColor: '#C9A96E',
      shadowColor: '#002FA7',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 4,
    },
  });
};
