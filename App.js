// ─────────────────────────────────────────────
//  AccessiWay — App.js (Expo Go)
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// ── Écrans d'auth (collègue) ──────────────────
import WelcomeScreen   from './src/screens/WelcomeScreen';
import LoginScreen     from './src/screens/LoginScreen';
import SignUpScreen    from './src/screens/SignUpScreen';

// ── Écrans principaux ─────────────────────────
import MapScreen       from './src/screens/MapScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import ProfileScreen   from './src/screens/ProfileScreen';
import SOSScreen       from './src/screens/SOSScreen';
import SOSStep1Screen  from './src/screens/SOSStep1Screen';
import SOSStep2Screen  from './src/screens/SOSStep2Screen';
import SOSStep3Screen  from './src/screens/SOSStep3Screen';
import SOSDetailScreen from './src/screens/SOSDetailScreen';

const Stack = createStackNavigator();

export const SCREENS = {
  MAP:        'map',
  COMMUNITY:  'community',
  SOS:        'sos',
  PROFILE:    'profile',
  SOS_STEP1:  'sos_step1',
  SOS_STEP2:  'sos_step2',
  SOS_STEP3:  'sos_step3',
  SOS_DETAIL: 'sos_detail',
};

// ── Écrans principaux après connexion ─────────
const MainApp = () => {
  const [currentScreen, setCurrentScreen]     = useState(SCREENS.MAP);
  const [sosRecents, setSosRecents]           = useState([]);
  const [currentSosData, setCurrentSosData]   = useState({});
  const [selectedRecent, setSelectedRecent]   = useState(null);

  const handleNavigate     = (tab)    => setCurrentScreen(tab);
  const handlePressProfile = ()       => setCurrentScreen(SCREENS.PROFILE);
  const handleNavigateTo   = (screen) => setCurrentScreen(screen);

  const handleUpdateSosData = (data) => {
    setCurrentSosData((prev) => ({ ...prev, ...data }));
  };

  const handleConfirmSos = () => {
    const newEntry = {
      id: Date.now().toString(),
      createdAt: new Date(),
      ...currentSosData,
    };
    setSosRecents((prev) => [newEntry, ...prev]);
    setCurrentSosData({});
    setCurrentScreen(SCREENS.SOS);
  };

  const handleOpenRecent = (sos) => {
    setSelectedRecent(sos);
    setCurrentScreen(SCREENS.SOS_DETAIL);
  };

  const sharedProps = {
    onNavigate:      handleNavigate,
    onPressProfile:  handlePressProfile,
    onNavigateTo:    handleNavigateTo,
    onUpdateSosData: handleUpdateSosData,
    onConfirmSos:    handleConfirmSos,
    onOpenRecent:    handleOpenRecent,
    sosRecents,
    currentSosData,
    selectedRecent,
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case SCREENS.MAP:        return <MapScreen        {...sharedProps} />;
      case SCREENS.COMMUNITY:  return <CommunityScreen  {...sharedProps} />;
      case SCREENS.SOS:        return <SOSScreen        {...sharedProps} />;
      case SCREENS.PROFILE:    return <ProfileScreen    {...sharedProps} />;
      case SCREENS.SOS_STEP1:  return <SOSStep1Screen   {...sharedProps} />;
      case SCREENS.SOS_STEP2:  return <SOSStep2Screen   {...sharedProps} />;
      case SCREENS.SOS_STEP3:  return <SOSStep3Screen   {...sharedProps} />;
      case SCREENS.SOS_DETAIL: return <SOSDetailScreen  {...sharedProps} />;
      default:                 return <MapScreen        {...sharedProps} />;
    }
  };

  return renderScreen();
};

// ── Point d'entrée ────────────────────────────
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login"   component={LoginScreen} />
          <Stack.Screen name="SignUp"  component={SignUpScreen} />
          <Stack.Screen name="Main"    component={MainApp} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}