// ─────────────────────────────────────────────
//  VERA — Header Component
//
//  Props :
//    title          (string) — titre central (optionnel)
//    onPressProfile (func)   — callback bouton profil
// ─────────────────────────────────────────────

import React, { useRef } from 'react';
import {
  View, Text, TouchableOpacity,
  Image, StyleSheet, StatusBar, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Shadows, Radius } from '../theme/theme';

// ── 🔽 Remplacez cette URL par votre vrai logo ──
const LOGO_SOURCE = require('../../assets/logo.png');
// Ou en local : require('../../assets/logo.png')

const Header = ({ title, onPressProfile }) => {
  const insets     = useSafeAreaInsets();
  const scaleAnim  = useRef(new Animated.Value(1)).current;

  const handleProfilePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.88, duration: 70, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 10, stiffness: 200 }),
    ]).start();
    if (onPressProfile) onPressProfile();
  };

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <View style={styles.container}>

        {/* ── Bouton Profil (gauche) ── */}
        <TouchableOpacity
          onPress={handleProfilePress}
          accessibilityLabel="Ouvrir mon profil"
          accessibilityRole="button"
          activeOpacity={1}
        >
          <Animated.View style={[styles.profileButton, { transform: [{ scale: scaleAnim }] }]}>
            <Ionicons name="person" size={18} color={Colors.primary} />
          </Animated.View>
        </TouchableOpacity>

        {/* ── Titre central (optionnel) ── */}
        {title ? (
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        ) : (
          <View style={styles.titlePlaceholder} />
        )}

        {/* ── Logo (droite) ── */}
        <View style={styles.logoContainer}>
          <Image
            source={LOGO_SOURCE}
            style={styles.logoImage}
            resizeMode="contain"
            // Fallback si l'image ne charge pas
            onError={() => {}}
          />
        </View>

      </View>

      {/* Ligne de séparation subtile */}
      <View style={styles.bottomBorder} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    height: 58,
  },

  // ── Profil ──
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary + '30',
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
    borderRadius: Radius.sm,
  },

  // ── Séparateur ──
  bottomBorder: {
    height: 1,
    backgroundColor: Colors.border,
    opacity: 0.6,
  },
});

export default Header;