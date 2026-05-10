import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export const createStyles = (colorScheme: 'light' | 'dark') => {
  const theme = Colors[colorScheme ?? 'light'];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    hero: {
      height: height * 0.28,
      backgroundColor: theme.accent,
      justifyContent: 'flex-end',
      padding: 24,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
    },

    heroName: {
      fontSize: 40,
      fontWeight: '900',
      color: '#ffffff',
      letterSpacing: -1,
    },
    heroRegion: {
      fontSize: 18,
      color: 'rgba(255, 255, 255, 0.8)',
      fontWeight: '600',
      marginTop: 4,
    },
    ratingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginTop: 12,
    },
    ratingText: {
      color: '#ffffff',
      fontWeight: '700',
      marginLeft: 4,
    },
    content: {
      padding: 24,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: theme.primary,
      marginBottom: 16,
    },
    summaryText: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.tertiary,
      fontWeight: '500',
    },
    planCard: {
      backgroundColor: theme.lightGray,
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: theme.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    planContent: {
      flex: 1,
    },
    planTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.primary,
    },
    planSubtitle: {
      fontSize: 14,
      color: theme.tertiary,
      marginTop: 4,
    },
    planButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.accent,
      justifyContent: 'center',
      alignItems: 'center',
    },
    horizontalScroll: {
      paddingRight: 24,
    },
    stayCard: {
      width: width * 0.6,
      backgroundColor: theme.background,
      borderRadius: 20,
      padding: 16,
      marginRight: 16,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    stayType: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.accent,
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    stayName: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.primary,
      marginBottom: 8,
    },
    stayPrice: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.tertiary,
    },
    newsItem: {
      backgroundColor: theme.lightGray,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },
    newsTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.primary,
      marginBottom: 4,
    },
    newsDate: {
      fontSize: 12,
      color: theme.tertiary,
    },
  });
};
