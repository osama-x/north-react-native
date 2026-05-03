import React, { useState } from 'react';
import { Text, TouchableOpacity, SafeAreaView } from 'react-native';
import ExploreComponent from '@/components/explore';
import DestinationDetailComponent from '@/components/destination-detail';
import CreatePlanComponent from '@/components/planner/create-plan';
import LoadingSimulationComponent from '@/components/planner/loading-simulation';
import ItineraryComponent from '@/components/planner/itinerary';

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
      <ItineraryComponent />
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
