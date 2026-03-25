// ─────────────────────────────────────────────
//  AccessiWay — SOSStep3Screen.js
//  Étape 3/3 — Choisir un helper
// ─────────────────────────────────────────────

import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Alert,
} from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme/theme';

const HELPERS = [
  { id: '1', name: 'Marc',    verified: true, status: 'Répond',      statusColor: '#27AE60',         rating: 4.8, helpCount: 12, distance: '0.2 km', time: '4 min.', avatar: '👨' },
  { id: '2', name: 'Laura',   verified: true, status: 'En approche', statusColor: Colors.primary,    rating: 4.7, helpCount: 12, distance: '0.2 km', time: '4 min.', avatar: '👩' },
  { id: '3', name: 'Sarah',   verified: true, status: 'Lecture',     statusColor: Colors.textSecondary, rating: 4.9, helpCount: 12, distance: '0.2 km', time: '4 min.', avatar: '👩‍🦱' },
  { id: '4', name: 'Youssef', verified: true, status: 'En approche', statusColor: Colors.primary,    rating: 4.6, helpCount: 12, distance: '0.2 km', time: '4 min.', avatar: '👨‍🦱' },
];

const HelperCard = ({ helper, onDemander, onProfil }) => (
  <View style={styles.card}>
    <View style={styles.avatar}>
      <Text style={styles.avatarEmoji}>{helper.avatar}</Text>
    </View>

    <View style={styles.helperInfo}>
      <View style={styles.helperNameRow}>
        <Text style={styles.helperName}>{helper.name}</Text>
        {helper.verified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>Vérifié</Text>
          </View>
        )}
      </View>
      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: helper.statusColor }]} />
        <Text style={[styles.statusText, { color: helper.statusColor }]}>
          {helper.status}
        </Text>
        <Text style={styles.distanceText}>{helper.distance} · {helper.time}</Text>
      </View>
      <View style={styles.ratingRow}>
        <Text style={styles.star}>⭐</Text>
        <Text style={styles.ratingValue}>{helper.rating}</Text>
        <Text style={styles.helpCount}>{helper.helpCount} aides</Text>
      </View>
    </View>

    <View style={styles.helperActions}>
      <TouchableOpacity style={styles.btnDemander} onPress={() => onDemander(helper)} activeOpacity={0.8}>
        <Text style={styles.btnDemanderText}>Demander</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnProfil} onPress={() => onProfil(helper)} activeOpacity={0.8}>
        <Text style={styles.btnProfilText}>Profil</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const SOSStep3Screen = ({
  onNavigate,
  onPressProfile,
  onNavigateTo,
  onConfirmSos,
  currentSosData,
}) => {

  const handleDemander = (helper) => {
    Alert.alert(
      `Demande envoyée à ${helper.name}`,
      `${helper.name} a été notifié(e) de votre demande. Votre SOS a été enregistré.`,
      [{ text: 'OK', onPress: onConfirmSos }]
    );
  };

  const handleProfil = (helper) => {
    Alert.alert(`Profil de ${helper.name}`, `⭐ ${helper.rating} · ${helper.helpCount} aides\n${helper.distance} · ${helper.time}`);
  };

  // ── Titre dynamique basé sur les données saisies ──
  const locationTitle = currentSosData.problemLabel
    ? `${currentSosData.problemLabel}${currentSosData.location ? ` — ${currentSosData.location}` : ''}`
    : 'SOS personnalisé';

  return (
    <ScreenLayout
      activeTab="sos"
      onNavigate={onNavigate}
      onPressProfile={onPressProfile}
    >
      <View style={styles.container}>

        {/* ── Step header ── */}
        <View style={styles.stepHeader}>
          <Text style={styles.stepTitle}>Recherche d'aide</Text>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>3/3</Text>
          </View>
        </View>

        {/* ── Résumé dynamique ── */}
        <View style={styles.locationRow}>
          <Text style={styles.locationIcon}>📍</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.locationTitle} numberOfLines={1}>
              {locationTitle}
            </Text>
            {currentSosData.contexts?.length > 0 && (
              <Text style={styles.locationSub}>
                {currentSosData.contexts.join(' · ')}
              </Text>
            )}
            <Text style={styles.locationTime}>
              Rayon : {currentSosData.radius || 800} m · Maintenant
            </Text>
          </View>
        </View>

        {/* ── Liste helpers ── */}
        <Text style={styles.sectionTitle}>Helpers disponibles</Text>

        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {HELPERS.map((helper) => (
            <HelperCard
              key={helper.id}
              helper={helper}
              onDemander={handleDemander}
              onProfil={handleProfil}
            />
          ))}
        </ScrollView>

        {/* ── Footer avec retour ── */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => onNavigateTo('sos_step2')}
            activeOpacity={0.8}
          >
            <Text style={styles.backIcon}>‹</Text>
            <Text style={styles.backText}>Précédent</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.callButton}
            onPress={() => Alert.alert("Appel d'urgence", 'Composer le 15 ou le 18 ?')}
            activeOpacity={0.8}
          >
            <Text style={styles.callIcon}>📞</Text>
            <Text style={styles.callText}>Urgence</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={onConfirmSos}
            activeOpacity={0.85}
          >
            <Text style={styles.continueText}>Continuer</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    marginBottom: Spacing.sm,
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

  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  locationIcon: { fontSize: 16, marginTop: 2 },
  locationTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  locationSub: {
    fontSize: Typography.xs,
    color: Colors.primary,
    marginTop: 1,
  },
  locationTime: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginTop: 1,
  },

  sectionTitle: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },

  list: { flex: 1, paddingHorizontal: Spacing.md },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.sm + 2,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
    gap: Spacing.sm,
  },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 24 },
  helperInfo: { flex: 1, gap: 3 },
  helperNameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  helperName: {
    fontSize: Typography.md, fontWeight: Typography.semibold, color: Colors.textPrimary,
  },
  verifiedBadge: {
    backgroundColor: '#EBF5FB', borderRadius: Radius.full,
    paddingHorizontal: Spacing.xs + 2, paddingVertical: 1,
  },
  verifiedText: { fontSize: 9, color: Colors.primary, fontWeight: Typography.bold },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: Typography.xs, fontWeight: Typography.semibold },
  distanceText: { fontSize: Typography.xs, color: Colors.textDisabled, marginLeft: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  star: { fontSize: 11 },
  ratingValue: { fontSize: Typography.xs, fontWeight: Typography.bold, color: Colors.textPrimary },
  helpCount: { fontSize: Typography.xs, color: Colors.textDisabled, marginLeft: 4 },

  helperActions: { gap: Spacing.xs, alignItems: 'center' },
  btnDemander: {
    backgroundColor: Colors.primary, borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs + 2, ...Shadows.sm,
  },
  btnDemanderText: { fontSize: Typography.xs, fontWeight: Typography.bold, color: Colors.white },
  btnProfil: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs + 2, backgroundColor: Colors.white,
  },
  btnProfilText: { fontSize: Typography.xs, color: Colors.textSecondary, fontWeight: Typography.medium },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    gap: 2,
  },
  backIcon: { fontSize: 18, color: Colors.textSecondary, lineHeight: 20 },
  backText: { fontSize: Typography.sm, color: Colors.textSecondary, fontWeight: Typography.medium },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  callIcon: { fontSize: 14 },
  callText: { fontSize: Typography.xs, color: Colors.textPrimary, fontWeight: Typography.medium },
  continueButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    ...Shadows.sm,
  },
  continueText: { fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.white },
});

export default SOSStep3Screen;
