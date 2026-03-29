// ─────────────────────────────────────────────
//  AccessiWay — SOSStep2Screen.js
//  Étape 2/3 — Confirmer la zone d'aide
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Switch,
} from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme/theme';

const MapPlaceholder = ({ radius, location }) => (
  <View style={styles.mapContainer}>
    <View style={styles.mapPlaceholder}>
      <Text style={styles.mapEmoji}>🗺️</Text>
      <Text style={styles.mapLabel}>{location || 'Votre position'}</Text>
      <Text style={styles.mapSub}>Rayon de {radius} m autour de vous</Text>
    </View>
  </View>
);

const RADIUS_OPTIONS = [400, 800, 1500];

const SOSStep2Screen = ({
  onNavigate,
  onPressProfile,
  onNavigateTo,
  onUpdateSosData,
  currentSosData,
}) => {
  const [radius, setRadius]                 = useState(currentSosData.radius || 800);
  const [helpersVerified, setHelpersVerified] = useState(true);
  const [healthPros, setHealthPros]         = useState(false);

  const handleNext = () => {
    onUpdateSosData({ radius, helpersVerified, healthPros });
    onNavigateTo('sos_step3');
  };

  // ── Résumé dynamique basé sur l'étape 1 ──
  const summaryText = currentSosData.problemLabel
    ? `${currentSosData.problemIcon || ''} ${currentSosData.problemLabel}${
        currentSosData.location ? ` — ${currentSosData.location}` : ''
      }`
    : 'Votre demande';

  return (
    <ScreenLayout
      activeTab="sos"
      onNavigate={onNavigate}
      onPressProfile={onPressProfile}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Step header ── */}
        <View style={styles.stepHeader}>
          <Text style={styles.stepTitle}>Confirmer la zone</Text>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>2/3</Text>
          </View>
        </View>

        {/* ── Résumé dynamique de l'étape 1 ── */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>{summaryText}</Text>
          {currentSosData.contexts?.length > 0 && (
            <Text style={styles.summaryContexts}>
              {currentSosData.contexts.join(' · ')}
            </Text>
          )}
          {currentSosData.detail ? (
            <Text style={styles.summaryDetail} numberOfLines={2}>
              "{currentSosData.detail}"
            </Text>
          ) : null}
        </View>

        {/* ── Info rayon ── */}
        <Text style={styles.radiusInfo}>
          Votre demande sera visible dans un rayon de{' '}
          <Text style={styles.radiusHighlight}>{radius} m.</Text>
        </Text>

        {/* ── Carte ── */}
        <MapPlaceholder radius={radius} location={currentSosData.location} />

        {/* ── Sélecteur rayon ── */}
        <View style={styles.sliderSection}>
          <Text style={styles.sliderValue}>{radius} m</Text>
          <View style={styles.sliderTrack}>
            {RADIUS_OPTIONS.map((r, i) => {
              const isActive = radius === r;
              const isPast   = RADIUS_OPTIONS.indexOf(radius) >= i;
              return (
                <React.Fragment key={r}>
                  {i > 0 && (
                    <View style={[styles.sliderLine, isPast && styles.sliderLineActive]} />
                  )}
                  <TouchableOpacity
                    onPress={() => setRadius(r)}
                    style={[styles.sliderDot, isActive && styles.sliderDotActive]}
                    activeOpacity={0.8}
                  />
                </React.Fragment>
              );
            })}
          </View>
          <View style={styles.sliderLabels}>
            {RADIUS_OPTIONS.map((r) => (
              <Text
                key={r}
                style={[styles.sliderLabel, radius === r && styles.sliderLabelActive]}
              >
                {r >= 1000 ? `${r / 1000} km` : `${r} m`}
              </Text>
            ))}
          </View>
        </View>

        {/* ── Qui peut répondre ── */}
        <View style={styles.toggleSection}>
          <Text style={styles.toggleSectionTitle}>Qui peut répondre ?</Text>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Helpers vérifiés</Text>
            <Switch
              value={helpersVerified}
              onValueChange={setHelpersVerified}
              trackColor={{ false: Colors.border, true: Colors.accent }}
              thumbColor={Colors.white}
            />
          </View>
          <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.toggleLabel}>Professionnels de santé</Text>
            <Switch
              value={healthPros}
              onValueChange={setHealthPros}
              trackColor={{ false: Colors.border, true: Colors.accent }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        {/* ── Navigation ── */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => onNavigateTo('sos_step1')}
            activeOpacity={0.7}
          >
            <Text style={styles.btnSecondaryText}>Précédent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>Suivant</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xl },

  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  stepTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  stepBadge: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
  },
  stepBadgeText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.white,
  },

  // ── Résumé dynamique ──
  summaryCard: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#AED6F1',
    gap: 4,
  },
  summaryText: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
  summaryContexts: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  summaryDetail: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },

  radiusInfo: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  radiusHighlight: {
    color: Colors.primary,
    fontWeight: Typography.bold,
  },

  mapContainer: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  mapPlaceholder: {
    height: 180,
    backgroundColor: '#D6EAF8',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  mapEmoji: { fontSize: 36 },
  mapLabel: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
  mapSub: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },

  sliderSection: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    alignItems: 'center',
  },
  sliderValue: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  sliderTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  sliderLine: { flex: 1, height: 4, backgroundColor: Colors.border, marginHorizontal: -2 },
  sliderLineActive: { backgroundColor: Colors.primary },
  sliderDot: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.border, zIndex: 1,
  },
  sliderDotActive: {
    backgroundColor: Colors.primary,
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 3, borderColor: '#AED6F1',
  },
  sliderLabels: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  sliderLabel: {
    fontSize: Typography.xs, color: Colors.textDisabled,
    flex: 1, textAlign: 'center',
  },
  sliderLabelActive: { color: Colors.primary, fontWeight: Typography.bold },

  toggleSection: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  toggleSectionTitle: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  toggleLabel: { fontSize: Typography.md, color: Colors.textPrimary },

  navRow: { flexDirection: 'row', gap: Spacing.sm },
  btnSecondary: {
    flex: 1, paddingVertical: Spacing.md, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', backgroundColor: Colors.white,
  },
  btnSecondaryText: {
    fontSize: Typography.md, color: Colors.textSecondary, fontWeight: Typography.medium,
  },
  btnPrimary: {
    flex: 1, paddingVertical: Spacing.md, borderRadius: Radius.md,
    backgroundColor: Colors.primary, alignItems: 'center', ...Shadows.sm,
  },
  btnPrimaryText: {
    fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.white,
  },
});

export default SOSStep2Screen;
