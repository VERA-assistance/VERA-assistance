// ─────────────────────────────────────────────
//  AccessiWay — Header Component
//
//  Props :
//    title        (string)  — titre affiché au centre (optionnel)
//    onPressProfile (func)  — callback bouton profil
// ─────────────────────────────────────────────

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, Shadows } from '../theme/theme';

// ── Logo ──────────────────────────────────────
// Remplacez cette source par votre logo final :
//   require('../../assets/images/logo.png')
// ou un URI distant :
//   { uri: 'https://...' }
const LOGO_SOURCE = null; // null = affiche le placeholder texte

const Header = ({ title, onPressProfile }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <View style={styles.container}>

        {/* ── Bouton Profil (gauche) ── */}
        <TouchableOpacity
          style={styles.profileButton}
          onPress={onPressProfile}
          accessibilityLabel="Ouvrir mon profil"
          accessibilityRole="button"
          activeOpacity={0.75}
        >
          <View style={styles.profileAvatar}>
            {/* Remplacer par une image utilisateur si disponible */}
            <Text style={styles.profileInitial}>P</Text>
          </View>
        </TouchableOpacity>

        {/* ── Titre central (optionnel) ── */}
        {title ? (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        ) : (
          <View style={styles.titlePlaceholder} />
        )}

        {/* ── Logo (droite) ── */}
        <TouchableOpacity
          style={styles.logoContainer}
          accessibilityLabel="AccessiWay"
          accessibilityRole="image"
          activeOpacity={0.85}
        >
          {LOGO_SOURCE ? (
            <Image
              source={LOGO_SOURCE}
              style={styles.logoImage}
              resizeMode="contain"
            />
          ) : (
            // Placeholder — remplacez par votre logo
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoPlaceholderText}>AW</Text>
            </View>
          )}
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    ...Shadows.sm,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    height: 60,
  },

  // ── Profil ──
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  profileInitial: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },

  // ── Titre ──
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginHorizontal: Spacing.sm,
  },
  titlePlaceholder: {
    flex: 1,
  },

  // ── Logo ──
  logoContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPlaceholderText: {
    fontSize: Typography.sm,
    fontWeight: Typography.extrabold,
    color: Colors.white,
    letterSpacing: 0.5,
  },
});

export default Header;
