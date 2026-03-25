// ─────────────────────────────────────────────
//  AccessiWay — SOSScreen.js
//  Écran principal SOS
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Alert,
} from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme/theme';

const QUICK_TAGS = [
  'Ascenseur en panne',
  'Travaux / trottoir',
  'Portes lourdes',
  'Escalator HS',
  "Besoin d'accompagnement",
  'Autre',
];

const SOSScreen = ({
  onNavigate,
  onPressProfile,
  onNavigateTo,
  sosRecents,
  onOpenRecent,
}) => {
  const [sosSent, setSosSent] = useState(false);

  const handleActivateSOS = () => {
    Alert.alert(
      '🆘 SOS envoyé',
      'Votre alerte a été transmise aux personnes à proximité. Restez en sécurité.',
      [{ text: 'OK', onPress: () => setSosSent(false) }]
    );
    setSosSent(true);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <ScreenLayout
      title="SOS"
      activeTab="sos"
      onNavigate={onNavigate}
      onPressProfile={onPressProfile}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Carte principale ACTIVER SOS ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Besoin d'aide maintenant ?</Text>

          {/* Bouton SOS — envoi direct sans configuration */}
          <TouchableOpacity
            style={[styles.sosButton, sosSent && styles.sosButtonSent]}
            onPress={handleActivateSOS}
            accessibilityLabel="Activer le SOS immédiatement"
            accessibilityRole="button"
            activeOpacity={0.85}
          >
            <View style={[styles.sosButtonInner, sosSent && styles.sosButtonInnerSent]}>
              <Text style={styles.sosButtonText}>
                {sosSent ? 'SOS\nENVOYÉ ✓' : 'ACTIVER\nSOS'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Tags informatifs — sélection visuelle seulement */}
          <View style={styles.tagsRow}>
            {QUICK_TAGS.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Info */}
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={styles.infoText}>
              Votre demande est locale et expire automatiquement (10 min.).
            </Text>
          </View>
        </View>

        {/* ── SOS récents ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes SOS récents</Text>

          {sosRecents.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>Aucun SOS récent</Text>
            </View>
          ) : (
            sosRecents.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.recentItem}
                onPress={() => onOpenRecent(item)}
                activeOpacity={0.7}
                accessibilityLabel={`Voir le détail : ${item.problemLabel || 'SOS'}`}
              >
                <View style={styles.recentLeft}>
                  <Text style={styles.recentLabel}>
                    {item.problemLabel || 'SOS personnalisé'}
                  </Text>
                  <Text style={styles.recentDate}>{formatDate(item.createdAt)}</Text>
                </View>
                <Text style={styles.recentArrow}>›</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* ── Bouton SOS Personnalisé ── */}
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => onNavigateTo('sos_step1')}
          accessibilityLabel="Créer un SOS personnalisé"
          accessibilityRole="button"
          activeOpacity={0.85}
        >
          <Text style={styles.customButtonText}>SOS Personnalisé</Text>
        </TouchableOpacity>

      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#F0F8FF' },
  content: { padding: Spacing.md, paddingBottom: Spacing.xl },

  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#D6EAF8',
  },
  cardTitle: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },

  sosButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E8F6FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 3,
    borderColor: '#AED6F1',
    ...Shadows.md,
  },
  sosButtonSent: {
    borderColor: '#A9DFBF',
    backgroundColor: '#EAFAF1',
  },
  sosButtonInner: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  sosButtonInnerSent: {
    backgroundColor: '#27AE60',
  },
  sosButtonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.extrabold,
    color: Colors.white,
    textAlign: 'center',
    letterSpacing: 1,
  },

  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  tag: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.white,
  },
  tagText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EBF5FB',
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  infoIcon: { fontSize: 13 },
  infoText: {
    flex: 1,
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  section: { marginBottom: Spacing.md },
  sectionTitle: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  emptyIcon: { fontSize: 28 },
  emptyText: {
    fontSize: Typography.sm,
    color: Colors.textDisabled,
  },

  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xs,
    ...Shadows.sm,
  },
  recentLeft: { gap: 2 },
  recentLabel: {
    fontSize: Typography.md,
    color: Colors.textPrimary,
    fontWeight: Typography.medium,
  },
  recentDate: {
    fontSize: Typography.xs,
    color: Colors.textDisabled,
  },
  recentArrow: {
    fontSize: 20,
    color: Colors.textSecondary,
  },

  customButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    ...Shadows.md,
  },
  customButtonText: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.white,
    letterSpacing: 0.5,
  },
});

export default SOSScreen;
