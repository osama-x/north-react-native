import React, { useState, useEffect, useCallback } from 'react';
import { Text, TouchableOpacity, SafeAreaView, Alert, View, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ExploreComponent from '@/components/explore';
import DestinationDetailComponent from '@/components/destination-detail';
import CreatePlanComponent from '@/components/planner/create-plan';
import LoadingSimulationComponent from '@/components/planner/loading-simulation';
import ItineraryComponent from '@/components/planner/itinerary';

type ExploreView = 'normal' | 'detail' | 'config' | 'loading' | 'final';

export default function ExploreScreen() {
  const navigation = useNavigation();
  const [viewStack, setViewStack] = useState<ExploreView[]>(['normal']);
  const view = viewStack[viewStack.length - 1];

  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);
  const [configuringPlanFor, setConfiguringPlanFor] = useState<string | null>(null);

  const pushView = (newView: ExploreView) => {
    setViewStack(prev => [...prev, newView]);
  };

  const popView = useCallback(() => {
    if (viewStack.length > 1) {
      const topView = viewStack[viewStack.length - 1];
      if (topView === 'detail') setSelectedDestinationId(null);
      if (topView === 'config') setConfiguringPlanFor(null);
      
      setViewStack(prev => prev.slice(0, -1));
      return true;
    }
    return false;
  }, [viewStack]);

  const resetToMain = useCallback(() => {
    setViewStack(['normal']);
    setSelectedDestinationId(null);
    setConfiguringPlanFor(null);
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
      if (navigation.isFocused() && view !== 'normal') {
        e.preventDefault();

        Alert.alert(
          'Return to Main?',
          'Are you sure you want to discard your progress and return to the main explore screen?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Confirm', 
              style: 'destructive',
              onPress: resetToMain
            },
          ]
        );
      }
    });

    return unsubscribe;
  }, [navigation, view, resetToMain]);

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
      />
    );
  }

  if (view === 'config' && configuringPlanFor) {
    return (
      <CreatePlanComponent 
        initialDestination={configuringPlanFor}
        onBack={popView}
        onContinue={(config) => {
          console.log('Trip Config:', config);
          pushView('loading');
        }}
      />
    );
  }

  if (view === 'detail' && selectedDestinationId) {
    return (
      <DestinationDetailComponent 
        destinationId={selectedDestinationId} 
        onBack={popView} 
        onPlanPress={(name) => {
          setConfiguringPlanFor(name);
          pushView('config');
        }}
      />
    );
  }

  return (
    <ExploreComponent 
      onDestinationPress={(id) => {
        setSelectedDestinationId(id);
        pushView('detail');
      }} 
    />
  );
}
