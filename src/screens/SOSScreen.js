// ─────────────────────────────────────────────
//  AccessiWay — Écran SOS
//
//  Collaborateur responsable : [Nom]
//  Description : Écran d'urgence et d'alerte
//                rapide pour les personnes
//                en situation de handicap
// ─────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import { Colors, Typography, Spacing } from '../theme/theme';

const SOSScreen = ({ onNavigate, onPressProfile }) => {
  return (
    <ScreenLayout
      title="SOS"
      activeTab="sos"
      onNavigate={onNavigate}
      onPressProfile={onPressProfile}
    >
      {/* ──────────────────────────────────────── */}
      {/*   ZONE DE DÉVELOPPEMENT — SOS           */}
      {/*   Ex: appel d'urgence, localisation,    */}
      {/*   contacts de confiance, alertes...     */}
      {/* ──────────────────────────────────────── */}

      <View style={styles.placeholder}>
        <Text style={styles.icon}>🆘</Text>
        <Text style={[styles.title, styles.titleSOS]}>SOS</Text>
        <Text style={styles.subtitle}>
          Alerte d'urgence, contacts de confiance{'\n'}
          et localisation en temps réel
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
    backgroundColor: Colors.sosLight,
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
  titleSOS: {
    color: Colors.sos,
  },
  subtitle: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default SOSScreen;
