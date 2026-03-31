// ─────────────────────────────────────────────
//  AccessiWay — Écran Carte (Map)
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
  Dimensions,
} from 'react-native';
import ScreenLayout from '../components/ScreenLayout';

var SCREEN_W = Dimensions.get('window').width;

// ─── Brand Colors ─────────────────────────────────────────────────────────────
var BRAND = {
  primary: '#1a56db',
  primaryDark: '#1e3a8a',
  green: '#16a34a',
  yellow: '#ca8a04',
  red: '#dc2626',
  chipTransport: '#22c55e',
  chipRestaurant: '#ef4444',
  chipNearby: '#64748b',
  textPrimary: '#0f172a',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  bg: '#f8fafc',
};

// ─── Data ─────────────────────────────────────────────────────────────────────

var FILTERS = [
  { key: 'transport',   label: 'Public Transport',     icon: '🚌', color: BRAND.chipTransport },
  { key: 'restaurants', label: 'Restaurants & Venues', icon: '🍽️', color: BRAND.chipRestaurant },
  { key: 'nearby',      label: 'Nearby',               icon: '📍', color: BRAND.chipNearby },
];

var CATEGORIES = ['Nearby', 'Restaurants', 'Venues', 'Sightseeing'];

var TRANSPORT_STOP = {
  name: 'Debourg – Metro Line B',
  score: 70,
  scoreLabel: 'Good Reliability',
  scoreColor: BRAND.yellow,
  reports: 9,
  updated: '8m ago',
  features: [
    { icon: '🛗', label: 'Elevator',       status: 'WORKING',        statusColor: BRAND.green,  statusIcon: '✓' },
    { icon: '↗️', label: 'Escalator',      status: 'OUT OF SERVICE', statusColor: BRAND.red,    statusIcon: '✕' },
    { icon: '⚠️', label: 'Step-free exit', status: 'LIMITED',        statusColor: BRAND.yellow, statusIcon: '⚠' },
  ],
};

var PLACES = [
  { id: 1, name: 'Le Saint Laurent',      type: 'Pizza Restaurant',              stars: 3.5, score: 91,  scoreColor: BRAND.green,  category: 'Restaurants', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=80&h=80&fit=crop',  features: [{ label: 'Ramp', status: 'ok' }, { label: 'Accessible Toilets', status: 'ok' }],             px: 0.18, py: 0.44 },
  { id: 2, name: 'Sipres',                type: 'French Cuisine · 1 Michelin Star', stars: 3, score: 100, scoreColor: BRAND.green,  category: 'Restaurants', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=80&h=80&fit=crop',  features: [{ label: 'Ramp', status: 'ok' }, { label: 'Accessible Toilets', status: 'ok' }],             px: 0.50, py: 0.28 },
  { id: 3, name: 'Tram 33',               type: 'Cocktail Bar',                  stars: 1.5, score: 58,  scoreColor: BRAND.red,    category: 'Restaurants', img: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=80&h=80&fit=crop',  features: [{ label: 'Ramp', status: 'ok' }, { label: 'Toilet on 2nd floor', status: 'warning' }],       px: 0.72, py: 0.55 },
  { id: 4, name: "La Table d'Ambre",      type: 'French Cuisine',                stars: 4,   score: 77,  scoreColor: BRAND.yellow, category: 'Restaurants', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=80&h=80&fit=crop',  features: [{ label: 'Ramp', status: 'error' }, { label: 'Accessible Toilets', status: 'ok' }],           px: 0.82, py: 0.38 },
  { id: 5, name: 'Anahera',               type: 'Coffee Shop',                   stars: 5,   score: 64,  scoreColor: BRAND.yellow, category: 'Restaurants', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=80&h=80&fit=crop',  features: [{ label: 'Ramp', status: 'ok' }, { label: '3 steps to enter toilet', status: 'warning' }],   px: 0.35, py: 0.65 },
  { id: 6, name: 'Musée des Confluences', type: 'Museum',                        stars: 4.5, score: 88,  scoreColor: BRAND.green,  category: 'Sightseeing', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop',  features: [{ label: 'Ramp', status: 'ok' }, { label: 'Accessible Toilets', status: 'ok' }],             px: 0.60, py: 0.72 },
  { id: 7, name: 'Opéra de Lyon',         type: 'Opera House',                   stars: 4,   score: 72,  scoreColor: BRAND.yellow, category: 'Venues',      img: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=80&h=80&fit=crop',  features: [{ label: 'Ramp', status: 'ok' }, { label: 'Limited wheelchair spaces', status: 'warning' }], px: 0.25, py: 0.20 },
  { id: 8, name: "Parc de la Tête d'Or", type: 'Park',                           stars: 4.5, score: 95,  scoreColor: BRAND.green,  category: 'Nearby',      img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=80&h=80&fit=crop',  features: [{ label: 'Accessible paths', status: 'ok' }, { label: 'Accessible Toilets', status: 'ok' }],   px: 0.88, py: 0.20 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function featureColor(status) {
  return status === 'ok' ? BRAND.green : status === 'warning' ? BRAND.yellow : BRAND.red;
}

function Stars({ count }) {
  return React.createElement(
    View, { style: { flexDirection: 'row', gap: 1 } },
    [0, 1, 2, 3, 4].map((i) => {
      var full = i < Math.floor(count);
      var half = !full && i < count;
      return React.createElement(Text, { key: i, style: { color: '#f59e0b', opacity: full ? 1 : half ? 0.55 : 0.2, fontSize: 11 } }, '★');
    })
  );
}

function ScoreBadge({ score, color, size = 40 }) {
  return React.createElement(
    View,
    { style: { width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: 'center', justifyContent: 'center', flexShrink: 0, shadowColor: color, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 } },
    React.createElement(Text, { style: { color: '#fff', fontWeight: '900', fontSize: size > 44 ? 17 : 13 } }, String(score))
  );
}

// ─── Map View ─────────────────────────────────────────────────────────────────

function MapView({ activeFilter }) {
  var MAP_H = 220;
  var W = SCREEN_W;
  return React.createElement(
    View, { style: { width: W, height: MAP_H, overflow: 'hidden' } },
    React.createElement(View, { style: { position: 'absolute', inset: 0, backgroundColor: '#e8f4f8' } }),
    React.createElement(View, { style: { position: 'absolute', top: MAP_H * 0.30, left: -20, width: W + 40, height: 28, backgroundColor: '#93c5fd', opacity: 0.85, transform: [{ rotate: '-6deg' }] } }),
    React.createElement(View, { style: { position: 'absolute', top: 8, left: 8, width: W * 0.26, height: MAP_H * 0.32, backgroundColor: '#dcfce7', borderRadius: 6, opacity: 0.75 } }),
    React.createElement(View, { style: { position: 'absolute', top: 8, left: W * 0.36, width: W * 0.24, height: MAP_H * 0.25, backgroundColor: '#fef9c3', borderRadius: 6, opacity: 0.75 } }),
    React.createElement(View, { style: { position: 'absolute', top: MAP_H * 0.52, left: W * 0.28, width: W * 0.32, height: MAP_H * 0.38, backgroundColor: '#eff6ff', borderRadius: 6, opacity: 0.7 } }),
    React.createElement(View, { style: { position: 'absolute', top: MAP_H * 0.38, left: W * 0.64, width: W * 0.32, height: MAP_H * 0.42, backgroundColor: '#f0fdf4', borderRadius: 6, opacity: 0.65 } }),
    ...[0.30, 0.58, 0.15, 0.75].map((t, i) => React.createElement(View, { key: 'hr' + i, style: { position: 'absolute', top: MAP_H * t, left: 0, right: 0, height: i < 2 ? 5 : 3, backgroundColor: '#fff', opacity: i < 2 ? 0.9 : 0.6 } })),
    ...[0.30, 0.62, 0.11, 0.84].map((l, i) => React.createElement(View, { key: 'vr' + i, style: { position: 'absolute', top: 0, bottom: 0, left: W * l, width: i < 2 ? 4 : 3, backgroundColor: '#fff', opacity: i < 2 ? 0.9 : 0.6 } })),
    React.createElement(View, { style: { position: 'absolute', top: MAP_H * 0.70, left: W * 0.04, width: W * 0.42, height: 3, backgroundColor: BRAND.primary, opacity: 0.8, transform: [{ rotate: '-16deg' }] } }),
    React.createElement(View, { style: { position: 'absolute', top: MAP_H * 0.40, left: W * 0.36, width: W * 0.52, height: 3, backgroundColor: BRAND.primary, opacity: 0.8, transform: [{ rotate: '-16deg' }] } }),
    React.createElement(TouchableOpacity, { style: { position: 'absolute', top: MAP_H * 0.45, left: W * 0.39, width: 30, height: 30, borderRadius: 8, backgroundColor: '#dc2626', borderWidth: 2.5, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 5 } },
      React.createElement(Text, { style: { color: '#fff', fontWeight: '900', fontSize: 13 } }, 'M')
    ),
    PLACES.map((p) => React.createElement(View, { key: p.id, style: { position: 'absolute', top: MAP_H * p.py - 14, left: W * p.px - 20, backgroundColor: p.scoreColor, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 8, borderWidth: 2, borderColor: '#fff', elevation: 5 } },
      React.createElement(Text, { style: { color: '#fff', fontWeight: '900', fontSize: 12 } }, String(p.score))
    )),
    React.createElement(View, { style: { position: 'absolute', top: MAP_H * 0.48 - 14, left: W * 0.44 - 14, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(37,99,235,0.18)' } }),
    React.createElement(View, { style: { position: 'absolute', top: MAP_H * 0.48 - 8, left: W * 0.44 - 8, width: 16, height: 16, borderRadius: 8, backgroundColor: BRAND.primary, borderWidth: 2.5, borderColor: '#fff', elevation: 7 } }),
    React.createElement(TouchableOpacity, { style: { position: 'absolute', top: 10, right: 10, width: 34, height: 34, backgroundColor: '#fff', borderRadius: 8, alignItems: 'center', justifyContent: 'center', elevation: 3 } },
      React.createElement(Text, { style: { fontSize: 16 } }, '🗺️')
    )
  );
}

// ─── Place Row ────────────────────────────────────────────────────────────────

function PlaceRow({ place, onPress }) {
  return React.createElement(
    TouchableOpacity, { style: styles.placeRow, onPress: () => onPress(place), activeOpacity: 0.7 },
    React.createElement(Image, { source: { uri: place.img }, style: styles.placeImg }),
    React.createElement(
      View, { style: styles.placeInfo },
      React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap' } },
        React.createElement(Text, { style: styles.placeName, numberOfLines: 1 }, place.name),
        React.createElement(Stars, { count: place.stars })
      ),
      React.createElement(Text, { style: styles.placeType, numberOfLines: 1 }, place.type),
      React.createElement(View, { style: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 } },
        place.features.map((f, i) => React.createElement(View, { key: i, style: { flexDirection: 'row', alignItems: 'center', gap: 3 } },
          React.createElement(Text, { style: { fontSize: 11, color: featureColor(f.status) } }, f.status === 'ok' ? '✓' : f.status === 'warning' ? '⚠' : '✕'),
          React.createElement(Text, { style: { fontSize: 11, color: BRAND.textSecondary } }, f.label)
        ))
      )
    ),
    React.createElement(ScoreBadge, { score: place.score, color: place.scoreColor, size: 40 })
  );
}

// ─── Transport Card ───────────────────────────────────────────────────────────

function TransportCard() {
  var s = TRANSPORT_STOP;
  return React.createElement(
    View, { style: styles.transportCard },
    React.createElement(View, { style: styles.transportHeader },
      React.createElement(View, { style: { flex: 1 } },
        React.createElement(Text, { style: styles.transportName }, s.name),
        React.createElement(Text, { style: styles.transportMeta }, 'Based on ' + s.reports + ' verified user reports · Updated ' + s.updated)
      ),
      React.createElement(View, { style: { alignItems: 'flex-end' } },
        React.createElement(Text, { style: styles.transportScoreLabel }, 'Reliability Score'),
        React.createElement(View, { style: { flexDirection: 'row', alignItems: 'baseline', gap: 6 } },
          React.createElement(Text, { style: [styles.transportScoreNum, { color: s.scoreColor }] }, String(s.score)),
          React.createElement(Text, { style: [styles.transportScoreTag, { color: s.scoreColor }] }, '(' + s.scoreLabel + ')')
        )
      )
    ),
    React.createElement(View, { style: { height: 1, backgroundColor: BRAND.border, marginBottom: 4 } }),
    s.features.map((f, i) => React.createElement(View, { key: i, style: styles.featureRow },
      React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', gap: 10 } },
        React.createElement(Text, { style: { fontSize: 20 } }, f.icon),
        React.createElement(Text, { style: styles.featureLabel }, f.label)
      ),
      React.createElement(Text, { style: [styles.featureStatus, { color: f.statusColor }] }, f.statusIcon + ' ' + f.status)
    )),
    React.createElement(View, { style: styles.transportBtnRow },
      React.createElement(TouchableOpacity, { style: styles.btnConfirm, activeOpacity: 0.85 }, React.createElement(Text, { style: styles.btnConfirmText }, '✓  Confirm Status')),
      React.createElement(TouchableOpacity, { style: styles.btnReport, activeOpacity: 0.85 }, React.createElement(Text, { style: styles.btnReportText }, 'Report an Issue'))
    ),
    React.createElement(TouchableOpacity, { style: styles.btnSeeReports, activeOpacity: 0.85 }, React.createElement(Text, { style: styles.btnSeeReportsText }, 'See verified user reports'))
  );
}

// ─── Place Modal ──────────────────────────────────────────────────────────────

function PlaceModal({ place, onClose }) {
  if (!place) return null;
  var p = place;
  return React.createElement(
    Modal, { visible: true, transparent: true, animationType: 'slide', onRequestClose: onClose },
    React.createElement(TouchableOpacity, { style: styles.modalOverlay, activeOpacity: 1, onPress: onClose },
      React.createElement(View, { style: styles.modalSheet },
        React.createElement(View, { style: styles.modalHandle }),
        React.createElement(Image, { source: { uri: p.img }, style: styles.modalHero }),
        React.createElement(View, { style: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 } },
          React.createElement(View, { style: { flex: 1 } },
            React.createElement(Text, { style: styles.modalName }, p.name),
            React.createElement(Text, { style: styles.modalType }, p.type),
            React.createElement(Stars, { count: p.stars })
          ),
          React.createElement(ScoreBadge, { score: p.score, color: p.scoreColor, size: 54 })
        ),
        React.createElement(View, { style: { height: 1, backgroundColor: BRAND.border, marginVertical: 12 } }),
        p.features.map((f, i) => React.createElement(View, { key: i, style: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 7 } },
          React.createElement(Text, { style: { fontSize: 18 } }, f.status === 'ok' ? '✅' : f.status === 'warning' ? '⚠️' : '❌'),
          React.createElement(Text, { style: { fontSize: 14, color: BRAND.textPrimary, flex: 1 } }, f.label)
        )),
        React.createElement(TouchableOpacity, { style: styles.modalCloseBtn, onPress: onClose, activeOpacity: 0.85 },
          React.createElement(Text, { style: styles.modalCloseBtnText }, 'Close')
        )
      )
    )
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

var MapScreen = function (props) {
  var [activeFilter, setActiveFilter]     = useState('restaurants');
  var [activeCategory, setActiveCategory] = useState('Restaurants');
  var [searchQuery, setSearchQuery]       = useState('');
  var [selectedPlace, setSelectedPlace]   = useState(null);

  var isTransport = activeFilter === 'transport';

  var filtered = PLACES.filter((p) =>
    p.category === activeCategory &&
    (searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    // ── ScreenLayout générique (header + bottomnav partagés) ──
    <ScreenLayout
      activeTab="map"
      onNavigate={props.onNavigate}
      onPressProfile={props.onPressProfile}
    >
      <View style={styles.root}>

        {/* ── Barre de recherche ── */}
        {React.createElement(View, { style: styles.searchBar },
          React.createElement(Text, { style: { fontSize: 14, color: BRAND.textSecondary } }, '🔍'),
          React.createElement(TextInput, {
            style: styles.searchInput,
            placeholder: 'Fully accessible coffee shop near me',
            placeholderTextColor: '#94a3b8',
            value: searchQuery,
            onChangeText: setSearchQuery,
          }),
          React.createElement(TouchableOpacity, null,
            React.createElement(Text, { style: { fontSize: 14, color: BRAND.textSecondary } }, '🎙️')
          )
        )}

        {/* ── Filtres ── */}
        {React.createElement(ScrollView,
          { horizontal: true, showsHorizontalScrollIndicator: false, style: { flexGrow: 0, marginBottom: 2 }, contentContainerStyle: { paddingHorizontal: 12, gap: 8, paddingVertical: 4 } },
          FILTERS.map((f) => {
            var active = activeFilter === f.key;
            return React.createElement(TouchableOpacity, {
              key: f.key,
              style: [styles.filterChip, active && { backgroundColor: f.color, borderColor: f.color }],
              onPress: () => setActiveFilter(f.key),
              activeOpacity: 0.8,
            },
              React.createElement(Text, { style: [styles.filterChipText, active && { color: '#fff' }] }, f.icon + '  ' + f.label)
            );
          })
        )}

        {/* ── Carte ── */}
        <MapView activeFilter={activeFilter} />

        {/* ── Contenu ── */}
        {isTransport
          ? React.createElement(ScrollView, { style: { flex: 1, backgroundColor: BRAND.bg }, contentContainerStyle: { padding: 14 } },
              React.createElement(TransportCard, null)
            )
          : React.createElement(View, { style: { flex: 1, backgroundColor: '#fff' } },
              React.createElement(View, { style: styles.catTabsRow },
                CATEGORIES.map((cat) => {
                  var active = activeCategory === cat;
                  return React.createElement(TouchableOpacity, {
                    key: cat,
                    style: [styles.catTab, active && styles.catTabActive],
                    onPress: () => setActiveCategory(cat),
                    activeOpacity: 0.8,
                  },
                    React.createElement(Text, { style: [styles.catTabText, active && styles.catTabTextActive] }, cat)
                  );
                })
              ),
              React.createElement(ScrollView, { style: { flex: 1 }, showsVerticalScrollIndicator: false },
                filtered.length === 0
                  ? React.createElement(View, { style: { alignItems: 'center', paddingVertical: 40 } },
                      React.createElement(Text, { style: { fontSize: 36 } }, '🔍'),
                      React.createElement(Text, { style: { fontSize: 14, color: BRAND.textSecondary, marginTop: 8 } }, 'No results')
                    )
                  : filtered.map((place) => React.createElement(PlaceRow, { key: place.id, place, onPress: setSelectedPlace }))
              )
            )
        }

        {/* ── Modal détail lieu ── */}
        <PlaceModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />

      </View>
    </ScreenLayout>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

var styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },

  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 12, marginHorizontal: 12, marginTop: 10, marginBottom: 6, paddingHorizontal: 12, paddingVertical: 10, gap: 8, borderWidth: 1, borderColor: BRAND.border },
  searchInput: { flex: 1, fontSize: 13, color: BRAND.textPrimary },

  filterChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: '#f1f5f9', borderWidth: 1.5, borderColor: BRAND.border },
  filterChipText: { fontSize: 12, fontWeight: '700', color: BRAND.textSecondary },

  catTabsRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: BRAND.border, paddingHorizontal: 4, backgroundColor: '#fff' },
  catTab: { flex: 1, paddingVertical: 11, alignItems: 'center', borderBottomWidth: 2.5, borderBottomColor: 'transparent', marginBottom: -1 },
  catTabActive: { borderBottomColor: BRAND.primary },
  catTabText: { fontSize: 12, fontWeight: '700', color: '#94a3b8' },
  catTabTextActive: { color: BRAND.primary },

  placeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#f8fafc', gap: 10, backgroundColor: '#fff' },
  placeImg: { width: 54, height: 54, borderRadius: 10, backgroundColor: '#e2e8f0', flexShrink: 0 },
  placeInfo: { flex: 1, minWidth: 0 },
  placeName: { fontSize: 13, fontWeight: '800', color: BRAND.textPrimary },
  placeType: { fontSize: 11, color: BRAND.textSecondary, marginTop: 2 },

  transportCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: BRAND.border, elevation: 3 },
  transportHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, gap: 10 },
  transportName: { fontSize: 16, fontWeight: '900', color: BRAND.textPrimary, marginBottom: 3 },
  transportMeta: { fontSize: 11, color: BRAND.textSecondary, lineHeight: 16 },
  transportScoreLabel: { fontSize: 11, color: BRAND.textSecondary, marginBottom: 2, textAlign: 'right' },
  transportScoreNum: { fontSize: 28, fontWeight: '900', lineHeight: 32 },
  transportScoreTag: { fontSize: 12, fontWeight: '700' },
  featureRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 11, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  featureLabel: { fontSize: 14, fontWeight: '500', color: BRAND.textPrimary },
  featureStatus: { fontSize: 13, fontWeight: '800', letterSpacing: 0.3 },
  transportBtnRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  btnConfirm: { flex: 1, backgroundColor: BRAND.primary, borderRadius: 12, paddingVertical: 12, alignItems: 'center', elevation: 4 },
  btnConfirmText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  btnReport: { flex: 1, backgroundColor: '#fff', borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1.5, borderColor: BRAND.border },
  btnReportText: { color: BRAND.textSecondary, fontWeight: '700', fontSize: 13 },
  btnSeeReports: { marginTop: 8, borderRadius: 12, paddingVertical: 11, alignItems: 'center', borderWidth: 1.5, borderColor: BRAND.border },
  btnSeeReportsText: { color: BRAND.textSecondary, fontSize: 13, fontWeight: '500' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 36 },
  modalHandle: { width: 40, height: 4, backgroundColor: '#cbd5e1', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  modalHero: { width: '100%', height: 150, borderRadius: 14, marginBottom: 14, backgroundColor: '#e2e8f0' },
  modalName: { fontSize: 18, fontWeight: '900', color: BRAND.textPrimary },
  modalType: { fontSize: 13, color: BRAND.textSecondary, marginTop: 2, marginBottom: 4 },
  modalCloseBtn: { marginTop: 18, backgroundColor: BRAND.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center', elevation: 4 },
  modalCloseBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});

export default MapScreen;