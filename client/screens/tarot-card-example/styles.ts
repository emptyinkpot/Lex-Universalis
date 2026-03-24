import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    scrollContent: {
      padding: Spacing.lg,
    },
    header: {
      marginBottom: Spacing['2xl'],
    },
    section: {
      marginBottom: Spacing['2xl'],
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
    },
    sectionTitle: {
      marginBottom: Spacing.lg,
    },
    description: {
      marginBottom: Spacing.sm,
    },
    cardRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: Spacing.md,
    },
    cardGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: Spacing.md,
    },
    illustration: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    figure: {
      width: 60,
      height: 120,
      position: 'relative',
    },
    head: {
      width: 20,
      height: 20,
      backgroundColor: '#E84A4A',
      borderRadius: 10,
      position: 'absolute',
      top: 0,
      left: 20,
    },
    body: {
      width: 40,
      height: 60,
      backgroundColor: '#D4A574',
      borderRadius: 8,
      position: 'absolute',
      top: 20,
      left: 10,
    },
    legs: {
      width: 40,
      height: 40,
      backgroundColor: '#8B7355',
      borderRadius: 6,
      position: 'absolute',
      top: 80,
      left: 10,
    },
    wolf: {
      width: 30,
      height: 20,
      backgroundColor: '#F5F5DC',
      borderRadius: 6,
      position: 'absolute',
      bottom: 20,
      right: 40,
    },
    table: {
      width: 80,
      height: 30,
      backgroundColor: '#8B7355',
      borderRadius: 4,
      position: 'absolute',
      bottom: 40,
      left: 20,
    },
    pillars: {
      flexDirection: 'row',
      gap: 40,
      position: 'absolute',
      bottom: 40,
    },
  });
};
