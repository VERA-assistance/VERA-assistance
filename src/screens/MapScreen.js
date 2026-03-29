// ─────────────────────────────────────────────
//  AccessiWay — Écran Carte (Map)
//
//  Collaborateur responsable : [Nom]
//  Description : Carte principale de navigation
//                accessible (type Waze / VERA)
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  SafeAreaView,
} from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import { Colors, Typography, Spacing } from '../theme/theme';

// ─── Données mockées ──────────────────────────────────────────────────────────

const FILTERS = ['Public Transport', 'Restaurants & Venues', 'Nearby'];

const CATEGORIES = ['Nearby', 'Restaurants', 'Lieux', 'Visites'];

const TRANSPORT_STOP = {
  name: 'Debourg – Metro Ligne B',
  score: 70,
  scoreLabel: 'Bonne fiabilité',
  scoreColor: '#ca8a04',
  reports: 9,
  updated: 'il y a 8 min',
  features: [
    { icon: '🛗', label: 'Ascenseur',        status: 'EN SERVICE',    statusColor: '#16a34a', statusIcon: '✅' },
    { icon: '↗️', label: 'Escalateur',       status: 'HORS SERVICE',  statusColor: '#dc2626', statusIcon: '❌' },
    { icon: '⚠️', label: 'Accès de plain-pied', status: 'LIMITÉ',     statusColor: '#ca8a04', statusIcon: '⚠️' },
  ],
};

const PLACES = [
  {
    id: 1,
    name: 'Le Saint Laurent',
    type: 'Pizzeria',
    stars: 3.5,
    score: 91,
    scoreColor: '#16a34a',
    category: 'Restaurants',
    img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=80&h=80&fit=crop',
    features: [
      { label: 'Rampe',              status: 'ok' },
      { label: 'Toilettes accessibles', status: 'ok' },
    ],
  },
  {
    id: 2,
    name: 'Sipres',
    type: 'Cuisine française · 1 étoile Michelin',
    stars: 3,
    score: 100,
    scoreColor: '#16a34a',
    category: 'Restaurants',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=80&h=80&fit=crop',
    features: [
      { label: 'Rampe',              status: 'ok' },
      { label: 'Toilettes accessibles', status: 'ok' },
    ],
  },
  {
    id: 3,
    name: 'Tram 33',
    type: 'Bar à cocktails',
    stars: 1.5,
    score: 58,
    scoreColor: '#dc2626',
    category: 'Restaurants',
    img: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=80&h=80&fit=crop',
    features: [
      { label: 'Rampe',                  status: 'ok' },
      { label: 'Toilettes au 2ème étage', status: 'warning' },
    ],
  },
  {
    id: 4,
    name: "La Table d'Ambre",
    type: 'Cuisine française',
    stars: 4,
    score: 77,
    scoreColor: '#ca8a04',
    category: 'Restaurants',
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=80&h=80&fit=crop',
    features: [
      { label: 'Rampe',              status: 'error' },
      { label: 'Toilettes accessibles', status: 'ok' },
    ],
  },
  {
    id: 5,
    name: 'Anahera',
    type: 'Coffee Shop',
    stars: 5,
    score: 64,
    scoreColor: '#ca8a04',
    category: 'Restaurants',
    img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=80&h=80&fit=crop',
    features: [
      { label: 'Rampe',              status: 'ok' },
      { label: '3 marches vers WC', status: 'warning' },
    ],
  },
  {
    id: 6,
    name: 'Musée des Confluences',
    type: 'Musée',
    stars: 4.5,
    score: 88,
    scoreColor: '#16a34a',
    category: 'Visites',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop',
    features: [
      { label: 'Rampe',              status: 'ok' },
      { label: 'Toilettes accessibles', status: 'ok' },
    ],
  },
  {
    id: 7,
    name: 'Opéra de Lyon',
    type: 'Opéra',
    stars: 4,
    score: 72,
    scoreColor: '#ca8a04',
    category: 'Lieux',
    img: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=80&h=80&fit=crop',
    features: [
      { label: 'Rampe',                      status: 'ok' },
      { label: 'Places fauteuil limitées',   status: 'warning' },
    ],
  },
  {
    id: 8,
    name: "Parc de la Tête d'Or",
    type: 'Parc',
    stars: 4.5,
    score: 95,
    scoreColor: '#16a34a',
    category: 'Nearby',
    img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=80&h=80&fit=crop',
    features: [
      { label: 'Allées accessibles',    status: 'ok' },
      { label: 'Toilettes accessibles', status: 'ok' },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFeatureColor(status) {
  if (status === 'ok')      return '#16a34a';
  if (status === 'warning') return '#ca8a04';
  return '#dc2626';
}

function getFeatureIcon(status) {
  if (status === 'ok')      return '✓';
  if (status === 'warning') return '⚠';
  return '✗';
}

function renderStars(count) {
  return Array.from({ length: 5 }, (_, i) => {
    const full = i < Math.floor(count);
    const half = !full && i < count;
    return React.createElement(
      Text,
      { key: i, style: { color: '#f59e0b', opacity: full ? 1 : half ? 0.6 : 0.2, fontSize: 11 } },
      '★'
    );
  });
}

// ─── Composant : carte simulée ────────────────────────────────────────────────

function MockMap() {
  const pins = [
    { left: '8%',  top: '38%', score: 81,  color: '#16a34a' },
    { left: '38%', top: '22%', score: 70,  color: '#ca8a04' },
    { left: '65%', top: '18%', score: 94,  color: '#16a34a' },
    { left: '25%', top: '55%', score: 88,  color: '#16a34a' },
    { left: '55%', top: '50%', score: 58,  color: '#dc2626' },
    { left: '75%', top: '44%', score: 77,  color: '#ca8a04' },
    { left: '48%', top: '32%', score: 100, color: '#16a34a' },
  ];

  return React.createElement(
    View,
    { style: styles.mapContainer },

    // Fond dégradé simulant une carte
    React.createElement(View, { style: styles.mapBg }),

    // Rivière
    React.createElement(View, { style: styles.mapRiver }),

    // Blocs de quartiers
    React.createElement(View, { style: [styles.mapBlock, { top: '8%',  left: '4%',  width: '24%', height: '24%' }] }),
    React.createElement(View, { style: [styles.mapBlock, { top: '8%',  left: '36%', width: '18%', height: '18%', backgroundColor: '#fefce8' }] }),
    React.createElement(View, { style: [styles.mapBlock, { top: '60%', left: '38%', width: '26%', height: '22%', backgroundColor: '#eff6ff' }] }),

    // Lignes de rues
    React.createElement(View, { style: styles.mapStreetH1 }),
    React.createElement(View, { style: styles.mapStreetH2 }),
    React.createElement(View, { style: styles.mapStreetV1 }),
    React.createElement(View, { style: styles.mapStreetV2 }),

    // Pins de score
    ...pins.map((p, i) =>
      React.createElement(
        View,
        { key: i, style: [styles.mapPin, { left: p.left, top: p.top, backgroundColor: p.color }] },
        React.createElement(Text, { style: styles.mapPinText }, p.score)
      )
    ),

    // Station métro
    React.createElement(
      View,
      { style: [styles.mapMetroPin, { left: '36%', top: '42%' }] },
      React.createElement(Text, { style: styles.mapMetroText }, 'M')
    ),

    // Position utilisateur
    React.createElement(View, { style: styles.mapUserDot }),
    React.createElement(View, { style: styles.mapUserPulse })
  );
}

// ─── Composant : score badge ──────────────────────────────────────────────────

function ScoreBadge(props) {
  return React.createElement(
    View,
    { style: [styles.scoreBadge, { backgroundColor: props.color, width: props.size || 40, height: props.size || 40, borderRadius: (props.size || 40) / 2 }] },
    React.createElement(Text, { style: [styles.scoreBadgeText, { fontSize: props.size > 40 ? 16 : 13 }] }, props.score)
  );
}

// ─── Composant : ligne de lieu ────────────────────────────────────────────────

function PlaceRow(props) {
  return React.createElement(
    TouchableOpacity,
    { style: styles.placeRow, onPress: () => props.onPress(props.place), activeOpacity: 0.7 },

    React.createElement(Image, {
      source: { uri: props.place.img },
      style: styles.placeImg,
    }),

    React.createElement(
      View,
      { style: styles.placeInfo },
      React.createElement(
        View,
        { style: styles.placeNameRow },
        React.createElement(Text, { style: styles.placeName, numberOfLines: 1 }, props.place.name),
        React.createElement(View, { style: { flexDirection: 'row' } }, renderStars(props.place.stars))
      ),
      React.createElement(Text, { style: styles.placeType, numberOfLines: 1 }, props.place.type),
      React.createElement(
        View,
        { style: styles.placeFeatures },
        props.place.features.map((f, i) =>
          React.createElement(
            Text,
            { key: i, style: [styles.placeFeatureText, { color: getFeatureColor(f.status) }] },
            getFeatureIcon(f.status) + ' ' + f.label
          )
        )
      )
    ),

    React.createElement(ScoreBadge, { score: props.place.score, color: props.place.scoreColor, size: 38 })
  );
}

// ─── Composant : carte transport ─────────────────────────────────────────────

function TransportCard() {
  const stop = TRANSPORT_STOP;
  return React.createElement(
    View,
    { style: styles.transportCard },

    // Header score
    React.createElement(
      View,
      { style: styles.transportHeader },
      React.createElement(
        View,
        { style: { flex: 1 } },
        React.createElement(Text, { style: styles.transportName }, stop.name),
        React.createElement(
          Text,
          { style: styles.transportReports },
          stop.reports + ' rapports vérifiés · Mis à jour ' + stop.updated
        )
      ),
      React.createElement(
        View,
        { style: { alignItems: 'flex-end' } },
        React.createElement(Text, { style: styles.transportScoreLabel }, 'Score fiabilité'),
        React.createElement(
          View,
          { style: { flexDirection: 'row', alignItems: 'center', gap: 4 } },
          React.createElement(Text, { style: [styles.transportScore, { color: stop.scoreColor }] }, stop.score),
          React.createElement(Text, { style: [styles.transportScoreSub, { color: stop.scoreColor }] }, '(' + stop.scoreLabel + ')')
        )
      )
    ),

    // Features
    stop.features.map((f, i) =>
      React.createElement(
        View,
        { key: i, style: styles.transportFeatureRow },
        React.createElement(
          View,
          { style: { flexDirection: 'row', alignItems: 'center', gap: 8 } },
          React.createElement(Text, { style: { fontSize: 18 } }, f.icon),
          React.createElement(Text, { style: styles.transportFeatureLabel }, f.label)
        ),
        React.createElement(
          Text,
          { style: [styles.transportFeatureStatus, { color: f.statusColor }] },
          f.statusIcon + ' ' + f.status
        )
      )
    ),

    // Boutons
    React.createElement(
      View,
      { style: styles.transportButtons },
      React.createElement(
        TouchableOpacity,
        { style: styles.btnConfirm, activeOpacity: 0.8 },
        React.createElement(Text, { style: styles.btnConfirmText }, '✓ Confirmer le statut')
      ),
      React.createElement(
        TouchableOpacity,
        { style: styles.btnReport, activeOpacity: 0.8 },
        React.createElement(Text, { style: styles.btnReportText }, 'Signaler un problème')
      )
    ),
    React.createElement(
      TouchableOpacity,
      { style: styles.btnSeeReports, activeOpacity: 0.8 },
      React.createElement(Text, { style: styles.btnSeeReportsText }, 'Voir les rapports vérifiés')
    )
  );
}

// ─── Composant : modal de détail ─────────────────────────────────────────────

function PlaceModal(props) {
  if (!props.place) return null;
  const p = props.place;

  return React.createElement(
    Modal,
    { visible: true, transparent: true, animationType: 'slide', onRequestClose: props.onClose },
    React.createElement(
      TouchableOpacity,
      { style: styles.modalOverlay, activeOpacity: 1, onPress: props.onClose },
      React.createElement(
        View,
        { style: styles.modalSheet },
        React.createElement(View, { style: styles.modalHandle }),
        React.createElement(Image, { source: { uri: p.img }, style: styles.modalImg }),
        React.createElement(
          View,
          { style: styles.modalHeaderRow },
          React.createElement(
            View,
            { style: { flex: 1 } },
            React.createElement(Text, { style: styles.modalName }, p.name),
            React.createElement(Text, { style: styles.modalType }, p.type),
            React.createElement(View, { style: { flexDirection: 'row', marginTop: 4 } }, renderStars(p.stars))
          ),
          React.createElement(ScoreBadge, { score: p.score, color: p.scoreColor, size: 52 })
        ),
        React.createElement(View, { style: styles.modalDivider }),
        p.features.map((f, i) =>
          React.createElement(
            View,
            { key: i, style: styles.modalFeatureRow },
            React.createElement(
              Text,
              { style: [styles.modalFeatureIcon, { color: getFeatureColor(f.status) }] },
              f.status === 'ok' ? '✅' : f.status === 'warning' ? '⚠️' : '❌'
            ),
            React.createElement(Text, { style: styles.modalFeatureLabel }, f.label)
          )
        ),
        React.createElement(
          TouchableOpacity,
          { style: styles.modalClose, onPress: props.onClose, activeOpacity: 0.8 },
          React.createElement(Text, { style: styles.modalCloseText }, 'Fermer')
        )
      )
    )
  );
}

// ─── Écran principal ──────────────────────────────────────────────────────────

const MapScreen = ({ onNavigate, onPressProfile }) => {
  const [activeFilter, setActiveFilter]     = useState('Restaurants & Venues');
  const [activeCategory, setActiveCategory] = useState('Restaurants');
  const [activeView, setActiveView]         = useState('list'); // 'transport' | 'list'
  const [searchQuery, setSearchQuery]       = useState('');
  const [selectedPlace, setSelectedPlace]   = useState(null);

  const filtered = PLACES.filter(
    p =>
      p.category === activeCategory &&
      (searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return React.createElement(
    ScreenLayout,
    { title: 'Carte', activeTab: 'map', onNavigate, onPressProfile },

    React.createElement(
      View,
      { style: styles.screen },

      // ── Barre de recherche ──
      React.createElement(
        View,
        { style: styles.searchBar },
        React.createElement(Text, { style: styles.searchIcon }, '🔍'),
        React.createElement(TextInput, {
          style: styles.searchInput,
          placeholder: 'Café entièrement accessible près de moi',
          placeholderTextColor: '#94a3b8',
          value: searchQuery,
          onChangeText: setSearchQuery,
        }),
        React.createElement(Text, { style: styles.searchIcon }, '🎙️')
      ),

      // ── Filtres chips ──
      React.createElement(
        ScrollView,
        { horizontal: true, showsHorizontalScrollIndicator: false, style: styles.filtersRow, contentContainerStyle: { paddingHorizontal: Spacing.md } },
        FILTERS.map(f =>
          React.createElement(
            TouchableOpacity,
            {
              key: f,
              style: [
                styles.filterChip,
                activeFilter === f && {
                  backgroundColor:
                    f === 'Public Transport' ? '#22c55e' :
                    f === 'Restaurants & Venues' ? '#ef4444' : '#64748b',
                },
              ],
              onPress: () => { setActiveFilter(f); setActiveView(f === 'Public Transport' ? 'transport' : 'list'); },
              activeOpacity: 0.8,
            },
            React.createElement(
              Text,
              {
                style: [
                  styles.filterChipText,
                  activeFilter === f && { color: '#fff' },
                ],
              },
              (f === 'Public Transport' ? '🚌 ' : f === 'Restaurants & Venues' ? '🍽️ ' : '📍 ') + f
            )
          )
        )
      ),

      // ── Carte simulée ──
      React.createElement(MockMap),

      // ── Vue Transport ──
      activeView === 'transport' && React.createElement(
        ScrollView,
        { style: styles.contentScroll, contentContainerStyle: { padding: Spacing.md } },
        React.createElement(TransportCard)
      ),

      // ── Vue Liste de lieux ──
      activeView === 'list' && React.createElement(
        View,
        { style: styles.listContainer },

        // Onglets catégories
        React.createElement(
          View,
          { style: styles.categoryTabs },
          CATEGORIES.map(cat =>
            React.createElement(
              TouchableOpacity,
              {
                key: cat,
                style: [styles.categoryTab, activeCategory === cat && styles.categoryTabActive],
                onPress: () => setActiveCategory(cat),
                activeOpacity: 0.8,
              },
              React.createElement(
                Text,
                { style: [styles.categoryTabText, activeCategory === cat && styles.categoryTabTextActive] },
                cat
              )
            )
          )
        ),

        // Liste
        React.createElement(
          ScrollView,
          { style: styles.placesList, showsVerticalScrollIndicator: false },
          filtered.length === 0
            ? React.createElement(
                View,
                { style: styles.emptyState },
                React.createElement(Text, { style: styles.emptyIcon }, '🔍'),
                React.createElement(Text, { style: styles.emptyText }, 'Aucun résultat')
              )
            : filtered.map(place =>
                React.createElement(PlaceRow, {
                  key: place.id,
                  place,
                  onPress: setSelectedPlace,
                })
              )
        )
      ),

      // ── Modal détail lieu ──
      React.createElement(PlaceModal, {
        place: selectedPlace,
        onClose: () => setSelectedPlace(null),
      })
    )
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // Recherche
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
    color: '#94a3b8',
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.md,
    color: Colors.textPrimary,
    fontFamily: undefined,
  },

  // Filtres
  filtersRow: {
    marginBottom: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },

  // Carte simulée
  mapContainer: {
    height: 180,
    backgroundColor: '#e8f4f8',
    position: 'relative',
    overflow: 'hidden',
  },
  mapBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#dbeafe',
  },
  mapRiver: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '52%',
    height: 14,
    backgroundColor: '#93c5fd',
    opacity: 0.5,
    borderRadius: 4,
  },
  mapBlock: {
    position: 'absolute',
    backgroundColor: '#f0fdf4',
    borderRadius: 4,
    opacity: 0.7,
  },
  mapStreetH1: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '35%',
    height: 5,
    backgroundColor: '#c8d8e8',
  },
  mapStreetH2: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '62%',
    height: 4,
    backgroundColor: '#c8d8e8',
  },
  mapStreetV1: {
    position: 'absolute',
    left: '32%',
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: '#c8d8e8',
  },
  mapStreetV2: {
    position: 'absolute',
    left: '62%',
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#c8d8e8',
  },
  mapPin: {
    position: 'absolute',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  mapPinText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  mapMetroPin: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#dc2626',
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapMetroText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
  mapUserDot: {
    position: 'absolute',
    left: '38%',
    top: '44%',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2563eb',
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 10,
  },
  mapUserPulse: {
    position: 'absolute',
    left: '36.5%',
    top: '40%',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(37,99,235,0.25)',
    zIndex: 9,
  },

  // Transport
  contentScroll: {
    flex: 1,
  },
  transportCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  transportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 8,
  },
  transportName: {
    fontSize: Typography.md,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  transportReports: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  transportScoreLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 2,
    textAlign: 'right',
  },
  transportScore: {
    fontSize: 24,
    fontWeight: '800',
  },
  transportScoreSub: {
    fontSize: 11,
    fontWeight: '600',
  },
  transportFeatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  transportFeatureLabel: {
    fontSize: Typography.md,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  transportFeatureStatus: {
    fontSize: 12,
    fontWeight: '700',
  },
  transportButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  btnConfirm: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  btnConfirmText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  btnReport: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  btnReportText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 13,
  },
  btnSeeReports: {
    marginTop: 8,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  btnSeeReportsText: {
    color: '#64748b',
    fontSize: 13,
  },

  // Liste lieux
  listContainer: {
    flex: 1,
  },
  categoryTabs: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#fff',
    paddingHorizontal: Spacing.sm,
  },
  categoryTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -2,
  },
  categoryTabActive: {
    borderBottomColor: '#2563eb',
  },
  categoryTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
  },
  categoryTabTextActive: {
    color: '#2563eb',
  },
  placesList: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    backgroundColor: '#fff',
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 10,
  },
  placeImg: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#e2e8f0',
  },
  placeInfo: {
    flex: 1,
    minWidth: 0,
  },
  placeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  placeName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  placeType: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 3,
  },
  placeFeatures: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  placeFeatureText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Score badge
  scoreBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  scoreBadgeText: {
    color: '#fff',
    fontWeight: '800',
  },

  // État vide
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyText: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#cbd5e1',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalImg: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    marginBottom: 14,
    backgroundColor: '#e2e8f0',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  modalName: {
    fontSize: Typography.lg,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  modalType: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginBottom: 12,
  },
  modalFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  modalFeatureIcon: {
    fontSize: 18,
  },
  modalFeatureLabel: {
    fontSize: Typography.md,
    color: Colors.textPrimary,
    flex: 1,
  },
  modalClose: {
    marginTop: 16,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: Typography.md,
  },
});

export default MapScreen;