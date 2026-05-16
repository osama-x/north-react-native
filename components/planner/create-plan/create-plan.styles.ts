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
    scrollContent: {
      padding: 24,
      paddingBottom: 120, // extra padding to avoid tab bar overlap
    },
    header: {
      marginBottom: 32,
    },
    phaseText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.accent,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    title: {
      fontSize: 28,
      fontWeight: '800',
      color: theme.primary,
      marginTop: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.tertiary,
      marginBottom: 8,
      textTransform: 'uppercase',
    },
    inputContainer: {
      marginBottom: 20,
    },
    input: {
      backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : theme.lightGray,
      borderRadius: 16,
      padding: 16,
      fontSize: 16,
      color: theme.primary,
      borderWidth: 1,
      borderColor: theme.border,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    flex1: {
      flex: 1,
    },
    sliderSection: {
      marginTop: 10,
      marginBottom: 24,
    },
    sliderHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sliderValue: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.accent,
    },
    sliderTrack: {
      height: 8,
      borderRadius: 4,
      backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      width: '100%',
      // @ts-ignore - web support
      touchAction: 'none',
    },
    sliderFill: {
      height: '100%',
      backgroundColor: theme.accent,
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    sliderThumb: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: '#ffffff',
      borderWidth: 3,
      borderColor: theme.accent,
      marginRight: -8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    travelerSection: {
      backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : theme.lightGray,
      borderRadius: 24,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: theme.border,
    },
    travelerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    travelerInfo: {
      flex: 1,
    },
    travelerLabel: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.primary,
    },
    travelerSub: {
      fontSize: 12,
      color: theme.tertiary,
    },
    counter: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.background,
      borderRadius: 12,
      padding: 4,
      borderWidth: 1,
      borderColor: theme.border,
    },
    counterButton: {
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
    counterValue: {
      width: 30,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '700',
      color: theme.primary,
    },
    transportSection: {
      marginBottom: 32,
    },
    transportButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : theme.lightGray,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1.5,
      borderColor: 'transparent',
    },
    transportButtonActive: {
      borderColor: theme.accent,
      backgroundColor: theme.accent + '15',
    },
    transportLabel: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.primary,
      marginLeft: 12,
      flex: 1,
    },
    continueButton: {
      backgroundColor: theme.primary, // white
      borderRadius: 20,
      height: 64,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
      shadowColor: theme.dark,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 4,
    },
    continueButtonText: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.background, // dark green for contrast
    },
    // Location Suggestions
    suggestionsContainer: {
      position: 'absolute',
      top: 72,
      left: 0,
      right: 0,
      backgroundColor: colorScheme === 'dark' ? '#020617' : '#ffffff', // Extremely solid Slate 950 or White
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colorScheme === 'dark' ? '#1e293b' : '#e2e8f0',
      maxHeight: 250,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.5,
      shadowRadius: 30,
      elevation: 25,
      zIndex: 100000, // Even higher
      opacity: 1, // Explicitly opaque
      overflow: 'visible', // Allow shadow to show
    },
    suggestionItem: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: 'transparent',
    },
    suggestionName: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.primary,
    },
  });
};
