import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import PlannerComponent from '@/components/planner';
import CreatePlanComponent from '@/components/planner/create-plan';
import LoadingSimulationComponent from '@/components/planner/loading-simulation';
import ItineraryComponent from '@/components/planner/itinerary';
import SavePlanComponent from '@/components/planner/save-plan';
import SavedPlanViewerComponent from '@/components/planner/saved-plan-viewer';
import { TripItinerary } from '@/components/planner/itinerary/types';
import { dbService } from '@/database';

type PlanView = 'list' | 'config' | 'loading' | 'final' | 'save' | 'viewSaved';

export default function PlanScreen() {
  const navigation = useNavigation();
  const [viewStack, setViewStack] = useState<PlanView[]>(['config']);
  const view = viewStack[viewStack.length - 1];
  
  const [config, setConfig] = useState<any>(null);
  const [totalCost, setTotalCost] = useState(0);
  const [currentItinerary, setCurrentItinerary] = useState<TripItinerary | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const pushView = (newView: PlanView) => {
    setViewStack(prev => [...prev, newView]);
  };

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
    setSelectedPlanId(null);
  }, []);

  // Handle hardware back button
  useEffect(() => {
    const onBackPress = () => {
      return popView();
    };
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [popView]);

  // Handle tab re-press
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      // ONLY intercept if we are ALREADY focused on this tab (re-press)
      if (navigation.isFocused() && view !== 'config') {
        e.preventDefault();

        Alert.alert(
          'Discard Progress?',
          'Are you sure you want to discard your current progress and return to the start?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Discard', 
              style: 'destructive',
              onPress: resetToMain
            },
          ]
        );
      }
    });

    return unsubscribe;
  }, [navigation, view, resetToMain]);

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

  if (view === 'loading') {
    return (
      <LoadingSimulationComponent 
        onComplete={() => pushView('final')}
      />
    );
  }

  if (view === 'final') {
    return (
      <ItineraryComponent 
        onBack={popView}
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
              console.log('Saved trip to SQLite:', tripName);
            } catch (e) {
              console.error('Failed to save trip', e);
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

  // Default view is always config now
  return (
    <CreatePlanComponent 
      onContinue={(data) => {
        setConfig(data);
        pushView('loading');
      }}
    />
  );
}
