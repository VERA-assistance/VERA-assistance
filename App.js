// ─────────────────────────────────────────────
//  AccessiWay — App.js (Expo Go)
// ─────────────────────────────────────────────

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import MapScreen from './src/screens/MapScreen.js';
import CommunityScreen from './src/screens/CommunityScreen.js';
import SOSScreen from './src/screens/SOSScreen.js';
import ProfileScreen from './src/screens/ProfileScreen.js';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Main" component={MainApp} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// MainApp component with bottom tabs
const MainApp = () => {
  const [currentScreen, setCurrentScreen] = React.useState('map');

  const handleNavigate = (tab) => setCurrentScreen(tab);
  const handlePressProfile = () => setCurrentScreen('profile');

  const sharedProps = {
    onNavigate: handleNavigate,
    onPressProfile: handlePressProfile,
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'map':        return <MapScreen {...sharedProps} />;
      case 'community':  return <CommunityScreen {...sharedProps} />;
      case 'sos':        return <SOSScreen {...sharedProps} />;
      case 'profile':    return <ProfileScreen {...sharedProps} />;
      default:           return <MapScreen {...sharedProps} />;
    }
  };

  return renderScreen();
}
