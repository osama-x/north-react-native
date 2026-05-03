import { Link } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ModalScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.primary }]}>This is a modal</Text>
      <Link href="/" dismissTo asChild>
        <TouchableOpacity style={styles.link}>
          <Text style={[styles.linkText, { color: theme.accent }]}>Go to home screen</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontFamily: Typography.header.bold,
    fontSize: 24,
    marginBottom: 8,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontFamily: Typography.body.bold,
    fontSize: 16,
  },
});
