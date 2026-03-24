import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      backgroundColor: theme.backgroundRoot,
    },
    heroSection: {
      backgroundColor: '#002FA7', // 克莱因蓝
      paddingVertical: Spacing["6xl"],
      paddingHorizontal: Spacing["2xl"],
      alignItems: 'center',
      borderBottomWidth: 0.5,
      borderBottomColor: '#C9A96E', // 香槟金边框
    },
    heroSubtitle: {
      fontSize: 11,
      letterSpacing: 8,
      textTransform: 'uppercase' as const,
      fontWeight: '300' as const,
      marginBottom: Spacing.md,
    },
    heroTitle: {
      fontSize: 48,
      fontWeight: '200' as const,
      color: '#FFFFFF',
      textAlign: 'center',
      letterSpacing: 2,
    },
    heroDivider: {
      width: 60,
      height: 0.5,
      backgroundColor: '#C9A96E',
      marginTop: Spacing.xl,
    },
    menuContainer: {
      padding: Spacing.xl,
    },
    menuItem: {
      backgroundColor: theme.backgroundDefault,
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.xl,
      marginBottom: Spacing.lg,
      borderWidth: 0.5,
      borderColor: 'rgba(0,47,167,0.1)',
      borderRadius: 0, // 直角 - 高端锐利感
      shadowColor: '#002FA7',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.08,
      shadowRadius: 24,
      elevation: 4,
    },
    menuIconContainer: {
      width: 64,
      height: 64,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.backgroundTertiary,
      marginRight: Spacing.lg,
    },
    menuTextContainer: {
      flex: 1,
    },
    menuSubtitle: {
      marginTop: 4,
      letterSpacing: 1,
    },
    footer: {
      padding: Spacing.xl,
      alignItems: 'center',
      paddingBottom: Spacing["5xl"],
    },
    footerText: {
      letterSpacing: 2,
      textTransform: 'uppercase' as const,
      fontWeight: '300' as const,
    },
  });
};
