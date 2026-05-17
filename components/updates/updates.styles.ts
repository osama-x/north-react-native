import { StyleSheet, Dimensions } from 'react-native';
import { Colors, Typography } from '@/constants/theme';

const { width } = Dimensions.get('window');

export const createStyles = (colorScheme: 'light' | 'dark') => {
  const theme = Colors[colorScheme ?? 'light'];

  return StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: theme.background, // removed for GlassBackground
    },

    headerTitle: {
      fontFamily: Typography.header.bold,
      fontSize: 20,
      color: theme.primary,
    },
    searchButton: {
      padding: 8,
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    viewSwitcher: {
      flexDirection: 'row',
      padding: 4,
      backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 12,
    },
    switchButton: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      borderRadius: 10,
    },
    switchButtonActive: {
      backgroundColor: theme.background,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    switchText: {
      fontFamily: Typography.body.medium,
      fontSize: 14,
      color: theme.tertiary,
    },
    switchTextActive: {
      color: theme.accent,
      fontFamily: Typography.body.bold,
    },
    tagContainer: {
      marginTop: 16,
    },
    tagScroll: {
      paddingHorizontal: 20,
    },
    tag: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      marginRight: 8,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    tagActive: {
      backgroundColor: theme.accentTeal,
      borderColor: theme.accentTeal,
    },
    tagText: {
      fontFamily: Typography.body.medium,
      fontSize: 13,
      color: theme.tertiary,
    },
    tagTextActive: {
      color: '#ffffff',
      fontFamily: Typography.body.bold,
    },
    scrollContent: {
      paddingBottom: 120,
    },
    listContent: {
      padding: 20,
      paddingBottom: 120, // avoid tab bar overlap
    },
    newsCard: {
      backgroundColor: theme.glassCardBg,
      borderRadius: 20,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.glassCardBorder,
      shadowColor: theme.dark,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    },
    newsRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    thumbnail: {
      width: 80,
      height: 80,
      borderRadius: 12,
      marginRight: 16,
    },
    thumbnailPlaceholder: {
      width: 80,
      height: 80,
      borderRadius: 12,
      marginRight: 16,
      backgroundColor: theme.glassBg,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.glassBorder,
    },
    newsInfo: {
      flex: 1,
    },
    newsDate: {
      fontFamily: Typography.body.bold,
      fontSize: 11,
      color: theme.accent,
      textTransform: 'uppercase',
      marginBottom: 4,
      letterSpacing: 0.5,
    },
    newsTitle: {
      fontFamily: Typography.header.bold,
      fontSize: 17,
      color: theme.primary,
      lineHeight: 22,
      marginBottom: 6,
    },
    newsSummary: {
      fontFamily: Typography.body.regular,
      fontSize: 13,
      color: theme.tertiary,
      lineHeight: 18,
    },
    newsTagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 12,
      gap: 8,
    },
    newsTag: {
      fontFamily: Typography.body.bold,
      fontSize: 12,
      color: theme.accentTeal,
    },
    // Road Card
    roadCard: {
      backgroundColor: theme.glassCardBg,
      borderRadius: 20,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.glassCardBorder,
      shadowColor: theme.dark,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    },
    roadHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    roadTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    roadThumbnail: {
      width: 32,
      height: 32,
      borderRadius: 8,
      marginRight: 10,
    },
    roadThumbnailPlaceholder: {
      backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    roadLocation: {
      fontFamily: Typography.header.bold,
      fontSize: 16,
      color: theme.primary,
      flex: 1,
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    statusText: {
      fontFamily: Typography.body.bold,
      fontSize: 10,
    },
    roadDetails: {
      fontFamily: Typography.body.regular,
      fontSize: 14,
      color: theme.tertiary,
      lineHeight: 20,
      marginBottom: 12,
    },
    roadFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: 12,
    },
    lastUpdated: {
      fontFamily: Typography.body.medium,
      fontSize: 11,
      color: theme.tertiary,
    },
    // Detail Page
    detailHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    detailBackButton: {
      padding: 8,
    },
    detailShareButton: {
      padding: 8,
    },
    detailImage: {
      width: '100%',
      height: 250,
      resizeMode: 'cover',
    },
    detailImagePlaceholder: {
      width: '100%',
      height: 250,
      backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    detailContentContainer: {
      padding: 24,
    },
    detailDate: {
      fontFamily: Typography.body.bold,
      fontSize: 12,
      color: theme.accentOrange,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 8,
    },
    detailTitle: {
      fontFamily: Typography.header.extraBold,
      fontSize: 26,
      color: theme.primary,
      lineHeight: 34,
      marginBottom: 16,
    },
    detailTagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 24,
    },
    detailTagBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: theme.accentTeal + '10',
      borderWidth: 1,
      borderColor: theme.accentTeal + '30',
    },
    detailTagText: {
      fontFamily: Typography.body.bold,
      fontSize: 12,
      color: theme.accentTeal,
    },
    summaryBox: {
      backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : theme.lightGray,
      padding: 16,
      borderRadius: 16,
      borderLeftWidth: 4,
      borderLeftColor: theme.accentOrange,
      marginBottom: 24,
    },
    summaryText: {
      fontFamily: Typography.body.medium,
      fontSize: 15,
      color: theme.primary,
      fontStyle: 'italic',
      lineHeight: 22,
    },
    fullContentText: {
      fontFamily: Typography.body.regular,
      fontSize: 16,
      color: theme.primary,
      lineHeight: 26,
      opacity: 0.9,
    },
    // Search UI
    searchBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 60,
      backgroundColor: theme.background,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      zIndex: 100,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    searchInput: {
      flex: 1,
      fontFamily: Typography.body.medium,
      fontSize: 16,
      color: theme.primary,
      paddingHorizontal: 12,
    },
    closeSearchButton: {
      padding: 8,
    },
    suggestionsContainer: {
      position: 'absolute',
      top: 60,
      left: 0,
      right: 0,
      backgroundColor: theme.background,
      zIndex: 99,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 10,
    },
    suggestionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    suggestionText: {
      fontFamily: Typography.body.medium,
      fontSize: 15,
      color: theme.primary,
      marginLeft: 12,
    },
  });
};
