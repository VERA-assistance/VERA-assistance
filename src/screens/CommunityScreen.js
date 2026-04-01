import React, { useState, useRef } from 'react';
import ScreenLayout from '../components/ScreenLayout';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Modal,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
} from 'react-native';

// ─── Design Tokens ─────────────────────────────────────────────────────────────

const COLORS = {
  bg: '#F7F6F3',
  surface: '#FFFFFF',
  border: '#EBEBEA',
  text: {
    primary: '#1A1A18',
    secondary: '#6B6B68',
    muted: '#AEAEAD',
  },
  accent: {
    navy: '#18304A',
    blue: '#3B72F2',
    green: '#1DB87A',
    coral: '#E8533A',
    purple: '#7B5EA7',
  },
};

const CATEGORY_CONFIG = {
  Tous: { bg: COLORS.accent.navy, color: '#fff' },
  Problème: { bg: '#FEF0ED', color: COLORS.accent.coral, dot: '🚧', leftBorder: COLORS.accent.coral, border: '#FADADD' },
  Info: { bg: '#EEF3FF', color: COLORS.accent.blue, dot: 'ℹ️', leftBorder: COLORS.accent.blue, border: '#C5D5F8' },
  Résolu: { bg: '#E9FAF2', color: COLORS.accent.green, dot: '✅', leftBorder: COLORS.accent.green, border: '#A8EDD0' },
  Question: { bg: '#FFF8ED', color: '#F5A623', dot: '❓', leftBorder: '#F5A623', border: '#FFE0A0' },
  Conseil: { bg: '#F0EEFF', color: COLORS.accent.purple, dot: '💡', leftBorder: COLORS.accent.purple, border: '#D5C8F5' },
  Aide: { bg: '#FEF0ED', color: COLORS.accent.coral, dot: '🤝', leftBorder: COLORS.accent.coral, border: '#FADADD' },
  Événement: { bg: '#EEF3FF', color: COLORS.accent.blue, dot: '📅', leftBorder: COLORS.accent.blue, border: '#C5D5F8' },
};

const CATEGORIES = ['Tous', 'Problème', 'Info', 'Résolu'];
const CATEGORIE = ['Tous', 'Question', 'Conseil', 'Aide', 'Événement'];
const POST_CATEGORIES = ['Question', 'Conseil', 'Aide', 'Événement'];

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIAL_POSTS = [
  {
    id: '0',
    pinned: true,
    category: 'Événement',
    title: 'Balade accessible — Lyon 2e',
    excerpt: 'Rejoignez-nous pour une promenade guidée 100 % PMR au cœur du vieux Lyon.',
    date: 'Sam. 22 mars · 14h00',
    location: 'Place Bellecour',
    author: { name: 'Asso Mobilité+', role: 'Organisateur' },
    replies: 14, likes: 47,
    time: "Aujourd'hui",
    verified: false, urgent: false, attendees: 14,
  },
  {
    id: '1',
    pinned: false,
    category: 'Question',
    title: 'Rampe Gare Perrache côté Est ?',
    excerpt: "J'utilise un fauteuil électrique. L'entrée principale est-elle accessible ?",
    date: null, location: 'Lyon 2e',
    author: { name: 'Sophie M.', role: '' },
    replies: 8, likes: 14,
    time: 'Il y a 12 min',
    verified: false, urgent: false,
  },
  {
    id: '2',
    pinned: false,
    category: 'Conseil',
    title: 'Musée des Beaux-Arts : entrée nord !',
    excerpt: "L'entrée principale a des marches mais l'entrée nord est totalement de plain-pied 🎉",
    date: null, location: null,
    author: { name: 'Marc T.', role: 'Contributeur actif' },
    replies: 5, likes: 32,
    time: 'Il y a 1h',
    verified: true, urgent: false,
  },
  {
    id: '3',
    pinned: false,
    category: 'Aide',
    title: 'Itinéraire Vieux-Lyon → Part-Dieu',
    excerpt: "En fauteuil, je n'arrive pas à trouver un chemin sans pavés. Des idées ?",
    date: null, location: 'Lyon 5e',
    author: { name: 'Julien R.', role: '' },
    replies: 3, likes: 9,
    time: 'Il y a 3h',
    verified: false, urgent: true,
  },
  {
    id: '4',
    pinned: false,
    category: 'Conseil',
    title: 'Parking PMR Confluence : niveaux 0 et 1',
    excerpt: 'Les places réservées sont bien signalées et les ascenseurs fonctionnent.',
    date: null, location: 'Confluence',
    author: { name: 'Isabelle P.', role: 'Contributeur actif' },
    replies: 2, likes: 21,
    time: 'Il y a 5h',
    verified: true, urgent: false,
  },
  {
    id: '5',
    pinned: false,
    category: 'Question',
    title: 'Bus C3 : horaires accessibles ?',
    excerpt: "Certains bus n'ont pas de palette. Comment savoir à l'avance ?",
    date: null, location: null,
    author: { name: 'Karim B.', role: '' },
    replies: 6, likes: 11,
    time: 'Hier',
    verified: false, urgent: false,
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

const Avatar = ({ name, size = 36 }) => {
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('');
  const colors = ['#3B72F2', '#1DB87A', '#7B5EA7', '#E8533A', '#F5A623', '#18304A'];
  const colorIndex =
    name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: colors[colorIndex] }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.38 }]}>{initials}</Text>
    </View>
  );
};

const CategoryPill = ({ label, active, onPress }) => {
  const cfg = CATEGORY_CONFIG[label] ?? { bg: COLORS.accent.navy, color: '#fff' };
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.pill, active && { backgroundColor: cfg.bg, borderColor: 'transparent' }]}
    >
      {cfg.dot && <Text style={styles.pillEmoji}>{cfg.dot}</Text>}
      <Text style={[
        styles.pillText,
        active ? { color: label === 'Tous' ? '#fff' : cfg.color } : { color: COLORS.text.secondary },
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const StatChip = ({ value, label }) => (
  <View style={styles.statChip}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const PinnedCard = ({ post }) => {
  const cfg = CATEGORY_CONFIG[post.category] ?? {};
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.pinnedCard}>
      <View style={styles.pinnedHeader}>
        <View style={styles.pinnedBadge}>
          <Text style={styles.pinnedBadgeText}>📌  Épinglé</Text>
        </View>
        <View style={[styles.categoryTag, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
          <Text style={[styles.categoryTagText, { color: cfg.color }]}>
            {cfg.dot}  {post.category}
          </Text>
        </View>
      </View>
      <Text style={styles.pinnedTitle}>{post.title}</Text>
      <Text style={styles.pinnedExcerpt}>{post.excerpt}</Text>
      <View style={styles.pinnedMeta}>
        {post.date && <Text style={styles.pinnedMetaText}>🗓 {post.date}</Text>}
        {post.location && <Text style={styles.pinnedMetaText}>📍 {post.location}</Text>}
      </View>
      <View style={styles.pinnedFooter}>
        <Avatar name={post.author.name} size={28} />
        <Text style={styles.pinnedAuthor}>{post.author.name}</Text>
        <View style={{ flex: 1 }} />
        {post.attendees != null && (
          <View style={styles.attendeesBadge}>
            <Text style={styles.attendeesText}>+{post.attendees} participants</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const PostCard = ({ post }) => {
  const cfg = CATEGORY_CONFIG[post.category] ?? {};
  return (
    <TouchableOpacity activeOpacity={0.82} style={styles.postCard}>
      {/* Accent border gauche */}
      <View style={[styles.cardAccentBar, { backgroundColor: cfg.leftBorder }]} />

      <View style={styles.cardInner}>
        <View style={styles.cardTopRow}>
          <View style={[styles.categoryTag, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.categoryTagText, { color: cfg.color }]}>
              {cfg.dot}  {post.category}
            </Text>
          </View>
          <View style={styles.cardTopRight}>
            {post.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ PMR</Text>
              </View>
            )}
            {post.urgent && (
              <View style={styles.urgentBadge}>
                <Text style={styles.urgentText}>Urgent</Text>
              </View>
            )}
            <Text style={styles.postTime}>{post.time}</Text>
          </View>
        </View>

        {/* Titre */}
        <Text style={styles.postTitle} numberOfLines={2}>{post.title}</Text>

        {/* Extrait */}
        <Text style={styles.postExcerpt} numberOfLines={2}>{post.excerpt}</Text>

        <View style={styles.cardFooter}>
          <Avatar name={post.author.name} size={30} />
          <View style={styles.authorBlock}>
            <Text style={styles.authorName}>{post.author.name}</Text>
            {post.location && <Text style={styles.authorSub}>📍 {post.location}</Text>}
            {post.author.role ? <Text style={styles.authorSub}>{post.author.role}</Text> : null}
          </View>
          <View style={styles.cardStats}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>💬</Text>
              <Text style={styles.statCount}>{post.replies}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>👍</Text>
              <Text style={styles.statCount}>{post.likes}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const NewPostModal = ({ visible, onClose, onSubmit }) => {
  const [title, setTitle]       = useState('');
  const [content, setContent]   = useState('');
  const [category, setCategory] = useState('Question');

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onSubmit({
      id: Date.now().toString(),
      title, excerpt: content, category,
      time: "À l'instant",
      author: { name: 'Moi', role: '' },
      replies: 0, likes: 0,
      verified: false, urgent: false,
      pinned: false, date: null, location: null,
    });
    setTitle('');
    setContent('');
    setCategory('Problème');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Nouvelle publication</Text>

          <TextInput
            placeholder="Titre"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholderTextColor={COLORS.text.muted}
          />
          <TextInput
            placeholder="Décrivez votre situation ou conseil..."
            value={content}
            onChangeText={setContent}
            multiline
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholderTextColor={COLORS.text.muted}
          />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            {CATEGORIES.filter((c) => c !== 'Tous').map((c) => (
              <CategoryPill key={c} label={c} active={category === c} onPress={() => setCategory(c)} />
            ))}
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
              <Text style={styles.submitText}>Publier</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ─── Screen ────────────────────────────────────────────────────────────────────

export default function CommunityScreen({ onNavigate, onPressProfile }) {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleNewPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // Post épinglé séparé du reste
  const pinnedPost = posts.find((p) => p.pinned);
  const filtered = posts
    .filter((p) => !p.pinned)
    .filter((p) => {
      const matchesCategory =
        activeCategory === 'Tous' || p.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });

  return (
    <ScreenLayout
      title="Communauté"
      activeTab="community"
      onNavigate={onNavigate}
      onPressProfile={onPressProfile}
    >
      <View style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>

          {/* ── Post épinglé ── */}
          {pinnedPost && <PinnedCard post={pinnedPost} />}

          {/* ── Filtres catégories ── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.pillsRow}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {CATEGORIE.map((cat) => (
              <CategoryPill
                key={cat}
                label={cat}
                active={activeCategory === cat}
                onPress={() => setActiveCategory(cat)}
              />
            ))}
          </ScrollView>

          {/* ── Liste des posts ── */}
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>Aucun post trouvé</Text>
            </View>
          ) : (
            filtered.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </ScrollView>

        {/* ── FAB Publier ── */}
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <Text style={styles.fabIcon}>＋</Text>
          <Text style={styles.fabLabel}>Publier</Text>
        </TouchableOpacity>

        <NewPostModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={handleNewPost}
        />
      </View>
    </ScreenLayout>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  // ── Avatar ──
  avatar: { alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '800' },

  // ── Pills ──
  pillsRow: { marginBottom: 14 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: 8,
    backgroundColor: COLORS.surface,
    marginHorizontal: 16, marginTop: 12, marginBottom: 4,
    borderRadius: 12, paddingHorizontal: 14,
    borderWidth: 1, borderColor: COLORS.border,
  },
  pillEmoji: { marginRight: 6 },
  pillText: { fontSize: 13, fontWeight: '600' },

  // ── StatChip ──
  statChip: { alignItems: 'center', marginHorizontal: 8 },
  statValue: { fontSize: 16, fontWeight: '800', color: COLORS.text.primary },
  statLabel: { fontSize: 11, color: COLORS.text.muted, marginTop: 2 },

  // ── PinnedCard ──
  pinnedCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#DDE8FF',
    shadowColor: COLORS.accent.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  pinnedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pinnedBadge: {
    backgroundColor: '#EEF3FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 50,
  },
  pinnedBadgeText: { fontSize: 11, fontWeight: '700', color: COLORS.accent.blue },
  pinnedTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text.primary, marginBottom: 6 },
  pinnedExcerpt: { fontSize: 13, color: COLORS.text.secondary, lineHeight: 19, marginBottom: 10 },
  pinnedMeta: { flexDirection: 'row', gap: 14, marginBottom: 12 },
  pinnedMetaText: { fontSize: 12, color: COLORS.text.muted },
  pinnedFooter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pinnedAuthor: { fontSize: 13, fontWeight: '600', color: COLORS.text.primary },
  attendeesBadge: {
    backgroundColor: '#EEF3FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 50,
  },
  attendeesText: { fontSize: 11, fontWeight: '600', color: COLORS.accent.blue },

  // ── PostCard ──
  postCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardAccentBar: {
    width: 4,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  cardInner: { flex: 1, padding: 14 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTopRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  categoryTag: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 50, borderWidth: 1 },
  categoryTagText: { fontSize: 11, fontWeight: '700' },
  verifiedBadge: { backgroundColor: '#E9FAF2', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 50 },
  verifiedText: { fontSize: 10, fontWeight: '700', color: COLORS.accent.green },
  urgentBadge: { backgroundColor: '#FEF0ED', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 50 },
  urgentText: { fontSize: 10, fontWeight: '700', color: COLORS.accent.coral },
  postTime: { fontSize: 11, color: COLORS.text.muted },
  postTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text.primary, marginBottom: 4 },
  postExcerpt: { fontSize: 13, color: COLORS.text.secondary, lineHeight: 18, marginBottom: 10 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  authorBlock: { flex: 1, gap: 1 },
  authorName: { fontSize: 12, fontWeight: '600', color: COLORS.text.primary },
  authorSub: { fontSize: 11, color: COLORS.text.muted },
  cardStats: { flexDirection: 'row', gap: 10 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  statIcon: { fontSize: 12 },
  statCount: { fontSize: 12, fontWeight: '600', color: COLORS.text.secondary },

  // ── Empty state ──
  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 10 },
  emptyIcon: { fontSize: 32 },
  emptyText: { fontSize: 14, color: COLORS.text.muted },

  // ── FAB ──
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 22,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent.navy,
    paddingHorizontal: 22,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: COLORS.accent.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 8,
  },
  fabIcon: { fontSize: 20, color: '#fff', fontWeight: '300', lineHeight: 22 },
  fabLabel: { color: '#fff', fontWeight: '700' },

  // ── Modal ──
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 14,
  },
  modalTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text.primary, marginBottom: 4 },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: COLORS.text.primary,
    backgroundColor: COLORS.bg,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 20, marginTop: 4 },
  cancel: { fontSize: 15, color: COLORS.text.secondary, fontWeight: '600' },
  submit: { fontSize: 15, color: COLORS.accent.blue, fontWeight: '700' },
});