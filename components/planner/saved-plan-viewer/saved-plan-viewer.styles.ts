import { StyleSheet, Dimensions, Platform } from 'react-native';
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
      paddingBottom: 160,
    },
    headerBtn: {
      padding: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 12,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // Editor Header (Consistent with app style)
    editorHeader: {
      marginTop: 10,
      marginHorizontal: 16,
      padding: 20,
      backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.border,
    },
    label: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.tertiary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 8,
    },
    input: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.primary,
      fontFamily: Platform.OS === 'ios' ? 'Outfit-Bold' : 'Outfit_700Bold',
      padding: 0, // Reset default padding
    },

    // Day Container (Exact match to Itinerary)
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

    // Sections
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 12,
      paddingRight: 4,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.tertiary,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    addBtnText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.accent,
    },

    // Activity Card (Must Have style)
    mustHaveCard: {
      backgroundColor: colorScheme === 'dark' ? '#1a1d2e' : '#ffffff',
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    activityCard: {
      backgroundColor: colorScheme === 'dark' ? 'rgba(46, 139, 88, 0.15)' : 'rgba(46, 139, 88, 0.08)',
      borderColor: 'rgba(46, 139, 88, 0.2)',
    },
    travelCard: {
      backgroundColor: colorScheme === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)',
      borderColor: 'rgba(59, 130, 246, 0.2)',
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
    arrivalNote: {
      fontSize: 12,
      color: theme.accent,
      fontFamily: Platform.OS === 'ios' ? 'Inter-SemiBold' : 'Inter_600SemiBold',
      marginTop: 8,
      backgroundColor: theme.accent + '10',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      alignSelf: 'flex-start',
    },
    cardTitleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cardTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: theme.primary,
      flex: 1,
    },
    cardSummary: {
      fontSize: 13,
      color: theme.tertiary,
      lineHeight: 18,
      marginTop: 4,
    },

    // Custom Badge
    customBadge: {
      backgroundColor: theme.accent,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      marginRight: 8,
      alignSelf: 'flex-start',
      marginBottom: 8,
    },
    customBadgeText: {
      color: '#fff',
      fontSize: 9,
      fontWeight: '900',
      textTransform: 'uppercase',
    },

    // Note Card (Premium version)
    noteCard: {
      backgroundColor: theme.accent + '05',
      borderRadius: 20,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.accent + '20',
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    noteIcon: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: theme.accent + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    noteContent: {
      flex: 1,
    },
    noteTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: theme.primary,
    },
    noteText: {
      fontSize: 13,
      color: theme.secondary,
      marginTop: 4,
      lineHeight: 18,
    },
    noteActions: {
      flexDirection: 'row',
      gap: 12,
      marginLeft: 8,
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
      backgroundColor: theme.accent,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      alignItems: 'center',
    },
    addedButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.accent,
    },
    addButtonText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '700',
    },
    addedButtonText: {
      color: theme.accent,
      fontSize: 12,
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

    // Modals (Improved Sheets)
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      padding: 24,
      paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    modalIndicator: {
      width: 40,
      height: 4,
      backgroundColor: theme.border,
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: theme.primary,
      marginBottom: 20,
    },
    modalInput: {
      backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      borderRadius: 16,
      padding: 16,
      fontSize: 16,
      color: theme.primary,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    modalTextArea: {
      minHeight: 120,
      textAlignVertical: 'top',
    },
    modalActions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
    },
    cancelBtn: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: 'center',
      backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    },
    saveBtn: {
      flex: 2,
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: 'center',
      backgroundColor: theme.accent,
    },
    btnText: {
      fontWeight: '700',
      fontSize: 16,
    },

    // Floating Cost Bar (Exact match to Itinerary)
    costBar: {
      position: 'absolute',
      bottom: 30,
      left: 20,
      right: 20,
      backgroundColor: '#010411',
      borderRadius: 24,
      padding: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.4,
          shadowRadius: 20,
        },
        android: {
          elevation: 10,
        },
      }),
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
