// ─────────────────────────────────────────────
//  AccessiWay — ScreenLayout (wrapper réutilisable)
//
//  Enveloppe chaque écran avec le Header et le BottomNav.
//  Utilisez ce composant pour vos écrans au lieu de gérer
//  le Header/Nav manuellement dans chaque page.
//
//  Props :
//    title          (string)  — titre affiché dans le Header
//    activeTab      (string)  — onglet actif : 'map' | 'community' | 'sos'
//    onNavigate     (func)    — callback de navigation
//    onPressProfile (func)    — callback profil
//    children       (node)    — contenu de la page
// ─────────────────────────────────────────────

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Header from './Header';
import BottomNav from './BottomNav';
import { Colors } from '../theme/theme';

const ScreenLayout = ({
  title,
  activeTab,
  onNavigate,
  onPressProfile,
  children,
}) => {
  return (
    <SafeAreaProvider>
      <View style={styles.root}>

        {/* ── En-tête ── */}
        <Header
          title={title}
          onPressProfile={onPressProfile}
        />

        {/* ── Contenu de la page ── */}
        <View style={styles.content}>
          {children}
        </View>

        {/* ── Navigation bas ── */}
        <BottomNav
          activeTab={activeTab}
          onNavigate={onNavigate}
        />

      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
});

export default ScreenLayout;
