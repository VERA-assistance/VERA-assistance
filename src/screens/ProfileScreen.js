// ─────────────────────────────────────────────
//  AccessiWay — Écran Profil
//
//  Collaborateur responsable : [Nom]
//  Description : Profil utilisateur,
//                besoins d'accessibilité,
//                préférences et paramètres
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme/theme';

// ── Données utilisateur (à remplacer par votre contexte/store) ──
const USER = {
  prenom: 'Pierre',
  nom: 'Martin',
  email: 'pierre.martin@email.com',
  telephone: '+33 6 12 34 56 78',
  initiales: 'PM',
};

// ── Besoins d'accessibilité disponibles ────────────────────────
const ACCESSIBILITY_NEEDS = [
  { key: 'mobilite',       label: 'Mobilité réduite',       icon: '♿' },
  { key: 'visuelle',       label: 'Déficience visuelle',    icon: '👁️' },
  { key: 'auditive',       label: 'Déficience auditive',    icon: '👂' },
  { key: 'cognitive',      label: 'Difficulté cognitive',   icon: '🧠' },
  { key: 'fauteuil',       label: 'Fauteuil roulant',       icon: '🦽' },
  { key: 'canne',          label: 'Canne / béquilles',      icon: '🦯' },
];

// ── Section card ───────────────────────────────────────────────
const SectionCard = ({ title, children }) => (
  <View style={styles.sectionCard}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

// ── Ligne d'info ───────────────────────────────────────────────
const InfoRow = ({ label, value, onEdit }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
    {onEdit && (
      <TouchableOpacity
        onPress={onEdit}
        style={styles.editBtn}
        accessibilityLabel={`Modifier ${label}`}
        accessibilityRole="button"
      >
        <Text style={styles.editBtnText}>✏️</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ── Badge accessibilité ────────────────────────────────────────
const AccessBadge = ({ item, active, onToggle }) => (
  <TouchableOpacity
    style={[styles.badge, active && styles.badgeActive]}
    onPress={onToggle}
    accessibilityLabel={`${item.label} — ${active ? 'activé' : 'désactivé'}`}
    accessibilityRole="checkbox"
    accessibilityState={{ checked: active }}
    activeOpacity={0.75}
  >
    <Text style={styles.badgeIcon}>{item.icon}</Text>
    <Text style={[styles.badgeLabel, active && styles.badgeLabelActive]}>
      {item.label}
    </Text>
  </TouchableOpacity>
);

// ── Ligne de préférence avec switch ───────────────────────────
const PreferenceRow = ({ label, description, value, onToggle }) => (
  <View style={styles.prefRow}>
    <View style={styles.prefContent}>
      <Text style={styles.prefLabel}>{label}</Text>
      {description && (
        <Text style={styles.prefDescription}>{description}</Text>
      )}
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: Colors.border, true: Colors.primaryLight }}
      thumbColor={value ? Colors.primary : Colors.textDisabled}
      accessibilityLabel={label}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    />
  </View>
);

// ── Bouton d'action ────────────────────────────────────────────
const ActionButton = ({ label, icon, onPress, variant = 'default' }) => (
  <TouchableOpacity
    style={[styles.actionBtn, variant === 'danger' && styles.actionBtnDanger]}
    onPress={onPress}
    accessibilityLabel={label}
    accessibilityRole="button"
    activeOpacity={0.8}
  >
    <Text style={styles.actionBtnIcon}>{icon}</Text>
    <Text style={[styles.actionBtnLabel, variant === 'danger' && styles.actionBtnLabelDanger]}>
      {label}
    </Text>
    <Text style={styles.actionBtnChevron}>›</Text>
  </TouchableOpacity>
);

// ══ Écran principal ═══════════════════════════════════════════
const ProfileScreen = ({ onNavigate, onPressProfile }) => {
  // ── State ──
  const [accessibilityNeeds, setAccessibilityNeeds] = useState({
    mobilite: true,
    fauteuil: true,
  });

  const [preferences, setPreferences] = useState({
    notificationsAlertes: true,
    modeSombre:           false,
    grandePolice:         false,
    contrasterEleeve:     false,
    navigationVocale:     false,
  });

  // ── Handlers ──
  const toggleNeed = (key) => {
    setAccessibilityNeeds((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePref = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleEdit = (field) => {
    Alert.alert('Modifier', `Modifier "${field}" — à connecter à votre formulaire.`);
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnecter', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Cette action est irréversible. Toutes vos données seront effacées.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  // ── Render ──
  return (
    <ScreenLayout
      activeTab={null}
      onNavigate={onNavigate}
      onPressProfile={onPressProfile}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Avatar & nom ── */}
        <View style={styles.heroSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>{USER.initiales}</Text>
            </View>
            <TouchableOpacity
              style={styles.avatarEditBtn}
              onPress={() => handleEdit('Photo de profil')}
              accessibilityLabel="Changer la photo de profil"
              accessibilityRole="button"
            >
              <Text style={styles.avatarEditIcon}>📷</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.heroName}>{USER.prenom} {USER.nom}</Text>
          <Text style={styles.heroEmail}>{USER.email}</Text>
        </View>

        {/* ── Informations personnelles ── */}
        <SectionCard title="Informations personnelles">
          <InfoRow
            label="Prénom"
            value={USER.prenom}
            onEdit={() => handleEdit('Prénom')}
          />
          <View style={styles.divider} />
          <InfoRow
            label="Nom"
            value={USER.nom}
            onEdit={() => handleEdit('Nom')}
          />
          <View style={styles.divider} />
          <InfoRow
            label="Email"
            value={USER.email}
            onEdit={() => handleEdit('Email')}
          />
          <View style={styles.divider} />
          <InfoRow
            label="Téléphone"
            value={USER.telephone}
            onEdit={() => handleEdit('Téléphone')}
          />
        </SectionCard>

        {/* ── Besoins d'accessibilité ── */}
        <SectionCard title="Mes besoins d'accessibilité">
          <Text style={styles.sectionSubtitle}>
            Sélectionnez vos besoins pour personnaliser votre expérience et les itinéraires.
          </Text>
          <View style={styles.badgesGrid}>
            {ACCESSIBILITY_NEEDS.map((item) => (
              <AccessBadge
                key={item.key}
                item={item}
                active={!!accessibilityNeeds[item.key]}
                onToggle={() => toggleNeed(item.key)}
              />
            ))}
          </View>
        </SectionCard>

        {/* ── Préférences d'accessibilité ── */}
        <SectionCard title="Préférences d'affichage">
          <PreferenceRow
            label="Grandes polices"
            description="Augmente la taille du texte dans toute l'app"
            value={preferences.grandePolice}
            onToggle={() => togglePref('grandePolice')}
          />
          <View style={styles.divider} />
          <PreferenceRow
            label="Contraste élevé"
            description="Améliore la lisibilité sur fond clair"
            value={preferences.contrasterEleeve}
            onToggle={() => togglePref('contrasterEleeve')}
          />
          <View style={styles.divider} />
          <PreferenceRow
            label="Mode sombre"
            value={preferences.modeSombre}
            onToggle={() => togglePref('modeSombre')}
          />
          <View style={styles.divider} />
          <PreferenceRow
            label="Navigation vocale"
            description="Annonces audio pendant la navigation"
            value={preferences.navigationVocale}
            onToggle={() => togglePref('navigationVocale')}
          />
        </SectionCard>

        {/* ── Notifications ── */}
        <SectionCard title="Notifications">
          <PreferenceRow
            label="Alertes d'accessibilité"
            description="Soyez notifié des nouveaux signalements"
            value={preferences.notificationsAlertes}
            onToggle={() => togglePref('notificationsAlertes')}
          />
        </SectionCard>

        {/* ── Paramètres & actions ── */}
        <SectionCard title="Paramètres">
          <ActionButton
            label="Langue de l'application"
            icon="🌐"
            onPress={() => handleEdit('Langue')}
          />
          <View style={styles.divider} />
          <ActionButton
            label="Confidentialité & données"
            icon="🔒"
            onPress={() => handleEdit('Confidentialité')}
          />
          <View style={styles.divider} />
          <ActionButton
            label="Centre d'aide"
            icon="❓"
            onPress={() => handleEdit('Aide')}
          />
          <View style={styles.divider} />
          <ActionButton
            label="À propos d'AccessiWay"
            icon="ℹ️"
            onPress={() => handleEdit('À propos')}
          />
        </SectionCard>

        {/* ── Déconnexion / Suppression ── */}
        <SectionCard title="Compte">
          <ActionButton
            label="Se déconnecter"
            icon="🚪"
            onPress={handleLogout}
            variant="danger"
          />
          <View style={styles.divider} />
          <ActionButton
            label="Supprimer mon compte"
            icon="🗑️"
            onPress={handleDeleteAccount}
            variant="danger"
          />
        </SectionCard>

        {/* ── Version ── */}
        <Text style={styles.version}>AccessiWay v1.0.0</Text>

      </ScrollView>
    </ScreenLayout>
  );
};

// ═════════════════════════════════════════════
//  Styles
// ═════════════════════════════════════════════
const styles = StyleSheet.create({

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },

  // ── Hero ──
  heroSection: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.md,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
    ...Shadows.md,
  },
  avatarInitials: {
    fontSize: Typography.xxl,
    fontWeight: Typography.extrabold,
    color: Colors.primary,
    letterSpacing: 1,
  },
  avatarEditBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  avatarEditIcon: {
    fontSize: 14,
  },
  heroName: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  heroEmail: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },

  // ── Card section ──
  sectionCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  sectionSubtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },

  // ── Info row ──
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: Typography.md,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
  },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: {
    fontSize: 14,
  },

  // ── Divider ──
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 2,
  },

  // ── Badges accessibilité ──
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  badgeActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  badgeIcon: {
    fontSize: 15,
  },
  badgeLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
  badgeLabelActive: {
    color: Colors.primary,
    fontWeight: Typography.semibold,
  },

  // ── Préférence switch ──
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  prefContent: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  prefLabel: {
    fontSize: Typography.md,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  prefDescription: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },

  // ── Action button ──
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm,
  },
  actionBtnDanger: {},
  actionBtnIcon: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  actionBtnLabel: {
    flex: 1,
    fontSize: Typography.md,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
  },
  actionBtnLabelDanger: {
    color: Colors.sos,
  },
  actionBtnChevron: {
    fontSize: Typography.xl,
    color: Colors.textDisabled,
    fontWeight: Typography.bold,
  },

  // ── Version ──
  version: {
    textAlign: 'center',
    fontSize: Typography.xs,
    color: Colors.textDisabled,
    marginTop: Spacing.sm,
  },
});

export default ProfileScreen;