import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  FlatList,
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
    inverse: '#FFFFFF',
  },
  accent: {
    navy: '#18304A',
    blue: '#3B72F2',
    green: '#1DB87A',
    amber: '#F5A623',
    coral: '#E8533A',
    purple: '#7B5EA7',
  },
};

const CATEGORY_CONFIG = {
  Tous: {
    color: COLORS.accent.navy,
    bg: '#18304A',
    dot: null,
  },
  Question: {
    color: COLORS.accent.blue,
    bg: '#EEF3FF',
    border: '#C7D8FF',
    dot: '❓',
    leftBorder: '#3B72F2',
  },
  Conseil: {
    color: COLORS.accent.green,
    bg: '#E9FAF2',
    border: '#A3E6CA',
    dot: '💡',
    leftBorder: '#1DB87A',
  },
  Aide: {
    color: COLORS.accent.coral,
    bg: '#FEF0ED',
    border: '#F7C5BB',
    dot: '🆘',
    leftBorder: '#E8533A',
  },
  Événement: {
    color: COLORS.accent.purple,
    bg: '#F2EEFA',
    border: '#D5C4F0',
    dot: '📅',
    leftBorder: '#7B5EA7',
  },
};

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const POSTS = [
  {
    id: '0',
    pinned: true,
    category: 'Événement',
    title: 'Balade accessible — Lyon 2e',
    excerpt: 'Rejoignez-nous pour une promenade guidée 100 % PMR au cœur du vieux Lyon.',
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
    excerpt: 'J\'utilise un fauteuil électrique. L\'entrée principale est-elle accessible ?',
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
    excerpt: 'L\'entrée principale a des marches mais l\'entrée nord est totalement de plain-pied 🎉',
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
    excerpt: 'En fauteuil, je n\'arrive pas à trouver un chemin sans pavés. Des idées ?',
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
    excerpt: 'Les places réservées sont bien signalées et les ascenseurs fonctionnent. Trajet sans souci.',
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

const CATEGORIES = ['Tous', 'Question', 'Conseil', 'Aide', 'Événement'];

// ─── Sub-components ────────────────────────────────────────────────────────────

const Avatar = ({ name, size = 36 }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');
  const colors = ['#3B72F2', '#1DB87A', '#7B5EA7', '#E8533A', '#F5A623', '#18304A'];
  const colorIndex =
    name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: colors[colorIndex] },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.38 }]}>{initials}</Text>
    </View>
  );
};

const CategoryPill = ({ label, active, onPress }) => {
  const cfg = CATEGORY_CONFIG[label];
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.pill,
        active
          ? { backgroundColor: cfg.bg || COLORS.accent.navy, borderColor: 'transparent' }
          : { backgroundColor: COLORS.surface, borderColor: COLORS.border },
      ]}
    >
      {cfg.dot && (
        <Text style={styles.pillEmoji}>{cfg.dot}</Text>
      )}
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

// ─── Main Screen ───────────────────────────────────────────────────────────────

export default function CommunityScreen() {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const filtered = POSTS.filter((p) => {
    const matchesCategory = activeCategory === 'Tous' || p.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const pinned = filtered.find((p) => p.pinned);
  const feed = filtered.filter((p) => !p.pinned);

  // Header shrink animation
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Animated.View style={{ opacity: headerOpacity }}>
          <Text style={styles.headerEyebrow}>VERA · Communauté</Text>
        </Animated.View>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Ensemble{'\n'}on avance.</Text>
          <TouchableOpacity style={styles.notifButton}>
            <Text style={styles.notifIcon}>🔔</Text>
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatChip value="1 204" label="membres" />
          <View style={styles.statDivider} />
          <StatChip value="48" label="actifs aujourd'hui" />
          <View style={styles.statDivider} />
          <StatChip value="7" label="nouveaux posts" />
        </View>
      </View>

      {/* ── Search ── */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, searchFocused && styles.searchBarFocused]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher dans la communauté…"
            placeholderTextColor={COLORS.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Category Filters ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.pillsScroll}
        contentContainerStyle={styles.pillsContent}
      >
        {CATEGORIES.map((cat) => (
          <CategoryPill
            key={cat}
            label={cat}
            active={activeCategory === cat}
            onPress={() => setActiveCategory(cat)}
          />
        ))}
      </ScrollView>

      {/* ── Feed ── */}
      <Animated.ScrollView
        style={styles.feed}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {pinned && <PinnedCard post={pinned} />}

        {feed.length > 0 && (
          <Text style={styles.feedSectionLabel}>
            {activeCategory === 'Tous' ? 'Récents' : activeCategory}
            {'  '}
            <Text style={styles.feedCount}>{feed.length}</Text>
          </Text>
        )}

        {feed.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>Aucun résultat</Text>
            <Text style={styles.emptyText}>
              Essayez une autre catégorie ou modifiez votre recherche.
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* ── FAB ── */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Text style={styles.fabIcon}>＋</Text>
        <Text style={styles.fabLabel}>Publier</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 22,
    paddingBottom: 16,
    backgroundColor: COLORS.bg,
  },
  headerEyebrow: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    color: COLORS.text.muted,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.text.primary,
    letterSpacing: -0.8,
    lineHeight: 40,
  },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  notifIcon: { fontSize: 18 },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.accent.coral,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.bg,
  },
  notifBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  statChip: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text.primary,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.text.muted,
    marginTop: 2,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },

  // Search
  searchContainer: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    backgroundColor: COLORS.bg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  searchBarFocused: {
    borderColor: COLORS.accent.blue,
  },
  searchIcon: { fontSize: 15, marginRight: 10 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text.primary,
    fontWeight: '400',
    padding: 0,
  },
  clearIcon: {
    fontSize: 14,
    color: COLORS.text.muted,
    paddingLeft: 8,
  },

  // Category pills
  pillsScroll: {
    backgroundColor: COLORS.bg,
  },
  pillsContent: {
    paddingHorizontal: 22,
    paddingBottom: 12,
    gap: 8,
    flexDirection: 'row',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 50,
    borderWidth: 1.5,
    marginRight: 8,
  },
  pillEmoji: { fontSize: 12, marginRight: 5 },
  pillText: { fontSize: 13, fontWeight: '600' },

  // Feed
  feed: { flex: 1 },
  feedContent: { paddingHorizontal: 22, paddingTop: 4 },
  feedSectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text.secondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 4,
  },
  feedCount: {
    color: COLORS.text.muted,
    fontWeight: '500',
  },

  // Pinned card
  pinnedCard: {
    backgroundColor: COLORS.accent.navy,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.accent.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  pinnedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pinnedBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pinnedBadgeText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
  },
  pinnedTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  pinnedExcerpt: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 20,
    marginBottom: 14,
  },
  pinnedMeta: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  pinnedMetaText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '500',
    marginRight: 14,
  },
  pinnedFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 14,
  },
  pinnedAuthor: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 10,
  },
  attendeesBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  attendeesText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },

  // Post card
  postCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  cardAccentBar: {
    width: 4,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  cardInner: {
    flex: 1,
    padding: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryTag: {
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  verifiedBadge: {
    backgroundColor: '#E9FAF2',
    borderRadius: 50,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#A3E6CA',
    marginRight: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.accent.green,
  },
  urgentBadge: {
    backgroundColor: '#FEF0ED',
    borderRadius: 50,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#F7C5BB',
    marginRight: 4,
  },
  urgentText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.accent.coral,
  },
  postTime: {
    fontSize: 11,
    color: COLORS.text.muted,
    fontWeight: '500',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    letterSpacing: -0.2,
    marginBottom: 6,
    lineHeight: 22,
  },
  postExcerpt: {
    fontSize: 13,
    color: COLORS.text.secondary,
    lineHeight: 19,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  authorBlock: {
    flex: 1,
    marginLeft: 10,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  authorSub: {
    fontSize: 11,
    color: COLORS.text.muted,
    marginTop: 1,
    fontWeight: '500',
  },
  cardStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: { fontSize: 13 },
  statCount: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text.secondary,
  },

  // Avatar
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '800',
    letterSpacing: -0.5,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 32,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 22,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent.navy,
    borderRadius: 50,
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
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
});