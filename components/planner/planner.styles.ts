import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');

export const createStyles = (colorScheme: 'light' | 'dark') => {
  const theme = Colors[colorScheme ?? 'light'];

  return StyleSheet.create({
    container: {
      flex: 1,
      // background handled globally by GlassBackground
    },

    headerTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.primary,
    },
    myPlansButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    myPlansButtonText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#ffffff',
    },
    section: {
      marginTop: 24,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: theme.primary,
      marginBottom: 16,
    },
    myPlanCard: {
      padding: 18,
      borderRadius: 16,
      backgroundColor: theme.glassCardBg,
      borderWidth: 1.5,
      borderColor: theme.glassCardBorder,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: theme.dark,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    myPlanTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: '#ffffff',
    },
    featuredScroll: {
      paddingRight: 20,
    },
    featuredCard: {
      width: width * 0.65,
      backgroundColor: theme.glassCardBg,
      borderRadius: 24,
      padding: 20,
      marginRight: 16,
      borderWidth: 1,
      borderColor: theme.glassCardBorder,
      shadowColor: theme.dark,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    featuredTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: '#ffffff',
      marginBottom: 8,
    },
    featuredSubtitle: {
      fontSize: 13,
      color: 'rgba(255, 255, 255, 0.8)',
      lineHeight: 18,
    },
    generateButton: {
      marginTop: 30,
      marginHorizontal: 20,
      backgroundColor: colorScheme === 'dark' ? '#ffffff' : '#2e8b58', // Green in light mode, white in dark!
      borderRadius: 20,
      height: 70,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.dark,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
      marginBottom: 120, // extra padding for bottom nav
    },
    generateButtonText: {
      fontSize: 18,
      fontWeight: '800',
      color: colorScheme === 'dark' ? '#022c22' : '#ffffff', // deep green in dark, white in light!
      textTransform: 'lowercase',
    },
  });
};
