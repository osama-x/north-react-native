import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import PlannerComponent from '@/components/planner';
import CreatePlanComponent from '@/components/planner/create-plan';
import LoadingSimulationComponent from '@/components/planner/loading-simulation';
import ItineraryComponent from '@/components/planner/itinerary';
import SavePlanComponent from '@/components/planner/save-plan';

export default function PlanScreen() {
  const [view, setView] = useState<'list' | 'config' | 'loading' | 'final' | 'save'>('list');
  const [config, setConfig] = useState<any>(null);
  const [totalCost, setTotalCost] = useState(0);

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
      <ItineraryComponent 
        onSave={(cost) => {
          setTotalCost(cost);
          setView('save');
        }}
      />
    );
  }

  if (view === 'save') {
    return (
      <SavePlanComponent 
        totalCost={totalCost}
        onBack={() => setView('final')}
        onSave={(tripName) => {
          console.log('Saving trip:', tripName);
          setView('list');
        }}
      />
    );
  }

  return <PlannerComponent onGeneratePress={() => setView('config')} />;
}
