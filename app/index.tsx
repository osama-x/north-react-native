import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Colors, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#2e8b58' }]}>
      <StatusBar style="light" />
      
      <View style={styles.content}>
        {/* Logo and Tagline Area */}
        <View style={styles.headerContainer}>
          <Image 
            source={require('@/assets/images/green_screen.png')}
            style={styles.logo}
            contentFit="contain"
          />
          <Text style={styles.tagline}>your travel partner for discovering the north</Text>
        </View>

        {/* Buttons and Footer Area */}
        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]} 
              onPress={() => router.push('/login')}
            >
              <Text style={styles.primaryButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]} 
              onPress={() => router.push('/signup')}
            >
              <Text style={styles.secondaryButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>

          {/* Skip Button */}
          <TouchableOpacity 
            style={styles.skipButton} 
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    paddingVertical: 80,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  logo: {
    width: width * 0.85,
    height: 160,
    marginBottom: 10,
  },
  tagline: {
    fontFamily: Typography.body.medium,
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    maxWidth: width * 0.6,
    lineHeight: 24,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 18,
    marginBottom: 32,
  },
  button: {
    width: '100%',
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  primaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: '#ffffff',
  },
  primaryButtonText: {
    fontFamily: Typography.body.bold,
    color: '#ffffff',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  secondaryButtonText: {
    fontFamily: Typography.body.semiBold,
    color: '#ffffff',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  skipButton: {
    padding: 12,
  },
  skipButtonText: {
    fontFamily: Typography.body.medium,
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
});
