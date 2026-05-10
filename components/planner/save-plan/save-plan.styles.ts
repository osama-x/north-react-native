import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');

export const createStyles = (themeMode: 'light' | 'dark') => {
  const theme = Colors[themeMode];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      padding: 24,
      paddingTop: 40,
    },
    header: {
      marginBottom: 32,
    },
    phaseText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 12,
      color: theme.accent,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      marginBottom: 8,
    },
    title: {
      fontFamily: 'Outfit_700Bold',
      fontSize: 32,
      color: theme.primary,
      lineHeight: 40,
    },
    subtitle: {
      fontFamily: 'Inter_400Regular',
      fontSize: 16,
      color: theme.tertiary,
      marginTop: 12,
      lineHeight: 24,
    },
    inputSection: {
      marginTop: 20,
    },
    label: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      color: theme.primary,
      marginBottom: 12,
      marginLeft: 4,
    },
    inputWrapper: {
      backgroundColor: themeMode === 'light' ? '#f8f9fa' : 'rgba(255, 255, 255, 0.05)',
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: themeMode === 'light' ? '#e9ecef' : 'rgba(255, 255, 255, 0.1)',
      flexDirection: 'row',
      alignItems: 'center',
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      fontFamily: 'Inter_500Medium',
      fontSize: 16,
      color: theme.primary,
    },
    summaryCard: {
      backgroundColor: theme.accent + '10', // 10% opacity
      borderRadius: 20,
      padding: 20,
      marginTop: 40,
      borderWidth: 1,
      borderColor: theme.accent + '20',
    },
    summaryTitle: {
      fontFamily: 'Inter_700Bold',
      fontSize: 16,
      color: theme.accent,
      marginBottom: 16,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    summaryLabel: {
      fontFamily: 'Inter_500Medium',
      fontSize: 14,
      color: theme.tertiary,
    },
    summaryValue: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      color: theme.primary,
    },
    saveButton: {
      backgroundColor: theme.accent,
      borderRadius: 16,
      height: 60,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 'auto',
      marginBottom: 20,
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 8,
    },
    saveButtonText: {
      fontFamily: 'Inter_700Bold',
      fontSize: 16,
      color: '#ffffff',
      marginRight: 8,
    },
  });
};
