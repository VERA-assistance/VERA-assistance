import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
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
        id: '1',
        title: 'Ascenseur en panne – Métro Part-Dieu',
        excerpt:
            "L’ascenseur entre le quai direction Gare de Vaise et la sortie Vivier-Merle est hors service.",
        category: 'Problème',
        time: 'Il y a 5 min',
    },
    {
        id: '2',
        title: 'Trottoir impraticable – Rue Victor Hugo',
        excerpt:
            'Travaux en cours, passage très étroit, impossible en fauteuil sans aide.',
        category: 'Problème',
        time: 'Il y a 20 min',
    },
    {
        id: '3',
        title: 'Arrêt de tram T1 Partiellement accessible',
        excerpt:
            'Quai direction Debourg accessible, direction IUT Feyssine non conforme.',
        category: 'Info',
        time: 'Il y a 1 h',
    },
    {
        id: '4',
        title: 'Rampe réinstallée – Mairie Lyon 7e',
        excerpt:
            'La rampe amovible est de nouveau disponible à l’entrée principale.',
        category: 'Résolu',
        time: 'Il y a 2 h',
    },
    {
        id: '5',
        title: 'Pavés dangereux – Vieux-Lyon',
        excerpt:
            'Zone très glissante par temps de pluie, notamment rue Saint-Jean.',
        category: 'Problème',
        time: 'Hier',
    },
];

// ─── Components ───────────────────────────────────────────────────────────────

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
            <Text style={[styles.pillText, active && { color: cfg.color }]}>
                {label}
            </Text>
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
    const [posts, setPosts] = useState(INITIAL_POSTS);
    const [activeCategory, setActiveCategory] = useState('Tous');
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const scrollRef = useRef(null);

    const filteredPosts = posts.filter((p) => {
        const matchesCategory =
            activeCategory === 'Tous' || p.category === activeCategory;

        const q = searchQuery.toLowerCase();
        const matchesSearch =
            !q ||
            p.title.toLowerCase().includes(q) ||
            p.excerpt.toLowerCase().includes(q);

        return matchesCategory && matchesSearch;
    });

    const handleNewPost = (post) => {
        setPosts((prev) => [post, ...prev]);
        setActiveCategory(post.category);
        scrollRef.current?.scrollTo({ y: 0, animated: true });
    };

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

            <ScrollView ref={scrollRef} contentContainerStyle={{ padding: 22 }}>
                <View style={styles.searchBox}>
                    <TextInput
                        placeholder="Rechercher une alerte (lieu, problème...)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.searchInput}
                        clearButtonMode="while-editing"
                    />
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {CATEGORIES.map((c) => (
                        <CategoryPill
                            key={c}
                            label={c}
                            active={activeCategory === c}
                            onPress={() => setActiveCategory(c)}
                        />
                    ))}
                </ScrollView>

                {filteredPosts.map((post) => (
                    <View key={post.id} style={styles.postCard}>
                        <Text style={styles.postTitle}>{post.title}</Text>
                        <Text style={styles.postExcerpt}>{post.excerpt}</Text>
                        <Text style={styles.postMeta}>{post.time}</Text>
                    </View>
                ))}
            </ScrollView>

            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                <Text style={styles.fabLabel}>Signaler</Text>
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
    screen: { flex: 1, backgroundColor: COLORS.bg },
    searchBox: { marginBottom: 14 },
    searchInput: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
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
    pillEmoji: { marginRight: 6 },
    pillText: { fontWeight: '600' },
    postCard: {
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: 14,
        marginTop: 12,
    },
    postTitle: { fontWeight: '700' },
    postExcerpt: { color: COLORS.text.secondary },
    postMeta: { marginTop: 6, fontSize: 12, color: COLORS.text.muted },
    fab: {
        position: 'absolute',
        bottom: 40,
        right: 22,
        backgroundColor: COLORS.accent.coral,
        paddingHorizontal: 22,
        paddingVertical: 14,
        borderRadius: 50,
    },
    fabLabel: { color: '#fff', fontWeight: '700' },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        margin: 20,
        padding: 20,
        borderRadius: 16,
    },
    modalTitle: { fontWeight: '700', fontSize: 18, marginBottom: 12 },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    cancel: { color: COLORS.text.secondary },
    submit: { color: COLORS.accent.coral, fontWeight: '700' },
});