import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export const createStyles = (colorScheme: 'light' | 'dark') => {
  const theme = Colors[colorScheme ?? 'light'];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    iconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.accent + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 32,
    },
    title: {
      fontSize: 28,
      fontWeight: '800',
      color: theme.primary,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.tertiary,
      textAlign: 'center',
      marginBottom: 48,
    },
    stepsContainer: {
      width: '100%',
      paddingHorizontal: 20,
    },
    stepRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    stepIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.border,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    stepIconSuccess: {
      backgroundColor: theme.accent,
      borderColor: theme.accent,
    },
    stepIconActive: {
      borderColor: theme.accent,
    },
    stepText: {
      fontSize: 16,
      color: theme.tertiary,
      fontWeight: '500',
    },
    stepTextActive: {
      color: theme.primary,
      fontWeight: '700',
    },
    stepTextSuccess: {
      color: theme.primary,
    },
    errorContainer: {
      width: '100%',
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
      borderRadius: 24,
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.3)',
      padding: 24,
      alignItems: 'center',
      marginTop: 20,
    },
    errorIconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: 'rgba(239, 68, 68, 0.25)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    errorTitle: {
      fontSize: 20,
      color: '#ffffff',
      textAlign: 'center',
      marginBottom: 8,
    },
    errorText: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.85)',
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 24,
    },
    tryAgainButton: {
      backgroundColor: '#ffffff',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    tryAgainButtonText: {
      color: '#2e8b58',
      fontSize: 15,
      fontWeight: '700',
    },
  });
};
