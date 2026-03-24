// ─────────────────────────────────────────────
//  AccessiWay — SOSDetailScreen.js
//  Détail d'un SOS passé (depuis les récents)
// ─────────────────────────────────────────────

import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet,
} from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme/theme';

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || '—'}</Text>
    </View>
  </View>
);

const SOSDetailScreen = ({
  onNavigate,
  onPressProfile,
  onNavigateTo,
  selectedRecent,
}) => {
  if (!selectedRecent) {
    return null;
  }

  const sos = selectedRecent;

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

        {/* ── En-tête ── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => onNavigateTo('sos')}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>‹</Text>
            <Text style={styles.backText}>Mes SOS récents</Text>
          </TouchableOpacity>
        </View>

        {/* ── Titre du SOS ── */}
        <View style={styles.titleCard}>
          <Text style={styles.problemIcon}>{sos.problemIcon || '🆘'}</Text>
          <Text style={styles.problemTitle}>
            {sos.problemLabel || 'SOS personnalisé'}
          </Text>
          <Text style={styles.dateText}>{formatDate(sos.createdAt)}</Text>
        </View>

        {/* ── Détails ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations</Text>
          <View style={styles.detailCard}>
            <InfoRow
              icon="📍"
              label="Lieu"
              value={sos.location}
            />
            <View style={styles.separator} />
            <InfoRow
              icon="🔧"
              label="Problème"
              value={sos.problemLabel}
            />
            {sos.detail ? (
              <>
                <View style={styles.separator} />
                <InfoRow
                  icon="📝"
                  label="Détail"
                  value={sos.detail}
                />
              </>
            ) : null}
            {sos.contexts?.length > 0 ? (
              <>
                <View style={styles.separator} />
                <InfoRow
                  icon="♿"
                  label="Contexte"
                  value={sos.contexts.join(', ')}
                />
              </>
            ) : null}
          </View>
        </View>

        {/* ── Zone d'aide ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zone d'aide</Text>
          <View style={styles.detailCard}>
            <InfoRow
              icon="📡"
              label="Rayon de diffusion"
              value={sos.radius ? `${sos.radius} m` : '800 m'}
            />
            <View style={styles.separator} />
            <InfoRow
              icon="✅"
              label="Helpers vérifiés"
              value={sos.helpersVerified ? 'Activé' : 'Désactivé'}
            />
            <View style={styles.separator} />
            <InfoRow
              icon="🏥"
              label="Professionnels de santé"
              value={sos.healthPros ? 'Activé' : 'Désactivé'}
            />
          </View>
        </View>

        {/* ── Relancer ── */}
        <TouchableOpacity
          style={styles.relaunchButton}
          onPress={() => onNavigateTo('sos_step1')}
          activeOpacity={0.85}
        >
          <Text style={styles.relaunchText}>🔄 Relancer ce SOS</Text>
        </TouchableOpacity>

      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xl },

  // ── Header ──
  header: { marginBottom: Spacing.md },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  backIcon: { fontSize: 22, color: Colors.primary, lineHeight: 24 },
  backText: {
    fontSize: Typography.md,
    color: Colors.primary,
    fontWeight: Typography.medium,
  },

  // ── Titre ──
  titleCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
    gap: Spacing.xs,
  },
  problemIcon: { fontSize: 48 },
  problemTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  dateText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: 4,
    textTransform: 'capitalize',
  },

  // ── Section ──
  section: { marginBottom: Spacing.lg },
  sectionTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },

  detailCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  infoIcon: { fontSize: 18, marginTop: 1 },
  infoContent: { flex: 1 },
  infoLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: Typography.md,
    color: Colors.textPrimary,
    fontWeight: Typography.medium,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },

  // ── Relancer ──
  relaunchButton: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
  },
  relaunchText: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
});

export default SOSDetailScreen;
