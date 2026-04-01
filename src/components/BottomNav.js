// ─────────────────────────────────────────────
//  VERA — BottomNav Component
// ─────────────────────────────────────────────

import React, { useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Shadows, Radius } from '../theme/theme';

// ── Config des onglets (ordre : Map / Communauté / SOS) ───────────
const TABS = [
  {
    key:               'map',
    label:             'Carte',
    icon:              'map-outline',
    iconActive:        'map',
    accessibilityLabel: 'Carte de navigation',
  },
  {
    key:               'community',
    label:             'Communauté',
    icon:              'people-outline',
    iconActive:        'people',
    accessibilityLabel: 'Communauté et entraide',
  },
  {
    key:               'sos',
    label:             'SOS',
    isSOS:             true,
    accessibilityLabel: 'Bouton SOS urgence',
  },
];

// ── Onglet standard ───────────────────────────
const TabButton = ({ tab, isActive, onNavigate }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pillAnim  = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(pillAnim, {
      toValue: isActive ? 1 : 0,
      useNativeDriver: true,
      damping: 16,
      stiffness: 200,
    }).start();
  }, [isActive]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.88, duration: 70,  useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true, damping: 10, stiffness: 200 }),
    ]).start();
    onNavigate(tab.key);
  };

  return (
    <TouchableOpacity
      style={styles.tabButton}
      onPress={handlePress}
      accessibilityLabel={tab.accessibilityLabel}
      accessibilityRole="button"
      activeOpacity={1}
    >
      <Animated.View style={[styles.tabInner, { transform: [{ scale: scaleAnim }] }]}>

        {/* Fond pill animé */}
        <Animated.View
          style={[
            styles.activePill,
            { opacity: pillAnim, transform: [{ scaleX: pillAnim }, { scaleY: pillAnim }] },
          ]}
        />

        <Ionicons
          name={isActive ? tab.iconActive : tab.icon}
          size={22}
          color={isActive ? Colors.navActive : Colors.navInactive}
        />
        <Text style={[styles.label, isActive && styles.labelActive]}>
          {tab.label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ── Bouton SOS ────────────────────────────────
const SOSButton = ({ tab, onNavigate }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const haloAnim  = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(haloAnim, { toValue: 1.25, duration: 1200, useNativeDriver: true }),
        Animated.timing(haloAnim, { toValue: 1,    duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.88, duration: 70, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 8 }),
    ]).start();
    onNavigate(tab.key);
  };

  return (
    <TouchableOpacity
      style={styles.sosWrapper}
      onPress={handlePress}
      accessibilityLabel={tab.accessibilityLabel}
      accessibilityRole="button"
      activeOpacity={1}
    >
      {/* Halo pulsant */}
      <Animated.View style={[styles.sosHalo, { transform: [{ scale: haloAnim }] }]} />

      <Animated.View style={[styles.sosButton, { transform: [{ scale: scaleAnim }] }]}>
        <Ionicons name="warning" size={20} color={Colors.white} />
        <Text style={styles.sosLabel}>{tab.label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ── BottomNav ─────────────────────────────────
const BottomNav = ({ activeTab, onNavigate }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom || Spacing.xs }]}>
      <View style={styles.container}>
        {TABS.map((tab) =>
          tab.isSOS ? (
            <SOSButton key={tab.key} tab={tab} onNavigate={onNavigate} />
          ) : (
            <TabButton
              key={tab.key}
              tab={tab}
              isActive={activeTab === tab.key}
              onNavigate={onNavigate}
            />
          )
        )}
      </View>
    </View>
  );
};

// ── Styles ────────────────────────────────────
const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.navBackground,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadows.md,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 66,
    paddingHorizontal: Spacing.xs,
  },

  // ── Tab ──
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    position: 'relative',
    minWidth: 68,
    gap: 3,
  },
  activePill: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.lg,
  },
  label: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    color: Colors.navInactive,
    letterSpacing: 0.1,
  },
  labelActive: {
    color: Colors.navActive,
    fontWeight: Typography.bold,
  },

  // ── SOS ──
  sosWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  sosHalo: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: Colors.sos,
    opacity: 0.2,
  },
  sosButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.sos,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    shadowColor: Colors.sos,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sosLabel: {
    fontSize: 8,
    fontWeight: Typography.extrabold,
    color: Colors.white,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

export default BottomNav;