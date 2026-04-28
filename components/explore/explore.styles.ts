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
    logo: {
      width: 140,
      height: 50,
      resizeMode: 'contain',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: theme.primary,
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
    section: {
      marginTop: 20,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.primary,
    },
    moreText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.accent,
    },
    planScroll: {
      paddingLeft: 20,
      paddingRight: 10,
    },
    planCard: {
      width: width * 0.7,
      height: 180,
      borderRadius: 24,
      backgroundColor: theme.accent,
      marginRight: 15,
      padding: 20,
      justifyContent: 'flex-end',
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 6,
    },
    planDuration: {
      fontSize: 12,
      fontWeight: '700',
      color: 'rgba(255, 255, 255, 0.8)',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 4,
    },
    planTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: '#ffffff',
      marginBottom: 8,
    },
    planDescription: {
      fontSize: 13,
      color: 'rgba(255, 255, 255, 0.9)',
      lineHeight: 18,
    },
    destinationGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 15,
      paddingBottom: 30,
    },
    destinationCard: {
      width: (width - 50) / 2,
      backgroundColor: theme.lightGray,
      borderRadius: 20,
      margin: 5,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    destinationIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: 'rgba(46, 139, 88, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    destinationName: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.primary,
      marginBottom: 4,
    },
    destinationRegion: {
      fontSize: 12,
      color: theme.tertiary,
      marginBottom: 8,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.primary,
      marginLeft: 4,
    },
    searchInputContainer: {
      marginHorizontal: 20,
      marginVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.lightGray,
      borderRadius: 16,
      paddingHorizontal: 15,
      height: 50,
      borderWidth: 1,
      borderColor: theme.border,
    },
    searchInput: {
      flex: 1,
      marginLeft: 10,
      fontSize: 16,
      color: theme.primary,
    },
  });
};
