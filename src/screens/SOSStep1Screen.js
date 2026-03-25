// ─────────────────────────────────────────────
//  AccessiWay — SOSStep1Screen.js
//  Étape 1/3 — Décrire la situation
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet,
} from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme/theme';

const PROBLEM_TYPES = [
  { key: 'fuite',     label: "Fuite d'eau",       icon: '💧' },
  { key: 'eclairage', label: 'Éclairage en panne', icon: '💡' },
  { key: 'escalier',  label: 'Escalier bloqué',    icon: '🚧' },
  { key: 'porte',     label: 'Porte en défaut',    icon: '🚪' },
  { key: 'ascenseur', label: 'Ascenseur en panne', icon: '🛗' },
];

const CONTEXTS = ['Fauteuil roulant', 'Béquilles', 'Poussette'];

const SOSStep1Screen = ({
  onNavigate,
  onPressProfile,
  onNavigateTo,
  onUpdateSosData,
  currentSosData,
}) => {
  const [selectedProblem, setSelectedProblem] = useState(
    currentSosData.problemKey || 'ascenseur'
  );
  const [location, setLocation] = useState(
    currentSosData.location || 'Gare Part-Dieu'
  );
  const [detail, setDetail]   = useState(currentSosData.detail || '');
  const [selectedContexts, setSelectedContexts] = useState(
    currentSosData.contexts || []
  );

  const toggleContext = (ctx) => {
    setSelectedContexts((prev) =>
      prev.includes(ctx) ? prev.filter((c) => c !== ctx) : [...prev, ctx]
    );
  };

  const handleNext = () => {
    const problemLabel = PROBLEM_TYPES.find((p) => p.key === selectedProblem)?.label;
    onUpdateSosData({
      problemKey:   selectedProblem,
      problemLabel,
      problemIcon:  PROBLEM_TYPES.find((p) => p.key === selectedProblem)?.icon,
      location,
      detail,
      contexts:     selectedContexts,
    });
    onNavigateTo('sos_step2');
  };

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
          <Text style={styles.stepTitle}>Décrire la situation</Text>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>1/3</Text>
          </View>
        </View>

        {/* ── Type de problème ── */}
        <View style={styles.section}>
          <Text style={styles.label}>Type de problème</Text>
          <View style={styles.problemGrid}>
            {PROBLEM_TYPES.map((item) => {
              const active = selectedProblem === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.problemItem, active && styles.problemItemActive]}
                  onPress={() => setSelectedProblem(item.key)}
                  accessibilityLabel={item.label}
                  activeOpacity={0.7}
                >
                  <View style={[styles.problemIcon, active && styles.problemIconActive]}>
                    <Text style={styles.problemEmoji}>{item.icon}</Text>
                  </View>
                  <Text style={[styles.problemLabel, active && styles.problemLabelActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Où ? ── */}
        <View style={styles.section}>
          <Text style={styles.label}>Où ?</Text>
          <View style={styles.inputRow}>
            <Text style={styles.inputIcon}>📍</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Saisissez un lieu"
              placeholderTextColor={Colors.textDisabled}
            />
          </View>
        </View>

        {/* ── Détail ── */}
        <View style={styles.section}>
          <Text style={styles.label}>Détail</Text>
          <TextInput
            style={styles.textArea}
            value={detail}
            onChangeText={setDetail}
            placeholder="Ex: ascenseur quai B en panne, je suis seul(e)"
            placeholderTextColor={Colors.textDisabled}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* ── Contexte ── */}
        <View style={styles.section}>
          <Text style={styles.label}>Contexte :</Text>
          <View style={styles.contextRow}>
            {CONTEXTS.map((ctx) => {
              const active = selectedContexts.includes(ctx);
              return (
                <TouchableOpacity
                  key={ctx}
                  style={[styles.contextTag, active && styles.contextTagActive]}
                  onPress={() => toggleContext(ctx)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.contextTagText, active && styles.contextTagTextActive]}>
                    {ctx}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Navigation ── */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => onNavigateTo('sos')}
            activeOpacity={0.7}
          >
            <Text style={styles.btnSecondaryText}>Annuler</Text>
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
    marginBottom: Spacing.lg,
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

  section: { marginBottom: Spacing.lg },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  problemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  problemItem: { width: '18%', alignItems: 'center', gap: 4 },
  problemItemActive: {},
  problemIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.sm,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  problemIconActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  problemEmoji: { fontSize: 22 },
  problemLabel: {
    fontSize: 9,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 12,
  },
  problemLabelActive: {
    color: Colors.primary,
    fontWeight: Typography.semibold,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    ...Shadows.sm,
  },
  inputIcon: { fontSize: 16, marginRight: Spacing.sm },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: Typography.md,
    color: Colors.textPrimary,
  },
  textArea: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    fontSize: Typography.md,
    color: Colors.textPrimary,
    minHeight: 100,
    ...Shadows.sm,
  },

  contextRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  contextTag: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    backgroundColor: Colors.white,
  },
  contextTagActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  contextTagText: { fontSize: Typography.sm, color: Colors.textSecondary },
  contextTagTextActive: { color: Colors.primary, fontWeight: Typography.semibold },

  navRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  btnSecondary: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  btnSecondaryText: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  btnPrimary: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    ...Shadows.sm,
  },
  btnPrimaryText: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
});

export default SOSStep1Screen;
