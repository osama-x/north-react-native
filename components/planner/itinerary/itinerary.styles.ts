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

    saveButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    saveButtonText: {
      color: '#ffffff',
      fontWeight: '700',
      fontSize: 13,
    },
    dayContainer: {
      marginTop: 20,
      marginHorizontal: 16,
      backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
      borderRadius: 24,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.border,
    },
    dayHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
    },
    dayTitleContainer: {
      flexDirection: 'column',
    },
    dayTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.primary,
    },
    dayDate: {
      fontSize: 12,
      color: theme.tertiary,
      marginTop: 2,
    },
    dayContent: {
      paddingBottom: 20,
      paddingHorizontal: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 12,
      paddingRight: 8,
      zIndex: 10,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.tertiary,
      marginLeft: 4,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    dropdownMenu: {
      position: 'absolute',
      top: 30,
      right: 0,
      backgroundColor: colorScheme === 'dark' ? '#1e293b' : '#ffffff',
      borderRadius: 12,
      padding: 8,
      minWidth: 160,
      zIndex: 100,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.border,
    },
    dropdownItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
    },
    dropdownText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.primary,
      marginLeft: 10,
    },
    // Must Have Card
    mustHaveCard: {
      backgroundColor: colorScheme === 'dark' ? '#1a1d2e' : '#ffffff',
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    timeTag: {
      backgroundColor: theme.accent + '15',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    timeText: {
      fontSize: 12,
      fontWeight: '800',
      color: theme.accent,
    },
    durationText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.tertiary,
    },
    cardTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: theme.primary,
      marginBottom: 6,
    },
    cardSummary: {
      fontSize: 13,
      color: theme.tertiary,
      lineHeight: 18,
    },
    arrivalNote: {
      fontSize: 12,
      color: theme.accent,
      fontFamily: 'Inter_600SemiBold',
      marginTop: 8,
      backgroundColor: theme.accent + '10',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      alignSelf: 'flex-start',
    },
    // Optional Activity Card
    optionalCard: {
      backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#ffffff',
      borderRadius: 18,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    optionalCardSelected: {
      borderColor: theme.accent,
      backgroundColor: theme.accent + '08',
    },
    optionalInfo: {
      flex: 1,
      marginRight: 12,
    },
    optionalTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.primary,
    },
    optionalDetails: {
      fontSize: 11,
      color: theme.tertiary,
      marginTop: 2,
    },
    activityActions: {
      flexDirection: 'column',
      alignItems: 'stretch',
      minWidth: 80,
    },
    addButton: {
      backgroundColor: '#2e8b58',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    addedButton: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: '#2e8b58',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addButtonText: {
      color: '#ffffff',
      fontSize: 13,
      fontWeight: '700',
    },
    addedButtonText: {
      color: '#2e8b58',
      fontSize: 13,
      fontWeight: '700',
    },
    skipButton: {
      marginTop: 8,
      paddingVertical: 6,
      alignItems: 'center',
    },
    skipButtonText: {
      color: theme.tertiary,
      fontSize: 12,
      fontWeight: '600',
      textDecorationLine: 'underline',
    },
    // Stay Options
    stayCard: {
      width: 160,
      height: 180,
      backgroundColor: theme.background,
      borderRadius: 20,
      marginRight: 12,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: theme.border,
    },
    stayCardSelected: {
      borderColor: theme.accent,
    },
    stayImage: {
      width: '100%',
      height: 100,
    },
    stayInfo: {
      padding: 10,
    },
    stayName: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.primary,
      marginBottom: 2,
    },
    stayPrice: {
      fontSize: 11,
      fontWeight: '800',
      color: theme.accent,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    ratingText: {
      fontSize: 10,
      color: theme.tertiary,
      marginLeft: 2,
    },
    // Cost Bar
    costBar: {
      position: 'absolute',
      bottom: 30,
      left: 20,
      right: 20,
      backgroundColor: '#010411', // Deep dark
      borderRadius: 24,
      padding: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 10,
    },
    costLabel: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    costValue: {
      color: '#ffffff',
      fontSize: 24,
      fontWeight: '900',
      marginTop: 2,
    },
  });
};
