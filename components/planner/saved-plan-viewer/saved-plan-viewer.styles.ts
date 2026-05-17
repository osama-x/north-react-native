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
      backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.03)' : theme.glassCardBg,
      borderRadius: 24,
      borderWidth: 1.5,
      borderColor: theme.border,
    },
    label: {
      fontSize: 12,
      fontWeight: '700',
      color: colorScheme === 'dark' ? theme.tertiary : 'rgba(255, 255, 255, 0.8)',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 8,
    },
    input: {
      fontSize: 18,
      fontWeight: '800',
      color: colorScheme === 'dark' ? theme.primary : '#ffffff',
      fontFamily: Platform.OS === 'ios' ? 'Outfit-Bold' : 'Outfit_700Bold',
      padding: 0, // Reset default padding
    },
    dateInputBox: {
      backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : theme.lightGray,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },

    // Day Container (Exact match to Itinerary)
    dayContainer: {
      marginTop: 20,
      marginHorizontal: 16,
      backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.03)' : theme.glassCardBg,
      borderRadius: 24,
      overflow: 'hidden',
      borderWidth: 1.5,
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
      color: colorScheme === 'dark' ? theme.primary : '#ffffff',
    },
    dayDate: {
      fontSize: 12,
      color: colorScheme === 'dark' ? theme.tertiary : 'rgba(255, 255, 255, 0.8)',
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
      color: colorScheme === 'dark' ? theme.tertiary : 'rgba(255, 255, 255, 0.8)',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    addBtnText: {
      fontSize: 12,
      fontWeight: '700',
      color: colorScheme === 'dark' ? theme.accent : '#fbd561',
    },

    // Activity Card (Must Have style)
    mustHaveCard: {
      backgroundColor: colorScheme === 'dark' ? '#1a1d2e' : '#ffffff',
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1.5,
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
      backgroundColor: colorScheme === 'dark' ? theme.accentOrange + '15' : '#ffffff',
      borderColor: colorScheme === 'dark' ? theme.accentOrange + '40' : '#cbd5e1',
    },
    travelCard: {
      backgroundColor: colorScheme === 'dark' ? theme.accentTeal + '20' : '#ffffff',
      borderColor: colorScheme === 'dark' ? theme.accentTeal + '50' : '#cbd5e1',
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    timeTag: {
      backgroundColor: theme.accentTeal + '25',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
    },
    timeText: {
      fontSize: 13,
      fontWeight: '900',
      color: theme.accentTeal,
      letterSpacing: 0.5,
    },
    durationText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.tertiary,
    },
    arrivalNote: {
      fontSize: 12,
      color: theme.primary,
      fontFamily: Platform.OS === 'ios' ? 'Inter-SemiBold' : 'Inter_600SemiBold',
      marginTop: 8,
      backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
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
      backgroundColor: theme.accentOrange,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      marginRight: 8,
    },
    customBadgeText: {
      color: '#fff',
      fontSize: 9,
      fontWeight: '900',
      textTransform: 'uppercase',
    },

    // Note Card (Premium version)
    noteCard: {
      backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
      borderRadius: 20,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#cbd5e1',
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
    modalFieldLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.tertiary,
      marginBottom: 6,
      marginLeft: 4,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
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
      backgroundColor: theme.accentTeal,
    },
    btnText: {
      fontWeight: '700',
      fontSize: 16,
    },

    // Floating Cost Bar (Exact match to Itinerary)
    costBar: {
      position: 'absolute',
      bottom: 90,
      left: 20,
      right: 20,
      backgroundColor: colorScheme === 'dark' ? '#010411' : '#0f172a',
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
    // Premium To Do list styles with a gorgeous purple hue
    todoCard: {
      backgroundColor: colorScheme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : '#ffffff',
      borderColor: colorScheme === 'dark' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(139, 92, 246, 0.4)',
      borderRadius: 20,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1.5,
      flexDirection: 'row',
      alignItems: 'center',
    },
    todoCardCompleted: {
      opacity: 0.65,
    },
    todoCheckbox: {
      width: 28,
      height: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    todoContent: {
      flex: 1,
    },
    todoTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: theme.primary,
    },
    todoTitleCompleted: {
      textDecorationLine: 'line-through',
      color: theme.tertiary,
    },
    todoText: {
      fontSize: 13,
      color: theme.secondary,
      marginTop: 4,
      lineHeight: 18,
    },
    todoTextCompleted: {
      textDecorationLine: 'line-through',
      color: theme.tertiary,
    },
    // Standout Cost Breakdown Card at the top of the plan list
    costBreakdownCard: {
      backgroundColor: colorScheme === 'dark' ? '#090d16' : '#0f172a',
      borderRadius: 24,
      padding: 20,
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 16,
      borderWidth: 1.5,
      borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 4,
    },
    breakdownHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.1)',
      paddingBottom: 16,
    },
    breakdownTitle: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    breakdownRange: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: '900',
      fontFamily: Platform.OS === 'ios' ? 'Outfit-Bold' : 'Outfit_700Bold',
    },
    breakdownGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 12,
    },
    breakdownItem: {
      width: '47%',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: 16,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    breakdownIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    breakdownTextContainer: {
      flex: 1,
    },
    breakdownLabel: {
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: 10,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    breakdownValue: {
      color: '#ffffff',
      fontSize: 13,
      fontWeight: '800',
      marginTop: 2,
    },
  });
};
