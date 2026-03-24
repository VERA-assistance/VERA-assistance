// ─────────────────────────────────────────────
//  AccessiWay — Écran Carte (Map)
//
//  Collaborateur responsable : [Nom]
//  Description : Carte principale de navigation
//                accessible (type Waze)
// ─────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import { Colors, Typography, Spacing } from '../theme/theme';

const MapScreen = ({ onNavigate, onPressProfile }) => {
  return (
    <ScreenLayout
      title="Carte"
      activeTab="map"
      onNavigate={onNavigate}
      onPressProfile={onPressProfile}
    >
      {/* ──────────────────────────────────────── */}
      {/*   ZONE DE DÉVELOPPEMENT — Carte         */}
      {/*   Ajoutez ici votre composant de carte  */}
      {/*   ex: react-native-maps, MapboxGL...    */}
      {/* ──────────────────────────────────────── */}

      <View style={styles.placeholder}>
        <Text style={styles.icon}>🗺️</Text>
        <Text style={styles.title}>Carte de navigation</Text>
        <Text style={styles.subtitle}>
          Intégrez ici votre carte accessible{'\n'}
          (react-native-maps, MapboxGL, etc.)
        </Text>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  icon: {
    fontSize: 64,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default MapScreen;
