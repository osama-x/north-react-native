import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#0f172a', // Dark charcoal/slate text for contrast
    background: '#f8fafc', // Soft white main screen background!
    tint: '#ffffff', // Keep header/nav tint as white (since header is green)
    icon: '#ffffff',
    tabIconDefault: 'rgba(255, 255, 255, 0.6)',
    tabIconSelected: '#ffffff',
    // User colors
    primary: '#0f172a', // Primary text is dark slate!
    secondary: '#334155', // Secondary text is slate-700
    tertiary: '#64748b', // Tertiary text is slate-500
    accent: '#2e8b58', // Set accent to brand green!
    accentHover: '#1e603c',
    accentTeal: '#35858E',
    accentOrange: '#E67E22',
    dark: '#0f172a',
    darkHover: '#1e293b',
    border: '#cbd5e1', // Clean borders for input boxes, etc.
    lightGray: '#f1f5f9', // Clean soft gray for input backgrounds, selectors, etc.
    // Liquid Glass Properties
    glassBg: 'rgba(46, 139, 88, 0.1)',
    glassBorder: 'rgba(46, 139, 88, 0.2)',
    glassCardBg: '#2e8b58', // Keeping all cards background green!
    glassCardBorder: 'rgba(46, 139, 88, 0.15)',
    glassGradientStart: '#fbfcfc', // Gorgeous soft white gradient start
    glassGradientEnd: '#f1f5f9',   // Soft cool slate off-white gradient end
    overlayBg: 'rgba(248, 250, 252, 0.98)', // Clean white modal/dropdown overlays
    inputBg: 'rgba(0, 0, 0, 0.04)', // Soft gray background for inputs
    headerBg: 'rgba(46, 139, 88, 0.9)', // Forest green header background (brand identity)
  },
  dark: {
    text: '#ffffff',
    background: '#022c22',
    tint: '#ffffff',
    icon: '#ffffff',
    tabIconDefault: 'rgba(255, 255, 255, 0.5)',
    tabIconSelected: '#ffffff',
    // User colors
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.9)',
    tertiary: 'rgba(255, 255, 255, 0.7)',
    accent: '#ffffff',
    accentHover: '#e2e8f0',
    accentTeal: '#35858E',
    accentOrange: '#E67E22',
    dark: '#022c22',
    darkHover: '#064e3b',
    border: 'rgba(255, 255, 255, 0.15)',
    lightGray: 'rgba(255, 255, 255, 0.05)',
    // Liquid Glass Properties
    glassBg: 'rgba(0, 0, 0, 0.4)',
    glassBorder: 'rgba(255, 255, 255, 0.2)',
    glassCardBg: 'rgba(0, 0, 0, 0.3)',
    glassCardBorder: 'rgba(255, 255, 255, 0.15)',
    glassGradientStart: '#064e3b',
    glassGradientEnd: '#022c22',
    overlayBg: 'rgba(2, 44, 34, 0.95)',
    inputBg: 'rgba(0, 0, 0, 0.3)',
    headerBg: 'rgba(2, 44, 34, 0.8)',
  },
};

/**
 * Premium Typography System
 * Headers: Outfit (Geometric, Modern, Premium)
 * Body/UI: Inter (High readability, Clean, SaaS standard)
 */
export const Typography = {
  header: {
    regular: 'Outfit-Regular',
    medium: 'Outfit-Medium',
    semiBold: 'Outfit-SemiBold',
    bold: 'Outfit-Bold',
    extraBold: 'Outfit-ExtraBold',
  },
  body: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  }
};

export const Fonts = Platform.select({
  ios: {
    sans: 'Inter-Regular',
    serif: 'ui-serif',
    rounded: 'Outfit-Regular',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Inter-Regular',
    serif: 'serif',
    rounded: 'Outfit-Regular',
    mono: 'monospace',
  },
});
