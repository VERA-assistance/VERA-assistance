// ─────────────────────────────────────────────
//  AccessiWay — SOSScreen.js
//  Écran principal SOS
// ─────────────────────────────────────────────

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Alert, Animated, Linking,
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

// ── États du bouton SOS ──────────────────────
const SOS_STATE = {
  IDLE:     'idle',     // 🔵 Bleu  — prêt
  ACTIVE:   'active',   // 🟢 Vert  — SOS en cours
  STOPPING: 'stopping', // 🔴 Rouge — cooldown 5s
};

const COOLDOWN_SECONDS = 5;

const SOSScreen = ({
  onNavigate,
  onPressProfile,
  onNavigateTo,
  sosRecents = [],   // ← valeur par défaut si undefined
  onOpenRecent,
}) => {
  const [sosState, setSosState]   = useState(SOS_STATE.IDLE);
  const [countdown, setCountdown] = useState(COOLDOWN_SECONDS);
  const countdownRef              = useRef(null);
  const pulseAnim                 = useRef(new Animated.Value(1)).current;
  const pulseLoop                 = useRef(null);

  // ── Pulse quand actif ────────────────────────
  useEffect(() => {
    if (sosState === SOS_STATE.ACTIVE) {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.09, duration: 700, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1,    duration: 700, useNativeDriver: true }),
        ])
      );
      pulseLoop.current.start();
    } else {
      if (pulseLoop.current) pulseLoop.current.stop();
      Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    }
  }, [sosState]);

  // ── Nettoyage ────────────────────────────────
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // ── Activer ──────────────────────────────────
  const handleActivateSOS = () => {
    setSosState(SOS_STATE.ACTIVE);
  };

  // ── Arrêter → cooldown rouge direct ─────────
  const handleStopSOS = () => {
    startCooldown();
  };

  const startCooldown = () => {
    setSosState(SOS_STATE.STOPPING);
    setCountdown(COOLDOWN_SECONDS);

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          setSosState(SOS_STATE.IDLE);
          return COOLDOWN_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ── Gestion du press ─────────────────────────
  const handleButtonPress = () => {
    if (sosState === SOS_STATE.IDLE)   return handleActivateSOS();
    if (sosState === SOS_STATE.ACTIVE) return handleStopSOS();
    // STOPPING → désactivé
  };

  // ── Contenu dynamique ────────────────────────
  const buttonLabel = sosState === SOS_STATE.ACTIVE
    ? 'ARRÊTER\nLE SOS'
    : sosState === SOS_STATE.STOPPING
    ? `ARRÊT\n${countdown}s`
    : 'ACTIVER\nSOS';

  const cardTitle = sosState === SOS_STATE.ACTIVE
    ? '🆘 SOS en cours...'
    : sosState === SOS_STATE.STOPPING
    ? 'Alerte annulée'
    : "Besoin d'aide maintenant ?";

  const statusLabel = sosState === SOS_STATE.ACTIVE
    ? '● Alerte diffusée autour de vous'
    : sosState === SOS_STATE.STOPPING
    ? `Réactivation disponible dans ${countdown}s`
    : 'Appuyez pour envoyer une alerte';

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    });
  };

  // ── Appel urgences ───────────────────────────
  const handleCallEmergency = () => {
    Alert.alert(
      '📞 Appeler les urgences ?',
      'Vous allez être mis en relation avec le 15 (SAMU).',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Appeler le 15',
          style: 'destructive',
          onPress: () => Linking.openURL('tel:15'),
        },
      ]
    );
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

        {/* ── Carte principale ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{cardTitle}</Text>

          {/* ── Bouton SOS animé ── */}
          <TouchableOpacity
            onPress={handleButtonPress}
            disabled={sosState === SOS_STATE.STOPPING}
            accessibilityRole="button"
            activeOpacity={0.85}
          >
            <Animated.View style={[
              styles.sosButton,
              sosState === SOS_STATE.ACTIVE   && styles.sosButtonActive,
              sosState === SOS_STATE.STOPPING && styles.sosButtonStopping,
              { transform: [{ scale: pulseAnim }] },
            ]}>
              <View style={[
                styles.sosButtonInner,
                sosState === SOS_STATE.ACTIVE   && styles.sosButtonInnerActive,
                sosState === SOS_STATE.STOPPING && styles.sosButtonInnerStopping,
              ]}>
                <Text style={styles.sosButtonText}>{buttonLabel}</Text>
              </View>
            </Animated.View>
          </TouchableOpacity>

          {/* ── Badge état ── */}
          <View style={[
            styles.statusBadge,
            sosState === SOS_STATE.ACTIVE   && styles.statusBadgeActive,
            sosState === SOS_STATE.STOPPING && styles.statusBadgeStopping,
          ]}>
            <Text style={[
              styles.statusText,
              sosState === SOS_STATE.ACTIVE   && styles.statusTextActive,
              sosState === SOS_STATE.STOPPING && styles.statusTextStopping,
            ]}>
              {statusLabel}
            </Text>
          </View>

          {/* Tags */}
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
                onPress={() => onOpenRecent && onOpenRecent(item)}
                activeOpacity={0.7}
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

        {/* ── SOS Personnalisé ── */}
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => onNavigateTo && onNavigateTo('sos_step1')}
          activeOpacity={0.85}
        >
          <Text style={styles.customButtonText}>SOS Personnalisé</Text>
        </TouchableOpacity>

        {/* ── Appel urgences ── */}
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={handleCallEmergency}
          activeOpacity={0.85}
          accessibilityLabel="Appeler le 15, numéro des urgences"
          accessibilityRole="button"
        >
          <Text style={styles.emergencyIcon}>📞</Text>
          <View>
            <Text style={styles.emergencyButtonText}>Appeler les urgences</Text>
            <Text style={styles.emergencyButtonSub}>SAMU — 15</Text>
          </View>
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

  // ── Bouton — états ──
  sosButton: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: '#E8F6FD',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 3, borderColor: '#AED6F1',
    ...Shadows.md,
  },
  sosButtonActive: {
    backgroundColor: '#EAFAF1',
    borderColor: '#A9DFBF',
  },
  sosButtonStopping: {
    backgroundColor: '#FDEDEC',
    borderColor: '#F1948A',
  },
  sosButtonInner: {
    width: 116, height: 116, borderRadius: 58,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    ...Shadows.lg,
  },
  sosButtonInnerActive:   { backgroundColor: '#27AE60' },
  sosButtonInnerStopping: { backgroundColor: '#E74C3C' },
  sosButtonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.extrabold,
    color: Colors.white,
    textAlign: 'center',
    letterSpacing: 1,
  },

  // ── Badge état ──
  statusBadge: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    marginBottom: Spacing.md,
  },
  statusBadgeActive:   { backgroundColor: '#EAFAF1' },
  statusBadgeStopping: { backgroundColor: '#FDEDEC' },
  statusText: {
    fontSize: Typography.xs, color: Colors.primary, fontWeight: Typography.medium,
  },
  statusTextActive:   { color: '#27AE60', fontWeight: Typography.semibold },
  statusTextStopping: { color: '#E74C3C', fontWeight: Typography.semibold },

  // ── Tags ──
  tagsRow: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center', gap: Spacing.xs, marginBottom: Spacing.md,
  },
  tag: {
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm + 2, paddingVertical: Spacing.xs,
    backgroundColor: Colors.white,
  },
  tagText: { fontSize: Typography.xs, color: Colors.textSecondary },

  infoRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#EBF5FB', borderRadius: Radius.sm,
    padding: Spacing.sm, gap: Spacing.xs,
  },
  infoIcon: { fontSize: 13 },
  infoText: { flex: 1, fontSize: Typography.xs, color: Colors.textSecondary, lineHeight: 18 },

  // ── Récents ──
  section: { marginBottom: Spacing.md },
  sectionTitle: {
    fontSize: Typography.md, fontWeight: Typography.bold,
    color: Colors.textPrimary, marginBottom: Spacing.sm,
  },
  emptyState: {
    alignItems: 'center', paddingVertical: Spacing.lg,
    backgroundColor: Colors.white, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border, gap: Spacing.xs,
  },
  emptyIcon: { fontSize: 28 },
  emptyText: { fontSize: Typography.sm, color: Colors.textDisabled },
  recentItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.xs, ...Shadows.sm,
  },
  recentLeft: { gap: 2 },
  recentLabel: { fontSize: Typography.md, color: Colors.textPrimary, fontWeight: Typography.medium },
  recentDate: { fontSize: Typography.xs, color: Colors.textDisabled },
  recentArrow: { fontSize: 20, color: Colors.textSecondary },

  // ── Bouton personnalisé ──
  customButton: {
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingVertical: Spacing.md, alignItems: 'center', ...Shadows.md,
    marginBottom: Spacing.sm,
  },
  customButtonText: {
    fontSize: Typography.md, fontWeight: Typography.bold,
    color: Colors.white, letterSpacing: 0.5,
  },

  // ── Bouton urgences ──
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    paddingVertical: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.sos,
    ...Shadows.sm,
  },
  emergencyIcon: { fontSize: 20 },
  emergencyButtonText: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.sos,
  },
  emergencyButtonSub: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default SOSScreen;