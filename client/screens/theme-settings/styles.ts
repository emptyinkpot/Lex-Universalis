import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.xl,
      paddingBottom: Spacing['5xl'],
    },
    header: {
      marginBottom: Spacing.xl,
    },
    section: {
      marginBottom: Spacing.xl,
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
    },
    sectionTitle: {
      marginBottom: Spacing.lg,
    },
    modeOptions: {
      flexDirection: 'row',
      gap: Spacing.md,
    },
    modeOption: {
      flex: 1,
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.borderLight,
    },
    modeOptionActive: {
      borderColor: theme.primary,
    },
    modeOptionText: {
      marginTop: Spacing.sm,
    },
    themeList: {
      gap: Spacing.md,
    },
    themeCard: {
      flexDirection: 'row',
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      borderWidth: 2,
      backgroundColor: theme.backgroundTertiary,
    },
    themeCardSelected: {
      backgroundColor: theme.backgroundRoot,
      borderWidth: 2,
    },
    themePreview: {
      width: 60,
      height: 60,
      borderRadius: BorderRadius.md,
      overflow: 'hidden',
      marginRight: Spacing.md,
    },
    previewPrimary: {
      flex: 1,
    },
    previewBackground: {
      height: 30,
    },
    themeInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    selectedIndicator: {
      marginLeft: Spacing.md,
    },
    deleteButton: {
      padding: Spacing.sm,
      marginLeft: Spacing.md,
    },
    createButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      gap: Spacing.sm,
    },
    createButtonText: {
      color: '#FFFFFF',
    },
  });
};
