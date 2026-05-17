import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert, BackHandler, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import PlannerComponent from '@/components/planner';
import CreatePlanComponent from '@/components/planner/create-plan';
import LoadingSimulationComponent from '@/components/planner/loading-simulation';
import ItineraryComponent from '@/components/planner/itinerary';
import SavePlanComponent from '@/components/planner/save-plan';
import SavedPlanViewerComponent from '@/components/planner/saved-plan-viewer';
import { TripItinerary } from '@/components/planner/itinerary/types';
import { TripConfig } from '@/components/planner/create-plan/types';
import { dbService } from '@/database';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

type PlanView = 'config' | 'loading' | 'final' | 'save' | 'viewSaved';

export default function PlanScreen() {
  const navigation = useNavigation();
  const [viewStack, setViewStack] = useState<PlanView[]>(['config']);
  const view = viewStack[viewStack.length - 1];
  
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const [config, setConfig] = useState<TripConfig | null>(null);
  const [totalCost, setTotalCost] = useState(0);
  const [currentItinerary, setCurrentItinerary] = useState<TripItinerary | null>(null);
  const [generatedItinerary, setGeneratedItinerary] = useState<TripItinerary | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const pushView = (newView: PlanView) => setViewStack(prev => [...prev, newView]);

  const popView = useCallback(() => {
    if (viewStack.length > 1) {
      setViewStack(prev => prev.slice(0, -1));
      return true;
    }
    return false;
  }, [viewStack]);

  const resetToMain = useCallback(() => {
    setViewStack(['config']);
    setConfig(null);
    setTotalCost(0);
    setCurrentItinerary(null);
    setGeneratedItinerary(null);
    setSelectedPlanId(null);
  }, []);

  useEffect(() => {
    const onBackPress = () => popView();
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [popView]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      if (navigation.isFocused() && view !== 'config') {
        e.preventDefault();
        Alert.alert(
          'Discard Progress?',
          'Are you sure you want to discard your current progress?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Discard', style: 'destructive', onPress: resetToMain },
          ]
        );
      }
    });
    return unsubscribe;
  }, [navigation, view, resetToMain]);

  const renderContent = () => {
    if (view === 'config') {
      return (
        <CreatePlanComponent
          onContinue={(data) => {
            setConfig(data);
            pushView('loading');
          }}
        />
      );
    }

    if (view === 'loading' && config) {
      return (
        <LoadingSimulationComponent
          config={config}
          onComplete={(itinerary) => {
            setGeneratedItinerary(itinerary);
            pushView('final');
          }}
          onBack={popView}
        />
      );
    }

    if (view === 'final') {
      const handleBack = () => {
        const doBack = () => {
          setGeneratedItinerary(null);
          setViewStack(['config']);
        };
        if (Platform.OS === 'web') {
          if (window.confirm('This will discard the current itinerary and return you to trip settings. Continue?')) {
            doBack();
          }
        } else {
          Alert.alert(
            'Go Back to Settings?',
            'This will discard the current itinerary and return you to trip settings.',
            [
              { text: 'Stay', style: 'cancel' },
              { text: 'Go Back', style: 'destructive', onPress: doBack },
            ]
          );
        }
      };

      return (
        <ItineraryComponent
          onBack={handleBack}
          initialItinerary={generatedItinerary ?? undefined}
          onSave={(cost, itinerary) => {
            setTotalCost(cost);
            setCurrentItinerary(itinerary);
            pushView('save');
          }}
        />
      );
    }

    if (view === 'save') {
      return (
        <SavePlanComponent
          totalCost={totalCost}
          onBack={popView}
          onSave={async (tripName) => {
            if (currentItinerary) {
              const planToSave = { ...currentItinerary, title: tripName };
              try {
                await dbService.savePlan(planToSave, totalCost);
              } catch (e) {
                Alert.alert('Error', 'Failed to save the trip to local storage.');
                return;
              }
            }
            resetToMain();
          }}
        />
      );
    }

    if (view === 'viewSaved' && selectedPlanId) {
      return (
        <SavedPlanViewerComponent
          planId={selectedPlanId}
          onBack={() => {
            setSelectedPlanId(null);
            popView();
          }}
        />
      );
    }

    return (
      <CreatePlanComponent
        onContinue={(data) => {
          setConfig(data);
          pushView('loading');
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {renderContent()}
    </View>
  );
}
