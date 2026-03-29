// ─────────────────────────────────────────────
//  AccessiWay — Écran Profil
//
//  Collaborateur responsable : [Nom]
//  Description : Profil utilisateur,
//                préférences d'accessibilité
//                et paramètres
// ─────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import { Colors, Typography, Spacing } from '../theme/theme';

const ProfileScreen = ({ onNavigate, onPressProfile }) => {
  return (
    <ScreenLayout
      // Pas de titre ici — le profil n'a pas d'onglet actif
      activeTab={null}
      onNavigate={onNavigate}
      onPressProfile={onPressProfile}
    >
      {/* ──────────────────────────────────────── */}
      {/*   ZONE DE DÉVELOPPEMENT — Profil        */}
      {/*   Ex: avatar, besoins d'accessibilité,  */}
      {/*   type de handicap, préférences,        */}
      {/*   paramètres, déconnexion...            */}
      {/* ──────────────────────────────────────── */}

      <View style={styles.placeholder}>
        <Text style={styles.icon}>👤</Text>
        <Text style={styles.title}>Mon profil</Text>
        <Text style={styles.subtitle}>
          Informations personnelles,{'\n'}
          besoins d'accessibilité et préférences
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

export default ProfileScreen;
