import React, { useState } from 'react';
import { Text, TouchableOpacity, SafeAreaView } from 'react-native';
import ExploreComponent from '@/components/explore';
import DestinationDetailComponent from '@/components/destination-detail';
import CreatePlanComponent from '@/components/planner/create-plan';
import LoadingSimulationComponent from '@/components/planner/loading-simulation';

export default function ExploreScreen() {
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);
  const [configuringPlanFor, setConfiguringPlanFor] = useState<string | null>(null);
  const [view, setView] = useState<'normal' | 'loading' | 'final'>('normal');

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
          onPress={() => {
            setView('normal');
            setConfiguringPlanFor(null);
            setSelectedDestinationId(null);
          }}
          style={{ marginTop: 20, padding: 12, backgroundColor: '#000', borderRadius: 8 }}
        >
          <Text style={{ color: '#fff' }}>Finish</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (configuringPlanFor) {
    return (
      <CreatePlanComponent 
        initialDestination={configuringPlanFor}
        onBack={() => setConfiguringPlanFor(null)}
        onContinue={(config) => {
          console.log('Trip Config:', config);
          setView('loading');
        }}
      />
    );
  }

  if (selectedDestinationId) {
    return (
      <DestinationDetailComponent 
        destinationId={selectedDestinationId} 
        onBack={() => setSelectedDestinationId(null)} 
        onPlanPress={(name) => setConfiguringPlanFor(name)}
      />
    );
  }

  return <ExploreComponent onDestinationPress={(id) => setSelectedDestinationId(id)} />;
}
