import React, { useState, useRef, useCallback } from 'react';
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
  Tous: { bg: COLORS.accent.navy, color: '#fff' },
  Problème: { bg: '#FEF0ED', color: COLORS.accent.coral, dot: '🚧' },
  Info: { bg: '#EEF3FF', color: COLORS.accent.blue, dot: 'ℹ️' },
  Résolu: { bg: '#E9FAF2', color: COLORS.accent.green, dot: '✅' },
};

const CATEGORIES = ['Tous', 'Problème', 'Info', 'Résolu'];

// ─── ALERTES PMR – LYON (MOCK DATA) ────────────────────────────────────────────

const INITIAL_POSTS = [
  {
    id: '0',
    pinned: true,
    category: 'Événement',
    title: 'Balade accessible — Lyon 2e',
    excerpt:
      'Rejoignez-nous pour une promenade guidée 100 % PMR au cœur du vieux Lyon.',
    date: 'Sam. 22 mars · 14h00',
    location: 'Place Bellecour',
    author: { name: 'Asso Mobilité+', role: 'Organisateur' },
    replies: 14,
    likes: 47,
    time: "Aujourd'hui",
    verified: false,
    urgent: false,
    attendees: 14,
  },
  {
    id: '1',
    pinned: false,
    category: 'Question',
    title: 'Rampe Gare Perrache côté Est ?',
    excerpt:
      "J'utilise un fauteuil électrique. L'entrée principale est-elle accessible ?",
    date: null,
    location: 'Lyon 2e',
    author: { name: 'Sophie M.', role: '' },
    replies: 8,
    likes: 14,
    time: 'Il y a 12 min',
    verified: false,
    urgent: false,
  },
  {
    id: '2',
    pinned: false,
    category: 'Conseil',
    title: 'Musée des Beaux-Arts : entrée nord !',
    excerpt:
      "L'entrée principale a des marches mais l'entrée nord est totalement de plain-pied 🎉",
    date: null,
    location: null,
    author: { name: 'Marc T.', role: 'Contributeur actif' },
    replies: 5,
    likes: 32,
    time: 'Il y a 1h',
    verified: true,
    urgent: false,
  },
  {
    id: '3',
    pinned: false,
    category: 'Aide',
    title: 'Itinéraire Vieux-Lyon → Part-Dieu',
    excerpt:
      "En fauteuil, je n'arrive pas à trouver un chemin sans pavés. Des idées ?",
    date: null,
    location: 'Lyon 5e',
    author: { name: 'Julien R.', role: '' },
    replies: 3,
    likes: 9,
    time: 'Il y a 3h',
    verified: false,
    urgent: true,
  },
  {
    id: '4',
    pinned: false,
    category: 'Conseil',
    title: 'Parking PMR Confluence : niveaux 0 et 1',
    excerpt:
      'Les places réservées sont bien signalées et les ascenseurs fonctionnent.',
    date: null,
    location: 'Confluence',
    author: { name: 'Isabelle P.', role: 'Contributeur actif' },
    replies: 2,
    likes: 21,
    time: 'Il y a 5h',
    verified: true,
    urgent: false,
  },
  {
    id: '5',
    pinned: false,
    category: 'Question',
    title: 'Bus C3 : horaires accessibles ?',
    excerpt: 'Certains bus n\'ont pas de palette. Comment savoir à l\'avance ?',
    date: null,
    location: null,
    author: { name: 'Karim B.', role: '' },
    replies: 6,
    likes: 11,
    time: 'Hier',
    verified: false,
    urgent: false,
  },
];

const CATEGORIE = ['Tous', 'Question', 'Conseil', 'Aide', 'Événement'];
const POST_CATEGORIES = ['Question', 'Conseil', 'Aide', 'Événement'];

// ─── Sub-components ────────────────────────────────────────────────────────────

const Avatar = ({ name, size = 36 }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  const colors = [
    '#3B72F2',
    '#1DB87A',
    '#7B5EA7',
    '#E8533A',
    '#F5A623',
    '#18304A',
  ];

  const colorIndex =
    name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    colors.length;

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors[colorIndex],
        },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.38 }]}>
        {initials}
      </Text>
    </View>
  );
};

const CategoryPill = ({ label, active, onPress }) => {
  const cfg = CATEGORY_CONFIG[label];
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.pill,
        active && { backgroundColor: cfg.bg, borderColor: 'transparent' },
      ]}
    >
      {cfg.dot && <Text style={styles.pillEmoji}>{cfg.dot}</Text>}
      <Text
        style={[
          styles.pillText,
          active
            ? { color: label === 'Tous' ? '#fff' : cfg.color }
            : { color: COLORS.text.secondary },
        ]}
      >
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
  const cfg = CATEGORY_CONFIG[post.category];
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
        <Text style={styles.pinnedMetaText}>🗓 {post.date}</Text>
        <Text style={styles.pinnedMetaText}>📍 {post.location}</Text>
      </View>
      <View style={styles.pinnedFooter}>
        <Avatar name={post.author.name} size={28} />
        <Text style={styles.pinnedAuthor}>{post.author.name}</Text>
        <View style={{ flex: 1 }} />
        <View style={styles.attendeesBadge}>
          <Text style={styles.attendeesText}>+{post.attendees} participants</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const PostCard = ({ post }) => {
  const cfg = CATEGORY_CONFIG[post.category];
  return (
    <TouchableOpacity activeOpacity={0.82} style={styles.postCard}>
      {/* Accent border */}
      <View style={[styles.cardAccentBar, { backgroundColor: cfg.leftBorder }]} />

      <View style={styles.cardInner}>
        {/* Top row */}
        <View style={styles.cardTopRow}>
          <View style={[styles.categoryTag, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
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

        {/* Title */}
        <Text style={styles.postTitle} numberOfLines={2}>
          {post.title}
        </Text>

        {/* Excerpt */}
        <Text style={styles.postExcerpt} numberOfLines={2}>
          {post.excerpt}
        </Text>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <Avatar name={post.author.name} size={30} />
          <View style={styles.authorBlock}>
            <Text style={styles.authorName}>{post.author.name}</Text>
            {post.location && (
              <Text style={styles.authorSub}>📍 {post.location}</Text>
            )}
            {post.author.role ? (
              <Text style={styles.authorSub}>{post.author.role}</Text>
            ) : null}
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
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Problème');

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;

    onSubmit({
      id: Date.now().toString(),
      title,
      excerpt: content,
      category,
      time: "À l'instant",
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
          <Text style={styles.modalTitle}>Nouvelle alerte accessibilité</Text>

          <TextInput
            placeholder="Titre du problème"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <TextInput
            placeholder="Décrivez le problème rencontré"
            value={content}
            onChangeText={setContent}
            multiline
            style={[styles.input, { height: 100 }]}
          />

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CATEGORIES.filter((c) => c !== 'Tous').map((c) => (
              <CategoryPill
                key={c}
                label={c}
                active={category === c}
                onPress={() => setCategory(c)}
              />
            ))}
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={styles.submit}>Publier</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CommunityScreen() {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const filtered = posts.filter((p) => {
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
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <ScrollView contentContainerStyle={{ padding: 22 }}>
        {filtered.map((post) => (
          <View key={post.id} style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: '700' }}>{post.title}</Text>
            <Text>{post.excerpt}</Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabLabel}>Publier</Text>
      </TouchableOpacity>

      <NewPostModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleNewPost}
      />
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '800',
  },
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
  },
  pillEmoji: {
    marginRight: 6,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 22,
    backgroundColor: COLORS.accent.navy,
    paddingHorizontal: 22,
    paddingVertical: 15,
    shadowColor: COLORS.accent.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
    gap: 8,
  },
  fabIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '300',
    lineHeight: 22,
  },
  fabLabel: {
    color: '#fff',
    fontWeight: '700',
  },
});