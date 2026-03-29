// ─────────────────────────────────────────────
//  AccessiWay — Écran Profil (avec création et édition de compte)
//
//  Gère 3 vues internes :
//    'profile'       → profil affiché (utilisateur connecté)
//    'edit'          → modifier son compte
//    'create'        → créer un compte (utilisateur non connecté)
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
  prenom: 'Pierre',
  nom: 'Martin',
  email: 'pierre.martin@email.com',
  telephone: '+33 6 12 34 56 78',
  motDePasse: '',
};

const ACCESSIBILITY_NEEDS = [
  { key: 'mobilite',  label: 'Mobilité réduite',     icon: '♿' },
  { key: 'visuelle',  label: 'Déficience visuelle',  icon: '👁️' },
  { key: 'auditive',  label: 'Déficience auditive',  icon: '👂' },
  { key: 'cognitive', label: 'Difficulté cognitive', icon: '🧠' },
  { key: 'fauteuil',  label: 'Fauteuil roulant',     icon: '🦽' },
  { key: 'canne',     label: 'Canne / béquilles',    icon: '🦯' },
];

// ─────────────────────────────────────────────
//  Composants partagés
// ─────────────────────────────────────────────

const SectionCard = ({ title, children }) => (
  <View style={styles.sectionCard}>
    {title && <Text style={styles.sectionTitle}>{title}</Text>}
    {children}
  </View>
);

const Divider = () => <View style={styles.divider} />;

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
      accessibilityLabel={label}
    />
    {error ? <Text style={styles.fieldError}>{error}</Text> : null}
  </View>
);

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

const PreferenceRow = ({ label, description, value, onToggle }) => (
  <View style={styles.prefRow}>
    <View style={styles.prefContent}>
      <Text style={styles.prefLabel}>{label}</Text>
      {description && <Text style={styles.prefDescription}>{description}</Text>}
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

const ActionButton = ({ label, icon, onPress, variant = 'default' }) => (
  <TouchableOpacity
    style={styles.actionBtn}
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

// ═════════════════════════════════════════════
//  VUE 1 — Profil (lecture)
// ═════════════════════════════════════════════
const ProfileView = ({ user, accessNeeds, preferences, onEditProfile, onTogglePref, onLogout, onNavigate, onPressProfile }) => {
  const initiales = `${user.prenom[0]}${user.nom[0]}`.toUpperCase();

  return (
    <ScreenLayout activeTab={null} onNavigate={onNavigate} onPressProfile={onPressProfile}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.heroSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>{initiales}</Text>
            </View>
          </View>
          <Text style={styles.heroName}>{user.prenom} {user.nom}</Text>
          <Text style={styles.heroEmail}>{user.email}</Text>
          <TouchableOpacity style={styles.editProfileBtn} onPress={onEditProfile} accessibilityRole="button" activeOpacity={0.85}>
            <Text style={styles.editProfileBtnText}>✏️  Modifier mon profil</Text>
          </TouchableOpacity>
        </View>

        {/* Infos personnelles */}
        <SectionCard title="Informations personnelles">
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Téléphone</Text>
            <Text style={styles.infoValue}>{user.telephone || '—'}</Text>
          </View>
          <Divider />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
        </SectionCard>

        {/* Besoins d'accessibilité */}
        <SectionCard title="Mes besoins d'accessibilité">
          <View style={styles.badgesGrid}>
            {ACCESSIBILITY_NEEDS.map((item) => (
              <AccessBadge key={item.key} item={item} active={!!accessNeeds[item.key]} onToggle={() => {}} />
            ))}
          </View>
          <TouchableOpacity style={styles.linkBtn} onPress={onEditProfile}>
            <Text style={styles.linkBtnText}>Modifier mes besoins →</Text>
          </TouchableOpacity>
        </SectionCard>

        {/* Préférences */}
        <SectionCard title="Préférences d'affichage">
          <PreferenceRow label="Grandes polices" description="Augmente la taille du texte" value={preferences.grandePolice} onToggle={() => onTogglePref('grandePolice')} />
          <Divider />
          <PreferenceRow label="Contraste élevé" description="Améliore la lisibilité" value={preferences.contrasterEleeve} onToggle={() => onTogglePref('contrasterEleeve')} />
          <Divider />
          <PreferenceRow label="Mode sombre" value={preferences.modeSombre} onToggle={() => onTogglePref('modeSombre')} />
          <Divider />
          <PreferenceRow label="Navigation vocale" description="Annonces audio" value={preferences.navigationVocale} onToggle={() => onTogglePref('navigationVocale')} />
        </SectionCard>

        {/* Notifications */}
        <SectionCard title="Notifications">
          <PreferenceRow label="Alertes d'accessibilité" description="Nouveaux signalements" value={preferences.notificationsAlertes} onToggle={() => onTogglePref('notificationsAlertes')} />
        </SectionCard>

        {/* Paramètres */}
        <SectionCard title="Paramètres">
          <ActionButton label="Langue de l'application" icon="🌐" onPress={() => {}} />
          <Divider />
          <ActionButton label="Confidentialité & données" icon="🔒" onPress={() => {}} />
          <Divider />
          <ActionButton label="Centre d'aide" icon="❓" onPress={() => {}} />
          <Divider />
          <ActionButton label="À propos d'AccessiWay" icon="ℹ️" onPress={() => {}} />
        </SectionCard>

        {/* Compte */}
        <SectionCard title="Compte">
          <ActionButton label="Se déconnecter" icon="🚪" onPress={onLogout} variant="danger" />
        </SectionCard>

        <Text style={styles.version}>AccessiWay v1.0.0</Text>
      </ScrollView>
    </ScreenLayout>
  );
};

// ═════════════════════════════════════════════
//  VUE 2 — Modifier son compte
// ═════════════════════════════════════════════
const EditProfileView = ({ user, accessNeeds, onSave, onCancel, onDeleteAccount }) => {
  const [form, setForm] = useState({ ...user, motDePasse: '', confirmMotDePasse: '' });
  const [needs, setNeeds] = useState({ ...accessNeeds });
  const [errors, setErrors] = useState({});

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));
  const toggleNeed = (key) => setNeeds((n) => ({ ...n, [key]: !n[key] }));

  const validate = () => {
    const e = {};
    if (!form.prenom.trim())  e.prenom  = 'Le prénom est requis.';
    if (!form.nom.trim())     e.nom     = 'Le nom est requis.';
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Email invalide.';
    if (form.motDePasse && form.motDePasse.length < 8) e.motDePasse = 'Minimum 8 caractères.';
    if (form.motDePasse !== form.confirmMotDePasse) e.confirmMotDePasse = 'Les mots de passe ne correspondent pas.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const { confirmMotDePasse, ...savedUser } = form;
    onSave(savedUser, needs);
  };

  const handleDelete = () => {
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
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Header interne */}
        <View style={styles.innerHeader}>
          <TouchableOpacity onPress={onCancel} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Retour">
            <Text style={styles.backBtnText}>‹ Retour</Text>
          </TouchableOpacity>
          <Text style={styles.innerTitle}>Modifier mon profil</Text>
          <View style={{ width: 70 }} />
        </View>

        {/* Infos personnelles */}
        <SectionCard title="Informations personnelles">
          <FormField label="Prénom *" value={form.prenom} onChangeText={set('prenom')} placeholder="Votre prénom" error={errors.prenom} />
          <FormField label="Nom *" value={form.nom} onChangeText={set('nom')} placeholder="Votre nom" error={errors.nom} />
          <FormField label="Email *" value={form.email} onChangeText={set('email')} placeholder="votre@email.com" keyboardType="email-address" autoCapitalize="none" error={errors.email} />
          <FormField label="Téléphone" value={form.telephone} onChangeText={set('telephone')} placeholder="+33 6 ..." keyboardType="phone-pad" autoCapitalize="none" />
        </SectionCard>

        {/* Mot de passe */}
        <SectionCard title="Mot de passe">
          <Text style={styles.sectionSubtitle}>Laissez vide pour conserver votre mot de passe actuel.</Text>
          <FormField label="Nouveau mot de passe" value={form.motDePasse} onChangeText={set('motDePasse')} placeholder="Minimum 8 caractères" secureTextEntry autoCapitalize="none" error={errors.motDePasse} />
          <FormField label="Confirmer le mot de passe" value={form.confirmMotDePasse} onChangeText={set('confirmMotDePasse')} placeholder="Répétez le mot de passe" secureTextEntry autoCapitalize="none" error={errors.confirmMotDePasse} />
        </SectionCard>

        {/* Besoins d'accessibilité */}
        <SectionCard title="Mes besoins d'accessibilité">
          <Text style={styles.sectionSubtitle}>Sélectionnez vos besoins pour personnaliser votre expérience.</Text>
          <View style={styles.badgesGrid}>
            {ACCESSIBILITY_NEEDS.map((item) => (
              <AccessBadge key={item.key} item={item} active={!!needs[item.key]} onToggle={() => toggleNeed(item.key)} />
            ))}
          </View>
        </SectionCard>

        {/* Boutons */}
        <View style={styles.formActions}>
          <TouchableOpacity style={styles.btnPrimary} onPress={handleSave} accessibilityRole="button" activeOpacity={0.85}>
            <Text style={styles.btnPrimaryText}>💾  Enregistrer les modifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSecondary} onPress={onCancel} accessibilityRole="button" activeOpacity={0.8}>
            <Text style={styles.btnSecondaryText}>Annuler</Text>
          </TouchableOpacity>
        </View>

        {/* Zone danger */}
        <SectionCard title="Zone de danger">
          <TouchableOpacity style={styles.btnDanger} onPress={handleDelete} accessibilityRole="button" activeOpacity={0.8}>
            <Text style={styles.btnDangerText}>🗑️  Supprimer mon compte</Text>
          </TouchableOpacity>
        </SectionCard>

        <Text style={styles.version}>AccessiWay v1.0.0</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ═════════════════════════════════════════════
//  VUE 3 — Créer un compte
// ═════════════════════════════════════════════
const CreateAccountView = ({ onCreated, onNavigate, onPressProfile }) => {
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', telephone: '',
    motDePasse: '', confirmMotDePasse: '',
  });
  const [needs, setNeeds] = useState({});
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // 1 = infos, 2 = besoins

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));
  const toggleNeed = (key) => setNeeds((n) => ({ ...n, [key]: !n[key] }));

  const validateStep1 = () => {
    const e = {};
    if (!form.prenom.trim())  e.prenom  = 'Le prénom est requis.';
    if (!form.nom.trim())     e.nom     = 'Le nom est requis.';
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Email invalide.';
    if (!form.motDePasse || form.motDePasse.length < 8) e.motDePasse = 'Minimum 8 caractères.';
    if (form.motDePasse !== form.confirmMotDePasse) e.confirmMotDePasse = 'Les mots de passe ne correspondent pas.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleCreate = () => {
    const { confirmMotDePasse, ...newUser } = form;
    onCreated(newUser, needs);
  };

  return (
    <ScreenLayout activeTab={null} onNavigate={onNavigate} onPressProfile={onPressProfile}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* En-tête */}
          <View style={styles.createHero}>
            <Text style={styles.createHeroIcon}>🧑‍💼</Text>
            <Text style={styles.createHeroTitle}>Créer un compte</Text>
            <Text style={styles.createHeroSubtitle}>
              Rejoignez AccessiWay pour un parcours{'\n'}adapté à vos besoins
            </Text>
            {/* Indicateur d'étape */}
            <View style={styles.stepIndicator}>
              <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]} />
              <View style={styles.stepLine} />
              <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]} />
            </View>
            <Text style={styles.stepLabel}>
              {step === 1 ? 'Étape 1 / 2 — Informations' : 'Étape 2 / 2 — Accessibilité'}
            </Text>
          </View>

          {step === 1 && (
            <>
              <SectionCard title="Informations personnelles">
                <FormField label="Prénom *" value={form.prenom} onChangeText={set('prenom')} placeholder="Votre prénom" error={errors.prenom} />
                <FormField label="Nom *" value={form.nom} onChangeText={set('nom')} placeholder="Votre nom" error={errors.nom} />
                <FormField label="Email *" value={form.email} onChangeText={set('email')} placeholder="votre@email.com" keyboardType="email-address" autoCapitalize="none" error={errors.email} />
                <FormField label="Téléphone" value={form.telephone} onChangeText={set('telephone')} placeholder="+33 6 ..." keyboardType="phone-pad" autoCapitalize="none" />
              </SectionCard>

              <SectionCard title="Mot de passe">
                <FormField label="Mot de passe *" value={form.motDePasse} onChangeText={set('motDePasse')} placeholder="Minimum 8 caractères" secureTextEntry autoCapitalize="none" error={errors.motDePasse} />
                <FormField label="Confirmer le mot de passe *" value={form.confirmMotDePasse} onChangeText={set('confirmMotDePasse')} placeholder="Répétez le mot de passe" secureTextEntry autoCapitalize="none" error={errors.confirmMotDePasse} />
              </SectionCard>

              <View style={styles.formActions}>
                <TouchableOpacity style={styles.btnPrimary} onPress={handleNext} accessibilityRole="button" activeOpacity={0.85}>
                  <Text style={styles.btnPrimaryText}>Suivant →</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === 2 && (
            <>
              <SectionCard title="Vos besoins d'accessibilité">
                <Text style={styles.sectionSubtitle}>
                  Ces informations nous permettent de vous proposer des itinéraires et contenus adaptés. Vous pouvez les modifier à tout moment.
                </Text>
                <View style={styles.badgesGrid}>
                  {ACCESSIBILITY_NEEDS.map((item) => (
                    <AccessBadge key={item.key} item={item} active={!!needs[item.key]} onToggle={() => toggleNeed(item.key)} />
                  ))}
                </View>
              </SectionCard>

              <View style={styles.formActions}>
                <TouchableOpacity style={styles.btnPrimary} onPress={handleCreate} accessibilityRole="button" activeOpacity={0.85}>
                  <Text style={styles.btnPrimaryText}>✅  Créer mon compte</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSecondary} onPress={() => setStep(1)} accessibilityRole="button" activeOpacity={0.8}>
                  <Text style={styles.btnSecondaryText}>‹ Retour</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

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
  // Simuler un utilisateur connecté (null = non connecté)
  const [user, setUser] = useState(INITIAL_USER); // mettre null pour afficher la création
  const [view, setView] = useState('profile');     // 'profile' | 'edit' | 'create'

  const [accessNeeds, setAccessNeeds] = useState({ mobilite: true, fauteuil: true });
  const [preferences, setPreferences] = useState({
    notificationsAlertes: true,
    modeSombre:           false,
    grandePolice:         false,
    contrasterEleeve:     false,
    navigationVocale:     false,
  });

  const togglePref = (key) => setPreferences((p) => ({ ...p, [key]: !p[key] }));

  const handleSaveEdit = (updatedUser, updatedNeeds) => {
    setUser(updatedUser);
    setAccessNeeds(updatedNeeds);
    setView('profile');
    Alert.alert('✅ Profil mis à jour', 'Vos informations ont bien été enregistrées.');
  };

  const handleAccountCreated = (newUser, newNeeds) => {
    setUser(newUser);
    setAccessNeeds(newNeeds);
    setView('profile');
    Alert.alert('🎉 Compte créé !', `Bienvenue, ${newUser.prenom} !`);
  };

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Déconnecter', style: 'destructive', onPress: () => setUser(null) },
    ]);
  };

  const handleDeleteAccount = () => {
    setUser(null);
    setView('create');
  };

  // ── Routeur de vues ──
  if (!user || view === 'create') {
    return (
      <CreateAccountView
        onCreated={handleAccountCreated}
        onNavigate={onNavigate}
        onPressProfile={onPressProfile}
      />
    );
  }

  if (view === 'edit') {
    return (
      <EditProfileView
        user={user}
        accessNeeds={accessNeeds}
        onSave={handleSaveEdit}
        onCancel={() => setView('profile')}
        onDeleteAccount={handleDeleteAccount}
      />
    );
  }

  return (
    <ProfileView
      user={user}
      accessNeeds={accessNeeds}
      preferences={preferences}
      onEditProfile={() => setView('edit')}
      onTogglePref={togglePref}
      onLogout={handleLogout}
      onNavigate={onNavigate}
      onPressProfile={onPressProfile}
    />
  );
};

// ═════════════════════════════════════════════
//  Styles
// ═════════════════════════════════════════════
const styles = StyleSheet.create({

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: Spacing.xxl },

  // ── Hero profil ──
  heroSection: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.md,
  },
  avatarWrapper: { marginBottom: Spacing.md },
  avatar: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: Colors.primary,
    ...Shadows.md,
  },
  avatarInitials: {
    fontSize: Typography.xxl, fontWeight: Typography.extrabold,
    color: Colors.primary, letterSpacing: 1,
  },
  heroName: { fontSize: Typography.xl, fontWeight: Typography.bold, color: Colors.textPrimary, marginBottom: 4 },
  heroEmail: { fontSize: Typography.sm, color: Colors.textSecondary, marginBottom: Spacing.md },
  editProfileBtn: {
    backgroundColor: Colors.primaryLight, borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.xs + 2,
    borderWidth: 1, borderColor: Colors.primary,
  },
  editProfileBtnText: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.primary },

  // ── Infos ──
  infoRow: { paddingVertical: Spacing.sm },
  infoLabel: { fontSize: Typography.xs, color: Colors.textSecondary, marginBottom: 2 },
  infoValue: { fontSize: Typography.md, fontWeight: Typography.medium, color: Colors.textPrimary },

  // ── Section card ──
  sectionCard: {
    backgroundColor: Colors.white, marginHorizontal: Spacing.md,
    marginBottom: Spacing.md, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: Typography.xs, fontWeight: Typography.semibold,
    color: Colors.primary, textTransform: 'uppercase',
    letterSpacing: 0.8, marginBottom: Spacing.sm,
  },
  sectionSubtitle: {
    fontSize: Typography.sm, color: Colors.textSecondary,
    lineHeight: 20, marginBottom: Spacing.sm,
  },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 2 },

  // ── Badges ──
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.xs },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: Spacing.sm + 2, paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full, borderWidth: 1.5,
    borderColor: Colors.border, backgroundColor: Colors.background,
  },
  badgeActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  badgeIcon: { fontSize: 15 },
  badgeLabel: { fontSize: Typography.xs, fontWeight: Typography.medium, color: Colors.textSecondary },
  badgeLabelActive: { color: Colors.primary, fontWeight: Typography.semibold },

  // ── Préférences ──
  prefRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm },
  prefContent: { flex: 1, paddingRight: Spacing.sm },
  prefLabel: { fontSize: Typography.md, fontWeight: Typography.medium, color: Colors.textPrimary, marginBottom: 2 },
  prefDescription: { fontSize: Typography.xs, color: Colors.textSecondary, lineHeight: 16 },

  // ── Action button ──
  actionBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm + 2, gap: Spacing.sm },
  actionBtnIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  actionBtnLabel: { flex: 1, fontSize: Typography.md, fontWeight: Typography.medium, color: Colors.textPrimary },
  actionBtnLabelDanger: { color: Colors.sos },
  actionBtnChevron: { fontSize: Typography.xl, color: Colors.textDisabled, fontWeight: Typography.bold },

  // ── Lien ──
  linkBtn: { marginTop: Spacing.sm },
  linkBtnText: { fontSize: Typography.sm, color: Colors.primary, fontWeight: Typography.medium },

  // ── Formulaire ──
  innerHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2, borderBottomWidth: 1,
    borderBottomColor: Colors.border, marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  backBtn: { paddingVertical: Spacing.xs, paddingRight: Spacing.sm },
  backBtnText: { fontSize: Typography.md, color: Colors.primary, fontWeight: Typography.medium },
  innerTitle: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textPrimary },

  fieldWrapper: { marginBottom: Spacing.sm },
  fieldLabel: { fontSize: Typography.xs, fontWeight: Typography.semibold, color: Colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  fieldInput: {
    backgroundColor: Colors.background, borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: Radius.md, paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2, fontSize: Typography.md,
    color: Colors.textPrimary,
  },
  fieldInputError: { borderColor: Colors.sos },
  fieldError: { fontSize: Typography.xs, color: Colors.sos, marginTop: 4 },

  formActions: { marginHorizontal: Spacing.md, marginBottom: Spacing.md, gap: Spacing.sm },
  btnPrimary: {
    backgroundColor: Colors.primary, borderRadius: Radius.lg,
    paddingVertical: Spacing.md, alignItems: 'center',
    ...Shadows.md,
  },
  btnPrimaryText: { fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.white },
  btnSecondary: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    paddingVertical: Spacing.sm + 4, alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.border,
  },
  btnSecondaryText: { fontSize: Typography.md, fontWeight: Typography.medium, color: Colors.textSecondary },
  btnDanger: {
    backgroundColor: Colors.sosLight, borderRadius: Radius.md,
    paddingVertical: Spacing.sm + 4, alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.sos,
  },
  btnDangerText: { fontSize: Typography.md, fontWeight: Typography.semibold, color: Colors.sos },

  // ── Création de compte ──
  createHero: {
    backgroundColor: Colors.white, alignItems: 'center',
    paddingTop: Spacing.xl, paddingBottom: Spacing.lg,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    marginBottom: Spacing.md,
  },
  createHeroIcon: { fontSize: 56, marginBottom: Spacing.sm },
  createHeroTitle: { fontSize: Typography.xxl, fontWeight: Typography.extrabold, color: Colors.textPrimary, marginBottom: 6 },
  createHeroSubtitle: { fontSize: Typography.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.lg },
  stepIndicator: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs },
  stepDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.border },
  stepDotActive: { backgroundColor: Colors.primary },
  stepLine: { width: 48, height: 2, backgroundColor: Colors.border, marginHorizontal: Spacing.xs },
  stepLabel: { fontSize: Typography.xs, color: Colors.textSecondary, fontWeight: Typography.medium },

  version: { textAlign: 'center', fontSize: Typography.xs, color: Colors.textDisabled, marginTop: Spacing.sm },
});

export default ProfileScreen;