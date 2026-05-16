import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');

export const createStyles = (colorScheme: 'light' | 'dark') => {
  const theme = Colors[colorScheme ?? 'light'];

  return StyleSheet.create({
    container: {
      flex: 1,
      // background is handled by GlassBackground now
    },

    headerTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: theme.primary,
    },
    searchButton: {
      padding: 8,
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    section: {
      marginTop: 20,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.primary,
    },
    moreText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.accent,
    },
    planScroll: {
      paddingLeft: 20,
      paddingRight: 10,
    },
    planCard: {
      width: width * 0.7,
      height: 180,
      borderRadius: 24,
      backgroundColor: theme.glassCardBg,
      borderWidth: 1,
      borderColor: theme.glassCardBorder,
      marginRight: 15,
      padding: 20,
      justifyContent: 'flex-end',
      shadowColor: theme.dark,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
    },
    planDuration: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.accent,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 4,
    },
    planTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: theme.primary,
      marginBottom: 8,
    },
    planDescription: {
      fontSize: 13,
      color: theme.tertiary,
      lineHeight: 18,
    },
    destinationGrid: {
      paddingHorizontal: 20,
      paddingBottom: 120, // extra padding for bottom nav
    },
    destinationCard: {
      width: '100%',
      backgroundColor: theme.glassCardBg,
      borderRadius: 28,
      marginBottom: 24,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.glassCardBorder,
      shadowColor: theme.dark,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 5,
    },
    destinationImage: {
      width: '100%',
      height: 220,
      backgroundColor: theme.lightGray,
    },
    imageOverlay: {
      position: 'absolute',
      top: 15,
      right: 15,
      backgroundColor: theme.glassBg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.glassBorder,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    destinationContent: {
      padding: 20,
    },
    destinationName: {
      fontSize: 24,
      fontWeight: '800',
      color: theme.primary,
      marginBottom: 4,
    },
    destinationTagline: {
      fontSize: 15,
      color: theme.tertiary,
      fontWeight: '600',
      marginBottom: 12,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    ratingText: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.primary,
    },
    searchInputContainer: {
      marginHorizontal: 20,
      marginVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.glassCardBg,
      borderRadius: 16,
      paddingHorizontal: 15,
      height: 50,
      borderWidth: 1,
      borderColor: theme.glassCardBorder,
    },
    searchInput: {
      flex: 1,
      marginLeft: 10,
      fontSize: 16,
      color: theme.primary,
    },
  });
};
