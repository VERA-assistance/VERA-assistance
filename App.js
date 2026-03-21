// ─────────────────────────────────────────────
//  AccessiWay — App.js (Expo Go)
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import MapScreen from './src/screens/MapScreen.js';
import CommunityScreen from './src/screens/CommunityScreen.js';
import SOSScreen from './src/screens/SOSScreen.js';
import ProfileScreen from './src/screens/ProfileScreen.js';

export const SCREENS = {
  MAP: 'map',
  COMMUNITY: 'community',
  SOS: 'sos',
  PROFILE: 'profile',
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.MAP);

  const handleNavigate = (tab) => setCurrentScreen(tab);
  const handlePressProfile = () => setCurrentScreen(SCREENS.PROFILE);

  const sharedProps = {
    onNavigate: handleNavigate,
    onPressProfile: handlePressProfile,
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case SCREENS.MAP:        return <MapScreen {...sharedProps} />;
      case SCREENS.COMMUNITY:  return <CommunityScreen {...sharedProps} />;
      case SCREENS.SOS:        return <SOSScreen {...sharedProps} />;
      case SCREENS.PROFILE:    return <ProfileScreen {...sharedProps} />;
      default:                 return <MapScreen {...sharedProps} />;
    }
  };

  return (
    <SafeAreaProvider>
      {renderScreen()}
    </SafeAreaProvider>
  );
}