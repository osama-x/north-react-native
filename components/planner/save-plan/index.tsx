import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { createStyles } from './save-plan.styles';
import { Colors } from '@/constants/theme';
import { NorthHeader } from '@/components/ui/north-header';

interface Props {
  totalCost: number;
  onBack: () => void;
  onSave: (tripName: string) => void;
}

export default function SavePlanComponent({ totalCost, onBack, onSave }: Props) {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => createStyles(colorScheme ?? 'light'), [colorScheme]);
  const theme = Colors[colorScheme ?? 'light'];
  
  const [tripName, setTripName] = useState('');

  return (
    <View style={styles.container}>
      <NorthHeader 
        leftElement={
          <TouchableOpacity 
            style={{ padding: 8, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 12 }} 
            onPress={onBack}
          >
            <IconSymbol name="chevron.left" size={24} color="#ffffff" />
          </TouchableOpacity>
        }
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.phaseText}>Final Step — Memory</Text>
            <Text style={styles.title}>Give Your Journey a Name</Text>
            <Text style={styles.subtitle}>
              This helps you find your trip easily in your saved expeditions later.
            </Text>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Trip Title</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}>
                <IconSymbol name="pencil" size={20} color={theme.accent} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="e.g. Summer Skardu Escape"
                placeholderTextColor={theme.tertiary}
                value={tripName}
                onChangeText={setTripName}
                autoFocus
              />
            </View>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Expedition Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Estimated Cost</Text>
              <Text style={styles.summaryValue}>PKR {totalCost.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Status</Text>
              <Text style={[styles.summaryValue, { color: theme.accent }]}>Ready to Track</Text>
            </View>
          </View>

          <View style={{ flex: 1, minHeight: 100 }} />

          <TouchableOpacity 
            style={[styles.saveButton, !tripName && { opacity: 0.6 }]} 
            activeOpacity={0.9}
            onPress={() => tripName && onSave(tripName)}
            disabled={!tripName}
          >
            <Text style={styles.saveButtonText}>Save Expedition</Text>
            <IconSymbol name="checkmark.circle.fill" size={20} color="#ffffff" />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
