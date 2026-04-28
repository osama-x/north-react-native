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
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: theme.primary,
    },
    logo: {
      width: 140,
      height: 50,
      resizeMode: 'contain',
    },
    searchButton: {
      padding: 10,
      borderRadius: 14,
      backgroundColor: theme.lightGray,
      borderWidth: 1.5,
      borderColor: theme.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    viewSwitcher: {
      flexDirection: 'row',
      marginHorizontal: 20,
      padding: 4,
      borderRadius: 16,
      backgroundColor: theme.lightGray,
      marginBottom: 20,
    },
    switchButton: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 12,
    },
    switchButtonActive: {
      backgroundColor: theme.accent,
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    switchText: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.tertiary,
    },
    switchTextActive: {
      color: '#ffffff',
    },
    tagContainer: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    tagScroll: {
      paddingRight: 20,
    },
    tag: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: theme.lightGray,
      marginRight: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },
    tagActive: {
      backgroundColor: theme.accent,
      borderColor: theme.accent,
    },
    tagText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.tertiary,
    },
    tagTextActive: {
      color: '#ffffff',
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 30,
    },
    newsCard: {
      padding: 16,
      borderRadius: 20,
      backgroundColor: theme.background,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
      // Shadow for premium feel
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    newsDate: {
      fontSize: 12,
      color: theme.tertiary,
      marginBottom: 8,
      fontWeight: '500',
    },
    newsTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.primary,
      marginBottom: 10,
      lineHeight: 24,
    },
    newsContent: {
      fontSize: 15,
      color: theme.tertiary,
      lineHeight: 22,
      marginBottom: 12,
    },
    newsTagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    newsTag: {
      fontSize: 13,
      color: theme.accent,
      fontWeight: '600',
      marginRight: 8,
    },
    roadCard: {
      padding: 16,
      borderRadius: 20,
      backgroundColor: theme.background,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    roadHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    roadLocation: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.primary,
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '700',
    },
    roadDetails: {
      fontSize: 14,
      color: theme.tertiary,
      lineHeight: 20,
      marginBottom: 8,
    },
    roadFooter: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    lastUpdated: {
      fontSize: 12,
      color: theme.tertiary,
      fontStyle: 'italic',
    },
  });
};
