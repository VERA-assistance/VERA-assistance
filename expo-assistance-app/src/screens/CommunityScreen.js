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
  Alert,
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
];

const CATEGORIES = ['Tous', 'Question', 'Conseil', 'Aide', 'Événement'];
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
      activeOpacity={0.75}
      style={[
        styles.pill,
        active
          ? { backgroundColor: cfg.bg || COLORS.accent.navy, borderColor: 'transparent' }
          : { backgroundColor: COLORS.surface, borderColor: COLORS.border },
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

// ─── Main Screen ───────────────────────────────────────────────────────────────

export default function CommunityScreen() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

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
    marginRight: 8,
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
    bottom: 40,
    right: 22,
    backgroundColor: COLORS.accent.navy,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 50,
  },
  fabLabel: {
    color: '#fff',
    fontWeight: '700',
  },
});