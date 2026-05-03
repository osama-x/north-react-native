import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import PlannerComponent from '@/components/planner';
import CreatePlanComponent from '@/components/planner/create-plan';
import LoadingSimulationComponent from '@/components/planner/loading-simulation';
import ItineraryComponent from '@/components/planner/itinerary';

export default function PlanScreen() {
  const [view, setView] = useState<'list' | 'config' | 'loading' | 'final'>('list');
  const [config, setConfig] = useState<any>(null);

  if (view === 'config') {
    return (
      <CreatePlanComponent 
        onBack={() => setView('list')} 
        onContinue={(data) => {
          setConfig(data);
          setView('loading');
        }}
      />
    );
  }

  if (view === 'loading') {
    return (
      <LoadingSimulationComponent 
        onComplete={() => setView('final')}
      />
    );
  }

  if (view === 'final') {
    return (
      <ItineraryComponent />
    );
  }

  return <PlannerComponent onGeneratePress={() => setView('config')} />;
}
