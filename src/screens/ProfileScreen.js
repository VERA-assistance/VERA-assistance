// ─────────────────────────────────────────────
//  AccessiWay — Écran Profil
//
//  Vues internes :
//    'profile'       → profil principal (lecture)
//    'edit-infos'    → formulaire : informations personnelles
//    'edit-reglages' → formulaire : réglages de l'application
//
//  Navigation externe :
//    onNavigate('login') → déconnexion / suppression de compte
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme/theme';

// ─────────────────────────────────────────────
//  Données initiales (à remplacer par votre store/context)
// ─────────────────────────────────────────────

const INITIAL_USER = {
  prenom:    'Pierre',
  nom:       'Martin',
  email:     'pierre.martin@email.com',
  telephone: '+33 6 12 34 56 78',
};

const INITIAL_PREFS = {
  notificationsAlertes: true,
  modeSombre:           false,
  grandePolice:         false,
  contrasterEleeve:     false,
  navigationVocale:     false,
};

const INITIAL_NEEDS = { mobilite: true, fauteuil: true };

const ACCESSIBILITY_NEEDS = [
  { key: 'mobilite',  label: 'Mobilité réduite',    icon: '♿' },
  { key: 'visuelle',  label: 'Déficience visuelle',  icon: '👁️' },
  { key: 'auditive',  label: 'Déficience auditive',  icon: '👂' },
  { key: 'cognitive', label: 'Difficulté cognitive', icon: '🧠' },
  { key: 'fauteuil',  label: 'Fauteuil roulant',     icon: '🦽' },
  { key: 'canne',     label: 'Canne / béquilles',    icon: '🦯' },
];

const LANGUES = ['Français', 'English', 'Español', 'Deutsch', 'Italiano'];

// ─────────────────────────────────────────────
//  Composants UI partagés
// ─────────────────────────────────────────────

const Divider = () => <View style={styles.divider} />;

const SectionCard = ({ title, subtitle, children }) => (
  <View style={styles.sectionCard}>
    {title    && <Text style={styles.sectionTitle}>{title}</Text>}
    {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    {children}
  </View>
);

// Header interne pour les formulaires
const FormHeader = ({ title, onBack }) => (
  <View style={styles.innerHeader}>
    <TouchableOpacity onPress={onBack} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Retour">
      <Text style={styles.backBtnText}>‹ Retour</Text>
    </TouchableOpacity>
    <Text style={styles.innerTitle} numberOfLines={1}>{title}</Text>
    <View style={{ width: 70 }} />
  </View>
);

// Champ texte avec label et message d'erreur
const FormField = ({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, autoCapitalize, error }) => (
  <View style={styles.fieldWrapper}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={[styles.fieldInput, error && styles.fieldInputError]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Colors.textDisabled}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType || 'default'}
      autoCapitalize={autoCapitalize || 'sentences'}
      autoCorrect={false}
      accessibilityLabel={label}
    />
    {error ? <Text style={styles.fieldError}>{error}</Text> : null}
  </View>
);

// Ligne info (lecture)
const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || '—'}</Text>
  </View>
);

// Bouton ligne avec chevron (navigation interne ou externe)
const ActionButton = ({ label, icon, onPress, variant = 'default' }) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel={label}>
    <Text style={styles.actionBtnIcon}>{icon}</Text>
    <Text style={[styles.actionBtnLabel, variant === 'danger' && styles.actionBtnLabelDanger]}>{label}</Text>
    <Text style={styles.actionBtnChevron}>›</Text>
  </TouchableOpacity>
);

// Ligne switch
const SwitchRow = ({ label, description, value, onToggle }) => (
  <View style={styles.switchRow}>
    <View style={styles.switchContent}>
      <Text style={styles.switchLabel}>{label}</Text>
      {description && <Text style={styles.switchDescription}>{description}</Text>}
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: Colors.border, true: Colors.primaryLight }}
      thumbColor={value ? Colors.primary : Colors.textDisabled}
      accessibilityLabel={label}
    />
  </View>
);

// Badge accessibilité
const AccessBadge = ({ item, active, onToggle }) => (
  <TouchableOpacity
    style={[styles.badge, active && styles.badgeActive]}
    onPress={onToggle}
    activeOpacity={0.75}
    accessibilityRole="checkbox"
    accessibilityLabel={item.label}
    accessibilityState={{ checked: active }}
  >
    <Text style={styles.badgeIcon}>{item.icon}</Text>
    <Text style={[styles.badgeLabel, active && styles.badgeLabelActive]}>{item.label}</Text>
  </TouchableOpacity>
);

// Boutons primary / secondary / danger
const BtnPrimary   = ({ label, onPress }) => (
  <TouchableOpacity style={styles.btnPrimary} onPress={onPress} activeOpacity={0.85} accessibilityRole="button">
    <Text style={styles.btnPrimaryText}>{label}</Text>
  </TouchableOpacity>
);
const BtnSecondary = ({ label, onPress }) => (
  <TouchableOpacity style={styles.btnSecondary} onPress={onPress} activeOpacity={0.8} accessibilityRole="button">
    <Text style={styles.btnSecondaryText}>{label}</Text>
  </TouchableOpacity>
);
const BtnDanger    = ({ label, onPress }) => (
  <TouchableOpacity style={styles.btnDanger} onPress={onPress} activeOpacity={0.8} accessibilityRole="button">
    <Text style={styles.btnDangerText}>{label}</Text>
  </TouchableOpacity>
);


// ═════════════════════════════════════════════
//  VUE A — Profil principal (lecture)
// ═════════════════════════════════════════════
const ProfileView = ({ user, accessNeeds, prefs, onGoEditInfos, onGoEditReglages, onLogout, onNavigate, onPressProfile }) => {
  const initiales = `${user.prenom[0]}${user.nom[0]}`.toUpperCase();

  return (
    <ScreenLayout activeTab={null} onNavigate={onNavigate} onPressProfile={onPressProfile}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Avatar & nom ── */}
        <View style={styles.heroSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>{initiales}</Text>
          </View>
          <Text style={styles.heroName}>{user.prenom} {user.nom}</Text>
          <Text style={styles.heroEmail}>{user.email}</Text>
        </View>

        {/* ── Informations personnelles ── */}
        <SectionCard title="Informations personnelles">
          <InfoRow label="Prénom"    value={user.prenom} />
          <Divider />
          <InfoRow label="Nom"       value={user.nom} />
          <Divider />
          <InfoRow label="Email"     value={user.email} />
          <Divider />
          <InfoRow label="Téléphone" value={user.telephone} />
          <TouchableOpacity style={styles.editLink} onPress={onGoEditInfos} accessibilityRole="button">
            <Text style={styles.editLinkText}>✏️  Modifier mes informations</Text>
          </TouchableOpacity>
        </SectionCard>

        {/* ── Besoins d'accessibilité (résumé) ── */}
        <SectionCard title="Mes besoins d'accessibilité">
          <View style={styles.badgesGrid}>
            {ACCESSIBILITY_NEEDS.map((item) => (
              <AccessBadge key={item.key} item={item} active={!!accessNeeds[item.key]} onToggle={() => {}} />
            ))}
          </View>
          <TouchableOpacity style={styles.editLink} onPress={onGoEditInfos} accessibilityRole="button">
            <Text style={styles.editLinkText}>✏️  Modifier mes besoins</Text>
          </TouchableOpacity>
        </SectionCard>

        {/* ── Réglages (résumé) ── */}
        <SectionCard title="Réglages de l'application">
          <SwitchRow label="Grandes polices"        value={prefs.grandePolice}        onToggle={() => {}} />
          <Divider />
          <SwitchRow label="Contraste élevé"        value={prefs.contrasterEleeve}    onToggle={() => {}} />
          <Divider />
          <SwitchRow label="Mode sombre"            value={prefs.modeSombre}          onToggle={() => {}} />
          <Divider />
          <SwitchRow label="Navigation vocale"      value={prefs.navigationVocale}    onToggle={() => {}} />
          <Divider />
          <SwitchRow label="Alertes d'accessibilité" value={prefs.notificationsAlertes} onToggle={() => {}} />
          <TouchableOpacity style={styles.editLink} onPress={onGoEditReglages} accessibilityRole="button">
            <Text style={styles.editLinkText}>⚙️  Gérer les réglages</Text>
          </TouchableOpacity>
        </SectionCard>

        {/* ── Paramètres ── */}
        <SectionCard title="Paramètres">
          <ActionButton label="Langue de l'application"  icon="🌐" onPress={() => {}} />
          <Divider />
          <ActionButton label="Confidentialité & données" icon="🔒" onPress={() => {}} />
          <Divider />
          <ActionButton label="Centre d'aide"            icon="❓" onPress={() => {}} />
          <Divider />
          <ActionButton label="À propos d'AccessiWay"   icon="ℹ️" onPress={() => {}} />
        </SectionCard>

        {/* ── Compte ── */}
        <SectionCard title="Compte">
          <ActionButton label="Se déconnecter" icon="🚪" onPress={onLogout} variant="danger" />
        </SectionCard>

        <Text style={styles.version}>AccessiWay v1.0.0</Text>
      </ScrollView>
    </ScreenLayout>
  );
};


// ═════════════════════════════════════════════
//  VUE B — Formulaire : Informations personnelles
// ═════════════════════════════════════════════
const EditInfosView = ({ user, accessNeeds, onSave, onCancel, onDeleteAccount, onNavigate, onPressProfile }) => {
  const [form, setForm] = useState({
    ...user,
    motDePasse:       '',
    confirmMotDePasse: '',
  });
  const [needs, setNeeds]   = useState({ ...accessNeeds });
  const [errors, setErrors] = useState({});

  const set        = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));
  const toggleNeed = (key) => setNeeds((n) => ({ ...n, [key]: !n[key] }));

  const validate = () => {
    const e = {};
    if (!form.prenom.trim()) e.prenom = 'Le prénom est requis.';
    if (!form.nom.trim())    e.nom    = 'Le nom est requis.';
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Adresse email invalide.';
    if (form.motDePasse && form.motDePasse.length < 8) e.motDePasse = 'Minimum 8 caractères.';
    if (form.motDePasse !== form.confirmMotDePasse)    e.confirmMotDePasse = 'Les mots de passe ne correspondent pas.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const { confirmMotDePasse, ...savedUser } = form;
    onSave(savedUser, needs);
  };

  const handleDeletePress = () => {
    Alert.alert(
      'Supprimer le compte',
      'Cette action est irréversible. Toutes vos données seront effacées.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: onDeleteAccount },
      ]
    );
  };

  return (
    <ScreenLayout activeTab={null} onNavigate={onNavigate} onPressProfile={onPressProfile}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <FormHeader title="Informations personnelles" onBack={onCancel} />

          {/* ── Identité ── */}
          <SectionCard title="Identité">
            <FormField
              label="Prénom *"
              value={form.prenom}
              onChangeText={set('prenom')}
              placeholder="Votre prénom"
              error={errors.prenom}
            />
            <FormField
              label="Nom *"
              value={form.nom}
              onChangeText={set('nom')}
              placeholder="Votre nom"
              error={errors.nom}
            />
          </SectionCard>

          {/* ── Coordonnées ── */}
          <SectionCard title="Coordonnées">
            <FormField
              label="Adresse email *"
              value={form.email}
              onChangeText={set('email')}
              placeholder="votre@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            <FormField
              label="Téléphone"
              value={form.telephone}
              onChangeText={set('telephone')}
              placeholder="+33 6 ..."
              keyboardType="phone-pad"
              autoCapitalize="none"
            />
          </SectionCard>

          {/* ── Mot de passe ── */}
          <SectionCard
            title="Mot de passe"
            subtitle="Laissez vide pour conserver votre mot de passe actuel."
          >
            <FormField
              label="Nouveau mot de passe"
              value={form.motDePasse}
              onChangeText={set('motDePasse')}
              placeholder="Minimum 8 caractères"
              secureTextEntry
              autoCapitalize="none"
              error={errors.motDePasse}
            />
            <FormField
              label="Confirmer le mot de passe"
              value={form.confirmMotDePasse}
              onChangeText={set('confirmMotDePasse')}
              placeholder="Répétez le mot de passe"
              secureTextEntry
              autoCapitalize="none"
              error={errors.confirmMotDePasse}
            />
          </SectionCard>

          {/* ── Besoins d'accessibilité ── */}
          <SectionCard
            title="Besoins d'accessibilité"
            subtitle="Sélectionnez vos besoins pour personnaliser votre expérience et vos itinéraires."
          >
            <View style={styles.badgesGrid}>
              {ACCESSIBILITY_NEEDS.map((item) => (
                <AccessBadge
                  key={item.key}
                  item={item}
                  active={!!needs[item.key]}
                  onToggle={() => toggleNeed(item.key)}
                />
              ))}
            </View>
          </SectionCard>

          {/* ── Actions ── */}
          <View style={styles.formActions}>
            <BtnPrimary   label="💾  Enregistrer les modifications" onPress={handleSave} />
            <BtnSecondary label="Annuler"                           onPress={onCancel} />
          </View>

          {/* ── Zone de danger ── */}
          <SectionCard title="Zone de danger">
            <BtnDanger label="🗑️  Supprimer mon compte" onPress={handleDeletePress} />
          </SectionCard>

          <Text style={styles.version}>AccessiWay v1.0.0</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
};


// ═════════════════════════════════════════════
//  VUE C — Formulaire : Réglages de l'application
// ═════════════════════════════════════════════
const EditReglagesView = ({ prefs, onSave, onCancel, onNavigate, onPressProfile }) => {
  const [form, setForm]       = useState({ ...prefs });
  const [langue, setLangue]   = useState('Français');
  const [showLangPicker, setShowLangPicker] = useState(false);

  const toggle = (key) => setForm((f) => ({ ...f, [key]: !f[key] }));

  const handleSave = () => {
    onSave(form);
    Alert.alert('✅ Réglages enregistrés', 'Vos préférences ont bien été mises à jour.');
  };

  return (
    <ScreenLayout activeTab={null} onNavigate={onNavigate} onPressProfile={onPressProfile}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <FormHeader title="Réglages de l'application" onBack={onCancel} />

          {/* ── Affichage ── */}
          <SectionCard title="Affichage & accessibilité">
            <SwitchRow
              label="Grandes polices"
              description="Augmente la taille du texte dans toute l'app"
              value={form.grandePolice}
              onToggle={() => toggle('grandePolice')}
            />
            <Divider />
            <SwitchRow
              label="Contraste élevé"
              description="Améliore la lisibilité sur fond clair"
              value={form.contrasterEleeve}
              onToggle={() => toggle('contrasterEleeve')}
            />
            <Divider />
            <SwitchRow
              label="Mode sombre"
              value={form.modeSombre}
              onToggle={() => toggle('modeSombre')}
            />
            <Divider />
            <SwitchRow
              label="Navigation vocale"
              description="Annonces audio pendant la navigation"
              value={form.navigationVocale}
              onToggle={() => toggle('navigationVocale')}
            />
          </SectionCard>

          {/* ── Notifications ── */}
          <SectionCard title="Notifications">
            <SwitchRow
              label="Alertes d'accessibilité"
              description="Soyez notifié des nouveaux signalements près de vous"
              value={form.notificationsAlertes}
              onToggle={() => toggle('notificationsAlertes')}
            />
          </SectionCard>

          {/* ── Langue ── */}
          <SectionCard title="Langue de l'application">
            <TouchableOpacity
              style={styles.langueSelector}
              onPress={() => setShowLangPicker((v) => !v)}
              accessibilityRole="button"
              accessibilityLabel="Choisir la langue"
            >
              <Text style={styles.langueSelectorLabel}>🌐  {langue}</Text>
              <Text style={styles.langueSelectorChevron}>{showLangPicker ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {showLangPicker && (
              <View style={styles.langueList}>
                {LANGUES.map((l) => (
                  <TouchableOpacity
                    key={l}
                    style={[styles.langueItem, langue === l && styles.langueItemActive]}
                    onPress={() => { setLangue(l); setShowLangPicker(false); }}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: langue === l }}
                  >
                    <Text style={[styles.langueItemText, langue === l && styles.langueItemTextActive]}>
                      {l}
                    </Text>
                    {langue === l && <Text style={styles.langueCheckmark}>✓</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </SectionCard>

          {/* ── Confidentialité ── */}
          <SectionCard title="Confidentialité & données">
            <ActionButton label="Politique de confidentialité" icon="📄" onPress={() => {}} />
            <Divider />
            <ActionButton label="Gérer mes données"            icon="🗂️" onPress={() => {}} />
            <Divider />
            <ActionButton label="À propos d'AccessiWay"       icon="ℹ️" onPress={() => {}} />
          </SectionCard>

          {/* ── Actions ── */}
          <View style={styles.formActions}>
            <BtnPrimary   label="💾  Enregistrer les réglages" onPress={handleSave} />
            <BtnSecondary label="Annuler"                       onPress={onCancel} />
          </View>

          <Text style={styles.version}>AccessiWay v1.0.0</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
};


// ═════════════════════════════════════════════
//  COMPOSANT PRINCIPAL — ProfileScreen
// ═════════════════════════════════════════════
const ProfileScreen = ({ onNavigate, onPressProfile }) => {
  // Vues : 'profile' | 'edit-infos' | 'edit-reglages'
  const [view, setView] = useState('profile');

  const [user,        setUser]        = useState(INITIAL_USER);
  const [accessNeeds, setAccessNeeds] = useState(INITIAL_NEEDS);
  const [prefs,       setPrefs]       = useState(INITIAL_PREFS);

  // ── Sauvegarde infos personnelles
  const handleSaveInfos = (updatedUser, updatedNeeds) => {
    setUser(updatedUser);
    setAccessNeeds(updatedNeeds);
    setView('profile');
    Alert.alert('✅ Profil mis à jour', 'Vos informations ont bien été enregistrées.');
  };

  // ── Sauvegarde réglages
  const handleSaveReglages = (updatedPrefs) => {
    setPrefs(updatedPrefs);
    setView('profile');
  };

  // ── Déconnexion → page de connexion
  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: () => onNavigate('login'), // ← redirection vers LoginScreen
        },
      ]
    );
  };

  // ── Suppression de compte → page de connexion
  const handleDeleteAccount = () => {
    onNavigate('login'); // ← redirection vers LoginScreen
  };

  const sharedNav = { onNavigate, onPressProfile };

  // ── Routeur de vues ──
  if (view === 'edit-infos') {
    return (
      <EditInfosView
        user={user}
        accessNeeds={accessNeeds}
        onSave={handleSaveInfos}
        onCancel={() => setView('profile')}
        onDeleteAccount={handleDeleteAccount}
        {...sharedNav}
      />
    );
  }

  if (view === 'edit-reglages') {
    return (
      <EditReglagesView
        prefs={prefs}
        onSave={handleSaveReglages}
        onCancel={() => setView('profile')}
        {...sharedNav}
      />
    );
  }

  return (
    <ProfileView
      user={user}
      accessNeeds={accessNeeds}
      prefs={prefs}
      onGoEditInfos={() => setView('edit-infos')}
      onGoEditReglages={() => setView('edit-reglages')}
      onLogout={handleLogout}
      {...sharedNav}
    />
  );
};


// ═════════════════════════════════════════════
//  Styles
// ═════════════════════════════════════════════
const styles = StyleSheet.create({

  scroll:        { flex: 1 },
  scrollContent: { paddingBottom: Spacing.xxl },

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
  avatar: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: Colors.primary,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  avatarInitials: {
    fontSize: Typography.xxl, fontWeight: Typography.extrabold,
    color: Colors.primary, letterSpacing: 1,
  },
  heroName:  { fontSize: Typography.xl, fontWeight: Typography.bold, color: Colors.textPrimary, marginBottom: 4 },
  heroEmail: { fontSize: Typography.sm, color: Colors.textSecondary },

  // ── Section card ──
  sectionCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md, marginBottom: Spacing.md,
    borderRadius: Radius.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: Typography.xs, fontWeight: Typography.semibold,
    color: Colors.primary, textTransform: 'uppercase',
    letterSpacing: 0.8, marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: Typography.sm, color: Colors.textSecondary,
    lineHeight: 20, marginBottom: Spacing.sm,
  },

  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 2 },

  // ── Info row (lecture) ──
  infoRow: { paddingVertical: Spacing.sm },
  infoLabel: { fontSize: Typography.xs, color: Colors.textSecondary, marginBottom: 2 },
  infoValue: { fontSize: Typography.md, fontWeight: Typography.medium, color: Colors.textPrimary },

  // ── Lien édition ──
  editLink: { marginTop: Spacing.md, alignSelf: 'flex-start' },
  editLinkText: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.primary },

  // ── Action button ──
  actionBtn:              { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm + 2, gap: Spacing.sm },
  actionBtnIcon:          { fontSize: 20, width: 28, textAlign: 'center' },
  actionBtnLabel:         { flex: 1, fontSize: Typography.md, fontWeight: Typography.medium, color: Colors.textPrimary },
  actionBtnLabelDanger:   { color: Colors.sos },
  actionBtnChevron:       { fontSize: Typography.xl, color: Colors.textDisabled, fontWeight: Typography.bold },

  // ── Switch row ──
  switchRow:        { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm },
  switchContent:    { flex: 1, paddingRight: Spacing.sm },
  switchLabel:      { fontSize: Typography.md, fontWeight: Typography.medium, color: Colors.textPrimary, marginBottom: 2 },
  switchDescription:{ fontSize: Typography.xs, color: Colors.textSecondary, lineHeight: 16 },

  // ── Badges ──
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.xs },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: Spacing.sm + 2, paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full, borderWidth: 1.5,
    borderColor: Colors.border, backgroundColor: Colors.background,
  },
  badgeActive:      { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  badgeIcon:        { fontSize: 15 },
  badgeLabel:       { fontSize: Typography.xs, fontWeight: Typography.medium, color: Colors.textSecondary },
  badgeLabelActive: { color: Colors.primary, fontWeight: Typography.semibold },

  // ── Inner header (formulaires) ──
  innerHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    marginBottom: Spacing.md, ...Shadows.sm,
  },
  backBtn:     { paddingVertical: Spacing.xs, paddingRight: Spacing.sm },
  backBtnText: { fontSize: Typography.md, color: Colors.primary, fontWeight: Typography.medium },
  innerTitle:  { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textPrimary, flex: 1, textAlign: 'center' },

  // ── Champs formulaire ──
  fieldWrapper: { marginBottom: Spacing.sm },
  fieldLabel: {
    fontSize: Typography.xs, fontWeight: Typography.semibold,
    color: Colors.textSecondary, marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  fieldInput: {
    backgroundColor: Colors.background, borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: Radius.md, paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2, fontSize: Typography.md, color: Colors.textPrimary,
  },
  fieldInputError: { borderColor: Colors.sos },
  fieldError:      { fontSize: Typography.xs, color: Colors.sos, marginTop: 4 },

  // ── Sélecteur de langue ──
  langueSelector: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.background, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2,
  },
  langueSelectorLabel:   { fontSize: Typography.md, color: Colors.textPrimary, fontWeight: Typography.medium },
  langueSelectorChevron: { fontSize: Typography.sm, color: Colors.textSecondary },
  langueList: {
    marginTop: Spacing.xs, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  langueItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2,
    backgroundColor: Colors.white,
  },
  langueItemActive:    { backgroundColor: Colors.primaryLight },
  langueItemText:      { fontSize: Typography.md, color: Colors.textPrimary },
  langueItemTextActive:{ color: Colors.primary, fontWeight: Typography.semibold },
  langueCheckmark:     { fontSize: Typography.md, color: Colors.primary, fontWeight: Typography.bold },

  // ── Boutons d'action ──
  formActions: { marginHorizontal: Spacing.md, marginBottom: Spacing.md, gap: Spacing.sm },
  btnPrimary: {
    backgroundColor: Colors.primary, borderRadius: Radius.lg,
    paddingVertical: Spacing.md, alignItems: 'center', ...Shadows.md,
  },
  btnPrimaryText: { fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.white },
  btnSecondary: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    paddingVertical: Spacing.md, alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.border,
  },
  btnSecondaryText: { fontSize: Typography.md, fontWeight: Typography.medium, color: Colors.textSecondary },
  btnDanger: {
    backgroundColor: Colors.sosLight, borderRadius: Radius.md,
    paddingVertical: Spacing.md, alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.sos,
  },
  btnDangerText: { fontSize: Typography.md, fontWeight: Typography.semibold, color: Colors.sos },

  version: { textAlign: 'center', fontSize: Typography.xs, color: Colors.textDisabled, marginTop: Spacing.sm },
});

export default ProfileScreen;
