import React, { useState, useRef } from 'react';
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

// ─── Design Tokens ────────────────────────────────────────────────────────────

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
  Tous:       { bg: COLORS.accent.navy, color: '#fff' },
  Problème:   { bg: '#FEF0ED', color: COLORS.accent.coral,  dot: '🚧' },
  Info:       { bg: '#EEF3FF', color: COLORS.accent.blue,   dot: 'ℹ️' },
  Résolu:     { bg: '#E9FAF2', color: COLORS.accent.green,  dot: '✅' },
  Question:   { bg: '#EEF3FF', color: COLORS.accent.blue,   dot: '❓' },
  Conseil:    { bg: '#E9FAF2', color: COLORS.accent.green,  dot: '💡' },
  Aide:       { bg: '#FEF0ED', color: COLORS.accent.coral,  dot: '🤝' },
  Événement:  { bg: '#F3EEFF', color: COLORS.accent.purple, dot: '📅' },
};

const CATEGORIES = ['Tous', 'Question', 'Conseil', 'Aide', 'Événement'];

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

// ─── Sub-components ───────────────────────────────────────────────────────────

const Avatar = ({ name, size = 36 }) => {
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('');
  const palette  = ['#3B72F2', '#1DB87A', '#7B5EA7', '#E8533A', '#F5A623', '#18304A'];
  const color    = palette[name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length];
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.38 }]}>{initials}</Text>
    </View>
  );
};

const CategoryPill = ({ label, active, onPress }) => {
  const cfg = CATEGORY_CONFIG[label] || CATEGORY_CONFIG['Info'];
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.pill, active && { backgroundColor: cfg.bg, borderColor: 'transparent' }]}
    >
      {cfg.dot && <Text style={styles.pillEmoji}>{cfg.dot}</Text>}
      <Text
        numberOfLines={1}
        style={[styles.pillText, active ? { color: label === 'Tous' ? '#fff' : cfg.color } : { color: COLORS.text.secondary }]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const PostCard = ({ post }) => {
  const cfg = CATEGORY_CONFIG[post.category] || CATEGORY_CONFIG['Info'];
  return (
    <TouchableOpacity activeOpacity={0.82} style={styles.postCard}>
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

        <Text style={styles.postTitle} numberOfLines={2}>{post.title}</Text>
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
      pinned: false, location: null, date: null,
    });
    setTitle(''); setContent(''); setCategory('Question');
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

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CommunityScreen() {
  const [posts, setPosts]               = useState(INITIAL_POSTS);   // ✅ fix
  const [modalVisible, setModalVisible] = useState(false);           // ✅ fix
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [searchQuery, setSearchQuery]   = useState('');

  // ✅ fix
  const handleNewPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const filtered = posts.filter((p) => {
    const matchesCategory = activeCategory === 'Tous' || p.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* ── Barre de recherche ── */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          placeholderTextColor={COLORS.text.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* ── Filtres catégories ── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {CATEGORIES.map((cat) => (
          <CategoryPill
            key={cat}
            label={cat}
            active={activeCategory === cat}
            onPress={() => setActiveCategory(cat)}
          />
        ))}
      </ScrollView>

      {/* ── Liste ── */}
      <ScrollView contentContainerStyle={styles.list}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>Aucune publication trouvée</Text>
          </View>
        ) : (
          filtered.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </ScrollView>

      {/* ── FAB ── */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)} activeOpacity={0.85}>
        <Text style={styles.fabLabel}>+ Publier</Text>
      </TouchableOpacity>

      <NewPostModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleNewPost}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },

  // ── Search ──
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16, marginTop: 12, marginBottom: 4,
    borderRadius: 12, paddingHorizontal: 14,
    borderWidth: 1, borderColor: COLORS.border,
  },
  searchIcon: { fontSize: 15, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 15, color: COLORS.text.primary },

  // ── Filtres ──
  filterRow: { paddingVertical: 10, flexGrow: 0, flexShrink: 0 },

  // ── Liste ──
  list: { padding: 16, paddingBottom: 120 },

  // ── Post card ──
  postCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardInner: { padding: 14 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  cardTopRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },

  categoryTag: { borderRadius: 50, paddingHorizontal: 10, paddingVertical: 4 },
  categoryTagText: { fontSize: 12, fontWeight: '700' },

  verifiedBadge: { backgroundColor: '#E9FAF2', borderRadius: 50, paddingHorizontal: 8, paddingVertical: 3 },
  verifiedText: { fontSize: 11, color: COLORS.accent.green, fontWeight: '700' },
  urgentBadge: { backgroundColor: '#FEF0ED', borderRadius: 50, paddingHorizontal: 8, paddingVertical: 3 },
  urgentText: { fontSize: 11, color: COLORS.accent.coral, fontWeight: '700' },

  postTime: { fontSize: 12, color: COLORS.text.muted },
  postTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text.primary, marginBottom: 4 },
  postExcerpt: { fontSize: 13, color: COLORS.text.secondary, lineHeight: 19, marginBottom: 12 },

  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '800' },
  authorBlock: { flex: 1, gap: 1 },
  authorName: { fontSize: 13, fontWeight: '600', color: COLORS.text.primary },
  authorSub: { fontSize: 11, color: COLORS.text.muted },
  cardStats: { flexDirection: 'row', gap: 12 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statIcon: { fontSize: 13 },
  statCount: { fontSize: 13, fontWeight: '600', color: COLORS.text.secondary },

  // ── Empty ──
  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 8 },
  emptyIcon: { fontSize: 36 },
  emptyText: { fontSize: 15, color: COLORS.text.muted },

  // ── FAB ──
  fab: {
    position: 'absolute', bottom: 90, right: 20,
    backgroundColor: COLORS.accent.navy,
    paddingHorizontal: 22, paddingVertical: 14,
    borderRadius: 50,
    shadowColor: COLORS.accent.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 8,
  },
  fabLabel: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // ── Pill ──
  pill: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 50, borderWidth: 1.5, borderColor: COLORS.border,
    marginRight: 8, backgroundColor: COLORS.surface,
    flexShrink: 0,       // ← empêche la compression
    alignSelf: 'center', // ← alignement vertical propre
  },
  pillEmoji: { marginRight: 4 },
  pillText: { fontSize: 13, fontWeight: '600', flexShrink: 0 },

  // ── Modal ──
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text.primary, marginBottom: 16 },
  input: {
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 10, padding: 12,
    fontSize: 15, color: COLORS.text.primary,
    marginBottom: 12, backgroundColor: COLORS.bg,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
  cancelBtn: { paddingHorizontal: 16, paddingVertical: 10 },
  cancelText: { fontSize: 15, color: COLORS.text.secondary, fontWeight: '600' },
  submitBtn: {
    backgroundColor: COLORS.accent.navy,
    borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10,
  },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});