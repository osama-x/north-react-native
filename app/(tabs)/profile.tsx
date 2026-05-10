import React, { useState, useCallback, useEffect } from 'react';
import { BackHandler } from 'react-native';
import ProfileComponent from '@/components/profile';
import SavedPlanViewerComponent from '@/components/planner/saved-plan-viewer';

type ProfileView = 'list' | 'viewSaved';

export default function ProfileScreen() {
  const [viewStack, setViewStack] = useState<ProfileView[]>(['list']);
  const view = viewStack[viewStack.length - 1];
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const pushView = (newView: ProfileView) => {
    setViewStack(prev => [...prev, newView]);
  };

  const popView = useCallback(() => {
    if (viewStack.length > 1) {
      setViewStack(prev => prev.slice(0, -1));
      return true;
    }
    return false;
  }, [viewStack]);

  // Handle hardware back button
  useEffect(() => {
    const onBackPress = () => {
      return popView();
    };
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [popView]);

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
    <ProfileComponent 
      onSavedPlanPress={(planId) => {
        setSelectedPlanId(planId);
        pushView('viewSaved');
      }}
    />
  );
}
