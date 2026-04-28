/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    // User colors
    primary: '#010411',
    secondary: '#0f172a',
    tertiary: '#334155',
    accent: '#2e8b58',
    accentHover: '#047857',
    dark: '#0f172a',
    darkHover: '#1e293b',
    border: 'rgba(15, 23, 42, 0.08)',
    lightGray: '#f8fafc',
    glassBg: 'rgba(255, 255, 255, 0.7)',
    glassBorder: 'rgba(15, 23, 42, 0.05)',
    overlayBg: 'rgba(255, 255, 255, 0.98)',
    inputBg: 'rgba(255, 255, 255, 0.8)',
    headerBg: 'rgba(255, 255, 255, 0.85)',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    // For now using the same colors for dark or mapping them if needed
    primary: '#ffffff',
    secondary: '#f1f5f9',
    tertiary: '#94a3b8',
    accent: '#2e8b58',
    accentHover: '#047857',
    dark: '#0f172a',
    darkHover: '#1e293b',
    border: 'rgba(255, 255, 255, 0.1)',
    lightGray: '#1e293b',
    glassBg: 'rgba(0, 0, 0, 0.7)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    overlayBg: 'rgba(0, 0, 0, 0.98)',
    inputBg: 'rgba(255, 255, 255, 0.1)',
    headerBg: 'rgba(0, 0, 0, 0.85)',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
