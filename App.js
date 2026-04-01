// ─────────────────────────────────────────────
//  AccessiWay — App.js (Expo Go)
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import MapScreen       from './src/screens/MapScreen.js';
import CommunityScreen from './src/screens/CommunityScreen.js';
import SOSScreen       from './src/screens/SOSScreen.js';
import ProfileScreen   from './src/screens/ProfileScreen.js';
// ── Importez ici votre écran de connexion/inscription ──────────
// import LoginScreen from './src/screens/LoginScreen.js';

export const SCREENS = {
  MAP:       'map',
  COMMUNITY: 'community',
  SOS:       'sos',
  PROFILE:   'profile',
  LOGIN:     'login',   // ← ajouté
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.MAP);

  const handleNavigate    = (tab) => setCurrentScreen(tab);
  const handlePressProfile = ()  => setCurrentScreen(SCREENS.PROFILE);

  const sharedProps = {
    onNavigate:     handleNavigate,
    onPressProfile: handlePressProfile,
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case SCREENS.MAP:       return <MapScreen       {...sharedProps} />;
      case SCREENS.COMMUNITY: return <CommunityScreen {...sharedProps} />;
      case SCREENS.SOS:       return <SOSScreen       {...sharedProps} />;
      case SCREENS.PROFILE:   return <ProfileScreen   {...sharedProps} />;

      // ── Écran de connexion ──────────────────────────────────
      // Décommentez la ligne ci-dessous une fois LoginScreen créé
      // case SCREENS.LOGIN: return <LoginScreen onNavigate={handleNavigate} />;

      // Placeholder temporaire (à supprimer quand LoginScreen existe)
      case SCREENS.LOGIN:
        return <ProfileScreen {...sharedProps} />; // remplacer par <LoginScreen />

      default: return <MapScreen {...sharedProps} />;
    }
  };

  return (
    <SafeAreaProvider>
      {renderScreen()}
    </SafeAreaProvider>
  );
}
