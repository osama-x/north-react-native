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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    logo: {
      width: 120,
      height: 40,
      resizeMode: 'contain',
    },
    saveButton: {
      backgroundColor: theme.accent,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
    },
    saveButtonText: {
      color: '#ffffff',
      fontWeight: '800',
      fontSize: 14,
    },
    dayContainer: {
      marginTop: 24,
      paddingHorizontal: 20,
    },
    dayTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: theme.primary,
      marginBottom: 16,
    },
    nodeCard: {
      backgroundColor: theme.lightGray,
      borderRadius: 20,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    nodeCardSelected: {
      borderColor: theme.accent,
      backgroundColor: theme.accent + '05',
    },
    nodeCardFixed: {
      opacity: 0.9,
    },
    nodeTimeContainer: {
      marginRight: 16,
      alignItems: 'center',
      width: 60,
    },
    nodeTime: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.accent,
    },
    nodeContent: {
      flex: 1,
    },
    nodeDescription: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.primary,
    },
    nodeDetails: {
      fontSize: 12,
      color: theme.tertiary,
      marginTop: 2,
    },
    nodeAction: {
      marginLeft: 12,
    },
    staySection: {
      marginTop: 12,
      marginBottom: 32,
    },
    stayScroll: {
      paddingRight: 20,
    },
    stayCard: {
      width: width * 0.5,
      backgroundColor: theme.background,
      borderRadius: 16,
      padding: 12,
      marginRight: 12,
      borderWidth: 1.5,
      borderColor: theme.border,
    },
    stayCardSelected: {
      borderColor: theme.accent,
      backgroundColor: theme.accent + '05',
    },
    stayLevel: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.tertiary,
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    stayName: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.primary,
      marginBottom: 4,
    },
    stayCost: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.accent,
    },
    costBar: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      backgroundColor: theme.primary, // Dark bar
      borderRadius: 20,
      padding: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    costLabel: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 14,
      fontWeight: '600',
    },
    costValue: {
      color: '#ffffff',
      fontSize: 22,
      fontWeight: '900',
    },
  });
};
