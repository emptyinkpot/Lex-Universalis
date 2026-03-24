import { StyleSheet } from 'react-native';
import { BorderRadius, Spacing, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => StyleSheet.create({
  page: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing['5xl'],
    gap: Spacing.lg,
  },
  headerCard: {
    borderRadius: BorderRadius['3xl'],
    padding: Spacing.lg,
    gap: Spacing.lg,
    borderWidth: 1,
    borderColor: theme.borderLight,
    backgroundColor: theme.backgroundDefault,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: theme.backgroundTertiary,
  },
  heroBlock: {
    gap: Spacing.sm,
  },
  heroTitle: {
    lineHeight: 42,
  },
  heroCopy: {
    maxWidth: 640,
    lineHeight: 22,
  },
  tabRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: theme.borderLight,
    backgroundColor: theme.backgroundTertiary,
  },
  tabChipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  sectionStack: {
    gap: Spacing.md,
  },
  calloutCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  worldCard: {
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  worldCopy: {
    lineHeight: 22,
  },
  quoteCard: {
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  quoteText: {
    lineHeight: 24,
    fontStyle: 'italic',
  },
});
