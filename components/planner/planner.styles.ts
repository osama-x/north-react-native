import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');

export const createStyles = (colorScheme: 'light' | 'dark') => {
  const theme = Colors[colorScheme ?? 'light'];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
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
      backgroundColor: theme.accent + '15', // Subtle accent background
      borderWidth: 1.5,
      borderColor: theme.accent,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    myPlanTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.primary,
    },
    featuredScroll: {
      paddingRight: 20,
    },
    featuredCard: {
      width: width * 0.65,
      backgroundColor: theme.lightGray,
      borderRadius: 24,
      padding: 20,
      marginRight: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    featuredTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.primary,
      marginBottom: 8,
    },
    featuredSubtitle: {
      fontSize: 13,
      color: theme.tertiary,
      lineHeight: 18,
    },
    generateButton: {
      marginTop: 30,
      marginHorizontal: 20,
      backgroundColor: theme.accent,
      borderRadius: 20,
      height: 70,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 6,
      marginBottom: 40,
    },
    generateButtonText: {
      fontSize: 18,
      fontWeight: '800',
      color: '#ffffff',
      textTransform: 'lowercase',
    },
  });
};
