// ─────────────────────────────────────────────
//  AccessiWay — Écran Communauté
//
//  Collaborateur responsable : [Nom]
//  Description : Espace communautaire,
//                signalements & entraide
// ─────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import { Colors, Typography, Spacing } from '../theme/theme';

const CommunityScreen = ({ onNavigate, onPressProfile }) => {
  return (
    <ScreenLayout
      title="Communauté"
      activeTab="community"
      onNavigate={onNavigate}
      onPressProfile={onPressProfile}
    >
      {/* ──────────────────────────────────────── */}
      {/*   ZONE DE DÉVELOPPEMENT — Communauté    */}
      {/*   Ex: fil de signalements, entraide,    */}
      {/*   alertes accessibilité, forums...      */}
      {/* ──────────────────────────────────────── */}

      <View style={styles.placeholder}>
        <Text style={styles.icon}>👥</Text>
        <Text style={styles.title}>Communauté</Text>
        <Text style={styles.subtitle}>
          Signalements, entraide et{'\n'}
          alertes d'accessibilité
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

export default CommunityScreen;
