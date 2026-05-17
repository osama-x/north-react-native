import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#ffffff',
    background: '#2e8b58',
    tint: '#ffffff',
    icon: '#ffffff',
    tabIconDefault: 'rgba(255, 255, 255, 0.6)',
    tabIconSelected: '#ffffff',
    // User colors
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.9)',
    tertiary: 'rgba(255, 255, 255, 0.75)',
    accent: '#ffffff', // Set accent to white as well to prevent any green-on-green text
    accentHover: '#e2e8f0',
    accentTeal: '#35858E',
    accentOrange: '#E67E22',
    dark: '#022c22',
    darkHover: '#064e3b',
    border: 'rgba(255, 255, 255, 0.2)',
    lightGray: 'rgba(255, 255, 255, 0.1)',
    // Liquid Glass Properties
    glassBg: 'rgba(255, 255, 255, 0.2)',
    glassBorder: 'rgba(255, 255, 255, 0.4)',
    glassCardBg: 'rgba(255, 255, 255, 0.15)',
    glassCardBorder: 'rgba(255, 255, 255, 0.3)',
    glassGradientStart: '#2e8b58', // Rich green
    glassGradientEnd: '#047857',   // Deeper green
    overlayBg: 'rgba(46, 139, 88, 0.95)',
    inputBg: 'rgba(255, 255, 255, 0.15)',
    headerBg: 'rgba(46, 139, 88, 0.8)',
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
