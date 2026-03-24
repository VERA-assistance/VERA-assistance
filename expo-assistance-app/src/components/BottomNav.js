// ─────────────────────────────────────────────
//  AccessiWay — BottomNav Component
//
//  Props :
//    activeTab  (string)  — 'map' | 'community' | 'sos'
//    onNavigate (func)    — callback(tabKey: string)
// ─────────────────────────────────────────────

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, Shadows } from '../theme/theme';

// ── Icônes SVG inline (pas de dépendance externe) ──────────────────
// Vous pouvez remplacer ces SVGs par react-native-vector-icons ou vos
// propres assets une fois la configuration mise en place.

const IconMap = ({ active }) => (
  <Text style={[styles.iconText, active && styles.iconTextActive]}>
    🗺️
  </Text>
);

const IconCommunity = ({ active }) => (
  <Text style={[styles.iconText, active && styles.iconTextActive]}>
    👥
  </Text>
);

const IconSOS = () => (
  <Text style={styles.iconSOS}>🆘</Text>
);

// ── Définition des onglets ────────────────────────────────────────
const TABS = [
  {
    key: 'map',
    label: 'Carte',
    Icon: IconMap,
    accessibilityLabel: 'Carte de navigation',
  },
  {
    key: 'community',
    label: 'Communauté',
    Icon: IconCommunity,
    accessibilityLabel: 'Communauté et entraide',
  },
  {
    key: 'sos',
    label: 'SOS',
    Icon: IconSOS,
    accessibilityLabel: 'Bouton SOS urgence',
    isSOS: true,
  },
];

const BottomNav = ({ activeTab, onNavigate }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      <View style={styles.container}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;

          if (tab.isSOS) {
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.sosButton}
                onPress={() => onNavigate(tab.key)}
                accessibilityLabel={tab.accessibilityLabel}
                accessibilityRole="button"
                activeOpacity={0.8}
              >
                <View style={styles.sosInner}>
                  <tab.Icon />
                  <Text style={styles.sosLabel}>{tab.label}</Text>
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabButton}
              onPress={() => onNavigate(tab.key)}
              accessibilityLabel={tab.accessibilityLabel}
              accessibilityRole="button"
              activeOpacity={0.7}
            >
              <tab.Icon active={isActive} />
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

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
    height: 64,
    paddingHorizontal: Spacing.sm,
  },

  // ── Onglet normal ──
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
    position: 'relative',
  },
  iconText: {
    fontSize: 22,
    opacity: 0.5,
  },
  iconTextActive: {
    opacity: 1,
  },
  label: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    color: Colors.navInactive,
    marginTop: 2,
  },
  labelActive: {
    color: Colors.navActive,
    fontWeight: Typography.semibold,
  },
  activeDot: {
    position: 'absolute',
    bottom: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.navActive,
  },

  // ── Bouton SOS ──
  sosButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosInner: {
    backgroundColor: Colors.sos,
    borderRadius: 16,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
    // Pulse animation à ajouter avec Animated si souhaité
  },
  iconSOS: {
    fontSize: 20,
  },
  sosLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.white,
    marginTop: 1,
    letterSpacing: 0.5,
  },
});

export default BottomNav;
