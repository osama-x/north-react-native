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
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Your Itinerary</Text>
        <Text style={{ color: '#666', marginTop: 10 }}>Itinerary details will be implemented here.</Text>
        <TouchableOpacity 
          onPress={() => setView('list')}
          style={{ marginTop: 20, padding: 12, backgroundColor: '#000', borderRadius: 8 }}
        >
          <Text style={{ color: '#fff' }}>Back to My Plans</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return <PlannerComponent onGeneratePress={() => setView('config')} />;
}
