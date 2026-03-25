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
import ProfileScreen from './src/screens/ProfileScreen.js';

const Stack = createStackNavigator();
import SOSScreen        from './src/screens/SOSScreen';
import SOSStep1Screen   from './src/screens/SOSStep1Screen';
import SOSStep2Screen   from './src/screens/SOSStep2Screen';
import SOSStep3Screen   from './src/screens/SOSStep3Screen';
import SOSDetailScreen  from './src/screens/SOSDetailScreen';

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
  // ── SOS récents (liste, vide au départ) ──────
  const [sosRecents, setSosRecents] = useState([]);

  // ── Données du SOS en cours de création ──────
  const [currentSosData, setCurrentSosData] = useState({});

  // ── SOS récent sélectionné (pour la page détail)
  const [selectedRecent, setSelectedRecent] = useState(null);

  // ── Navigation ────────────────────────────────
  const handleNavigate    = (tab)    => setCurrentScreen(tab);
  const handlePressProfile = ()      => setCurrentScreen(SCREENS.PROFILE);
  const handleNavigateTo  = (screen) => setCurrentScreen(screen);

  // ── Mise à jour des données du SOS en cours ──
  const handleUpdateSosData = (data) => {
    setCurrentSosData((prev) => ({ ...prev, ...data }));
  };

  // ── Validation finale du SOS personnalisé ────
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

  // ── Ouvrir un SOS récent ──────────────────────
  const handleOpenRecent = (sos) => {
    setSelectedRecent(sos);
    setCurrentScreen(SCREENS.SOS_DETAIL);
  };

  const sharedProps = {
    onNavigate:       handleNavigate,
    onPressProfile:   handlePressProfile,
    onNavigateTo:     handleNavigateTo,
    onUpdateSosData:  handleUpdateSosData,
    onConfirmSos:     handleConfirmSos,
    onOpenRecent:     handleOpenRecent,
    sosRecents,
    currentSosData,
    selectedRecent,
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

  return (
    <SafeAreaProvider>
      {renderScreen()}
    </SafeAreaProvider>
  );
}
