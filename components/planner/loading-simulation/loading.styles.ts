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
  });
};
